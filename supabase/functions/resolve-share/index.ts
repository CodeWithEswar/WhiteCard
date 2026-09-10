import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.116.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

async function sha256Hex(text: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(text)
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: "SERVER_CONFIGURATION_ERROR" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const { token } = await req.json().catch(() => ({}))

    if (!token || typeof token !== "string" || token.length < 16) {
      return new Response(
        JSON.stringify({ error: "INVALID_TOKEN_FORMAT" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // 1. Calculate SHA-256 of raw inbound token
    const tokenHash = await sha256Hex(token.trim())

    // 2. Initialize privileged server client
    const supabase = createClient(supabaseUrl, serviceRoleKey)

    // 3. Find matching share link
    const { data: share, error: shareError } = await supabase
      .from("share_links")
      .select("id, document_id, expires_at, revoked_at")
      .eq("token_hash", tokenHash)
      .maybeSingle()

    if (shareError || !share) {
      return new Response(
        JSON.stringify({ error: "SHARE_NOT_FOUND" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // 4. Reject revoked share
    if (share.revoked_at) {
      return new Response(
        JSON.stringify({ error: "SHARE_REVOKED" }),
        { status: 410, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // 5. Reject expired share
    if (new Date(share.expires_at).getTime() <= Date.now()) {
      return new Response(
        JSON.stringify({ error: "SHARE_EXPIRED" }),
        { status: 410, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // 6. Fetch document metadata
    const { data: document, error: docError } = await supabase
      .from("documents")
      .select("title, original_name, mime_type, size_bytes, storage_path")
      .eq("id", share.document_id)
      .maybeSingle()

    if (docError || !document) {
      return new Response(
        JSON.stringify({ error: "DOCUMENT_UNAVAILABLE" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // 7. Create short-lived 5-minute signed URL
    const { data: signedData, error: signedError } = await supabase.storage
      .from("documents")
      .createSignedUrl(document.storage_path, 300) // 5 minutes

    if (signedError || !signedData?.signedUrl) {
      return new Response(
        JSON.stringify({ error: "SIGNED_URL_FAILED" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // 8. Return minimal public payload (no private notes, owner id, or internal path)
    return new Response(
      JSON.stringify({
        document: {
          title: document.title,
          originalName: document.original_name,
          mimeType: document.mime_type,
          sizeBytes: document.size_bytes,
        },
        fileUrl: signedData.signedUrl,
        expiresAt: share.expires_at,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    )
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: "INTERNAL_SERVER_ERROR" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})

import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Download01Icon,
  ShieldCheckIcon,
  Clock01Icon,
  AlertCircleIcon,
  ViewIcon,
  CursorPointer01Icon,
  File01Icon,
  ArrowRight01Icon,
  CheckmarkBadge01Icon,
} from '@hugeicons/core-free-icons'
import { WhiteCardLogo } from '../components/brand/white-card-logo'
import { AppIcon } from '../components/icons/app-icon'
import { RadialGridBackground } from '../components/backgrounds/radial-grid-background'
import { vaultStore, isSupabaseConfigured } from '../lib/supabase'
import { PageMeta } from '../components/seo/page-meta'

interface ResolvedShareData {
  title: string
  originalName: string
  mimeType: string
  sizeBytes: number
  sizeFormatted: string
  category?: string
  space?: string
  fileUrl: string
  expiresAt: string
  viewCount: number
  clickCount: number
}

export function PublicSharePage() {
  const { token } = useParams<{ token: string }>()
  const [data, setData] = useState<ResolvedShareData | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorStatus, setErrorStatus] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    async function resolveToken() {
      if (!token) {
        setErrorStatus('INVALID_LINK')
        setLoading(false)
        return
      }

      setLoading(true)
      setErrorStatus(null)

      try {
        // 1. If Supabase edge function is deployed and live, try invoking it
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        if (isSupabaseConfigured && supabaseUrl) {
          try {
            const res = await fetch(`${supabaseUrl}/functions/v1/resolve-share`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token }),
            })

            if (res.ok) {
              const result = await res.json()
              setData({
                title: result.document.title,
                originalName: result.document.originalName,
                mimeType: result.document.mimeType || 'application/pdf',
                sizeBytes: result.document.sizeBytes || 1024,
                sizeFormatted: `${((result.document.sizeBytes || 1024) / (1024 * 1024)).toFixed(1)} MB`,
                fileUrl: result.fileUrl,
                expiresAt: result.expiresAt,
                viewCount: result.viewCount || 1,
                clickCount: result.clickCount || 0,
              })
              setLoading(false)
              return
            }
          } catch (e) {
            // Fallback to local vault resolution below
          }
        }

        // 2. Local Vault fallback resolution
        const localDoc = vaultStore.getDocumentByShareToken(token)

        if (!localDoc || !localDoc.sharedDirectLink) {
          setErrorStatus('LINK_NOT_FOUND')
          setLoading(false)
          return
        }

        const expiresAtTime = new Date(localDoc.sharedDirectLink.expiresAt).getTime()
        if (expiresAtTime <= Date.now()) {
          setErrorStatus('LINK_EXPIRED')
          setLoading(false)
          return
        }

        // Increment view count locally
        vaultStore.incrementViewCount(localDoc.id)

        setData({
          title: localDoc.title,
          originalName: localDoc.originalFilename,
          mimeType: localDoc.mimeType,
          sizeBytes: localDoc.sizeBytes,
          sizeFormatted: localDoc.sizeFormatted,
          category: localDoc.category,
          space: localDoc.space,
          fileUrl: localDoc.fileUrl || '#',
          expiresAt: localDoc.sharedDirectLink.expiresAt,
          viewCount: (localDoc.viewCount || 0) + 1,
          clickCount: localDoc.clickCount || 0,
        })
      } catch (err: any) {
        console.error('Failed to resolve share token:', err)
        setErrorStatus('UNEXPECTED_ERROR')
      } finally {
        setLoading(false)
      }
    }

    resolveToken()
  }, [token])

  const handleDownload = () => {
    if (!data) return
    setDownloading(true)

    // Update click count locally
    if (token) {
      const localDoc = vaultStore.getDocumentByShareToken(token)
      if (localDoc) {
        vaultStore.incrementClickCount(localDoc.id)
        setData((prev) => (prev ? { ...prev, clickCount: prev.clickCount + 1 } : null))
      }
    }

    // Trigger download
    const link = document.createElement('a')
    link.href = data.fileUrl
    link.download = data.originalName
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setTimeout(() => {
      setDownloading(false)
    }, 1000)
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-background text-foreground selection:bg-primary/20">
      <RadialGridBackground />

      {/* Header */}
      <header className="w-full border-b border-border/70 backdrop-blur-md bg-background/80 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <WhiteCardLogo size={28} showWordmark={true} />
          </Link>

          <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            <AppIcon icon={ShieldCheckIcon} size={14} />
            <span>End-to-End Verified</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-lg">
          {loading && (
            <div className="bg-card border border-border rounded-2xl p-8 text-center space-y-4 shadow-xl">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-medium text-muted-foreground">
                Resolving cryptographic share link...
              </p>
            </div>
          )}

          {!loading && errorStatus && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-destructive/20 rounded-2xl p-8 text-center space-y-4 shadow-xl shadow-destructive/5"
            >
              <div className="w-14 h-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
                <AppIcon icon={AlertCircleIcon} size={28} />
              </div>
              <div className="space-y-1">
                <h1 className="text-lg font-bold text-foreground">
                  {errorStatus === 'LINK_EXPIRED'
                    ? 'Share Link Has Expired'
                    : errorStatus === 'LINK_NOT_FOUND'
                      ? 'Share Link Not Found'
                      : 'Access Denied'}
                </h1>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  {errorStatus === 'LINK_EXPIRED'
                    ? 'This temporary direct link has expired. Please contact the document owner to request a new link.'
                    : 'This document link may have been revoked or does not exist.'}
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-all"
                >
                  <span>Learn About White Card Vault</span>
                  <AppIcon icon={ArrowRight01Icon} size={14} />
                </Link>
              </div>
            </motion.div>
          )}

          {!loading && data && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card/90 backdrop-blur-xl border border-border/80 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/5 space-y-6"
            >
              {/* Space badge */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-muted text-muted-foreground border border-border">
                  {data.space === 'student' ? 'Student Certificate' : 'Government Document'}
                </span>

                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                  <AppIcon icon={Clock01Icon} size={13} />
                  <span>
                    Expires {new Date(data.expiresAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Title & category */}
              <div className="space-y-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  {data.title}
                </h1>
                {data.category && (
                  <p className="text-xs font-medium text-muted-foreground">
                    Category: <span className="text-foreground">{data.category}</span>
                  </p>
                )}
              </div>

              {/* File details card */}
              <div className="p-4 rounded-xl bg-muted/40 border border-border/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-md bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                    <AppIcon icon={File01Icon} size={20} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {data.originalName}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {data.sizeFormatted} • {data.mimeType.split('/')[1]?.toUpperCase() || 'DOCUMENT'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <AppIcon icon={CheckmarkBadge01Icon} size={18} />
                </div>
              </div>

              {/* Metrics bar: Views and Clicks */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-background border border-border/70 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                    <AppIcon icon={ViewIcon} size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">{data.viewCount}</div>
                    <div className="text-[10px] text-muted-foreground">Total Views</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-background border border-border/70 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                    <AppIcon icon={CursorPointer01Icon} size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">{data.clickCount}</div>
                    <div className="text-[10px] text-muted-foreground">Downloads / Clicks</div>
                  </div>
                </div>
              </div>

              {/* Download Action */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="w-full h-12 flex items-center justify-center gap-2 px-6 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer shadow-sm disabled:opacity-50"
                >
                  <AppIcon icon={Download01Icon} size={18} />
                  <span>{downloading ? 'Preparing Download...' : 'Download Document'}</span>
                </button>

                <p className="text-center text-[11px] text-muted-foreground">
                  Downloaded directly from secure private vault storage.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border/60 py-4 px-6 text-center text-xs text-muted-foreground">
        <span>Secured by </span>
        <Link to="/" className="font-semibold text-foreground hover:underline">
          White Card Vault
        </Link>
        <span> — Zero OCR, Private S3 Storage, Cryptographic Sharing.</span>
      </footer>
    </div>
  )
}

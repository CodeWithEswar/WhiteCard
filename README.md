# White Card — Personal Document Wallet

A secure, private, calm, and responsive personal digital vault for important personal documents. Designed with two primary spaces:

1. **Government Documents** (Passports, National IDs, Driving Licences, Tax Records)
2. **Student Certificates** (Degree Certificates, Consolidated Transcripts, Course Archives)

---

## Key Capabilities

- **Strict Privacy**: Zero OCR, zero automated scanning. Your documents are encrypted and stored in private S3-compatible storage.
- **Spaces & Categories**: Deterministic separation between Government and Student spaces with rich category taxonomy (`Travel & Identity`, `National Identity`, `Degree & Graduation`, `Transcripts & Marks`, etc.).
- **Engagement & Link Analytics**: Real-time tracking of `view_count` and `click_count` (downloads) for both authenticated vault owners and temporary shared links.
- **Cryptographic Sharing**: Ephemeral direct share links (1, 7, or 30 days) using SHA-256 hashed secret tokens and 5-minute signed storage URLs.
- **10 Calibrated Theme Presets**: Default Zinc monochrome, Graphite, Slate, Stone, Blue, Indigo, Violet, Emerald, Amber, Rose, plus independent System/Light/Dark appearance modes.
- **Hugeicons Iconography**: Cohesive, modern icon system throughout the entire interface.
- **Dual-Engine Architecture**: Seamless zero-setup operation via local vault fallback engine with instant sync to live Supabase backend.

---

## Supabase Quickstart

### 1. Database Schema
Copy and execute [`supabase/schema.sql`](supabase/schema.sql) in your [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql/new). It is idempotent and configures:
- Extensions (`pgcrypto`)
- Custom enums (`document_space`, `document_status`, `appearance_mode`, `activity_action`)
- Tables: `profiles`, `documents`, `tags`, `document_tags`, `share_links`, `activity_events`, `user_preferences`
- Automatic user provisioning triggers for new sign-ups
- Row-Level Security (RLS) policies on all tables
- Stored procedures: `create_document_share`, `revoke_document_share`, `increment_document_view`, `increment_document_click`, `increment_share_view`, `increment_share_click`

### 2. Storage Bucket
Run [`supabase/storage.sql`](supabase/storage.sql) or section 13 of `schema.sql` to configure the `documents` storage bucket:
- **Bucket ID**: `documents`
- **Public**: `false` (Private vault)
- **Max File Size**: 50 MB
- **RLS Path Scoping**: `{user_id}/{space}/{document_id}/{filename}`

### 3. Edge Function (Share Resolver)
Deploy the public share resolution Edge Function:
```bash
supabase functions deploy resolve-share --no-verify-jwt
```

---

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file (refer to [`.env.example`](.env.example)):
```env
VITE_SUPABASE_URL=https://qodegjsqimnciniiziwp.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_C9FxLYTQ2jcwFA9TafvQBQ_Xq7wrT6J
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build Production Bundle
```bash
npm run build
```

---

## Project Structure

```text
├── src/
│   ├── app/
│   │   └── router.tsx               # Route declarations (/app, /auth, /share/:token)
│   ├── components/
│   │   ├── app-sidebar.tsx          # Responsive navigation sidebar
│   │   ├── backgrounds/             # Subtle radial & grid backgrounds
│   │   ├── brand/                   # White Card custom vector mark
│   │   ├── icons/                   # AppIcon Hugeicons wrapper
│   │   └── layout/                  # AppShell, PageContainer, ResponsiveDialog
│   ├── config/
│   │   └── themes.ts                # 10 theme configurations
│   ├── features/
│   │   ├── dashboard/               # Space cards, storage summary, recent docs
│   │   ├── documents/               # Document cards, list rows, preview, filters
│   │   ├── landing/                 # Hero, features, security, interactive preview
│   │   ├── settings/                # Theme picker, appearance controls
│   │   ├── sharing/                 # Share link creator dialog
│   │   └── upload/                  # Drag-and-drop dropzone, metadata form
│   ├── lib/
│   │   ├── supabase.ts              # Supabase client & local vault store
│   │   └── query-client.ts          # TanStack query configuration
│   ├── pages/                       # Route pages (Dashboard, Detail, Search, Share)
│   └── types/                       # TypeScript interfaces (documents, themes)
└── supabase/
    ├── schema.sql                   # All-in-one production PostgreSQL schema
    ├── storage.sql                  # Storage bucket configuration & policies
    └── functions/
        └── resolve-share/           # Cryptographic public share resolver
```

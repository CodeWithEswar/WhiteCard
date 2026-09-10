import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const publicDir = path.resolve('public')

// Generate Light OG Image SVG (1200x630)
function renderOgSvg(isDark = false) {
  const bg = isDark ? '#09090b' : '#fafafa'
  const cardBg = isDark ? '#18181b' : '#ffffff'
  const border = isDark ? '#27272a' : '#e4e4e7'
  const borderStrong = isDark ? '#3f3f46' : '#d4d4d8'
  const textPrimary = isDark ? '#f4f4f5' : '#09090b'
  const textSecondary = isDark ? '#a1a1aa' : '#52525b'
  const gridColor = isDark ? 'rgba(255,255,255,0.035)' : 'rgba(0,0,0,0.035)'
  const badgeBg = isDark ? '#27272a' : '#f4f4f5'
  const badgeText = isDark ? '#e4e4e7' : '#27272a'
  const brandCardBg = isDark ? '#ffffff' : '#09090b'
  const brandCardMark = isDark ? '#09090b' : '#ffffff'

  // 28px grid pattern
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" fill="none">
  <defs>
    <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
      <path d="M 28 0 L 0 0 0 28" fill="none" stroke="${gridColor}" stroke-width="1"/>
    </pattern>
    <style>
      .title { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-weight: 700; }
      .text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-weight: 400; }
      .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
    </style>
  </defs>

  <!-- Background Base -->
  <rect width="1200" height="630" fill="${bg}" />
  <rect width="1200" height="630" fill="url(#grid)" />

  <!-- Left Content Container (Margins: 84px) -->
  <g transform="translate(84, 76)">
    <!-- Brand Header -->
    <g>
      <!-- Geometric Logo -->
      <rect x="0" y="0" width="44" height="40" rx="10" fill="${brandCardBg}" />
      <path d="M30 0L44 14H34C31.79 14 30 12.21 30 10V0Z" fill="${isDark ? '#71717a' : '#a1a1aa'}" />
      <path d="M8 15L13.5 27L18 17L22.5 27L28 15" stroke="${brandCardMark}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="36" cy="28" r="2.5" fill="${brandCardMark}" />

      <!-- Brand Wordmark -->
      <text x="58" y="27" fill="${textPrimary}" class="title" font-size="24" letter-spacing="-0.5">White Card</text>
      <rect x="186" y="9" width="54" height="22" rx="6" fill="${badgeBg}" stroke="${border}" stroke-width="1" />
      <text x="196" y="24" fill="${textSecondary}" class="title" font-size="11" letter-spacing="0.5">VAULT</text>
    </g>

    <!-- Main Headline -->
    <g transform="translate(0, 110)">
      <text x="0" y="44" fill="${textPrimary}" class="title" font-size="48" letter-spacing="-1.5">Your important documents.</text>
      <text x="0" y="104" fill="${textPrimary}" class="title" font-size="48" letter-spacing="-1.5">One secure place.</text>
    </g>

    <!-- Supporting Copy -->
    <g transform="translate(0, 248)">
      <text x="0" y="0" fill="${textSecondary}" class="text" font-size="18" line-height="28">
        Government documents and student certificates,
      </text>
      <text x="0" y="28" fill="${textSecondary}" class="text" font-size="18" line-height="28">
        organized in one private digital space.
      </text>
    </g>

    <!-- Space Pills / Category Indicators -->
    <g transform="translate(0, 345)">
      <!-- Gov Pill -->
      <rect x="0" y="0" width="220" height="42" rx="12" fill="${cardBg}" stroke="${border}" stroke-width="1.5" />
      <circle cx="22" cy="21" r="5" fill="#3b82f6" />
      <text x="36" y="26" fill="${textPrimary}" class="title" font-size="13">Government Documents</text>

      <!-- Student Pill -->
      <rect x="236" y="0" width="206" height="42" rx="12" fill="${cardBg}" stroke="${border}" stroke-width="1.5" />
      <circle cx="258" cy="21" r="5" fill="#8b5cf6" />
      <text x="272" y="26" fill="${textPrimary}" class="title" font-size="13">Student Certificates</text>
    </g>
  </g>

  <!-- Right Visual Section: Layered Restrained Document Cards -->
  <g transform="translate(710, 80)">
    <!-- Back Card (Shifted & Rotated slightly) -->
    <g transform="translate(30, 20) rotate(4)">
      <rect width="360" height="230" rx="20" fill="${cardBg}" stroke="${border}" stroke-width="1.5" filter="drop-shadow(0 12px 24px rgba(0,0,0,0.06))" />
      <rect x="24" y="24" width="40" height="40" rx="10" fill="${isDark ? '#27272a' : '#f4f4f5'}" />
      <rect x="80" y="28" width="160" height="14" rx="4" fill="${isDark ? '#3f3f46' : '#e4e4e7'}" />
      <rect x="80" y="48" width="90" height="10" rx="3" fill="${isDark ? '#27272a' : '#f4f4f5'}" />
      <line x1="24" y1="90" x2="336" y2="90" stroke="${border}" stroke-width="1" />
      <rect x="24" y="114" width="220" height="10" rx="3" fill="${isDark ? '#27272a' : '#f4f4f5'}" />
      <rect x="24" y="136" width="160" height="10" rx="3" fill="${isDark ? '#27272a' : '#f4f4f5'}" />
      <rect x="24" y="176" width="100" height="26" rx="8" fill="#8b5cf6" opacity="0.12" />
      <text x="36" y="193" fill="#8b5cf6" class="title" font-size="11">ACADEMIC</text>
    </g>

    <!-- Front Card (Primary Focal Document) -->
    <g transform="translate(0, 110) rotate(-2)">
      <rect width="380" height="250" rx="22" fill="${cardBg}" stroke="${borderStrong}" stroke-width="2" filter="drop-shadow(0 20px 35px rgba(0,0,0,0.09))" />
      <!-- Top Bar -->
      <g transform="translate(26, 26)">
        <rect x="0" y="0" width="46" height="46" rx="12" fill="${isDark ? '#27272a' : '#f4f4f5'}" stroke="${border}" stroke-width="1" />
        <rect x="14" y="15" width="18" height="16" rx="3" fill="#3b82f6" opacity="0.85" />

        <text x="60" y="20" fill="${textPrimary}" class="title" font-size="16" letter-spacing="-0.3">National Identity Card</text>
        <text x="60" y="38" fill="${textSecondary}" class="text" font-size="12">Government Space • PDF Verification</text>

        <rect x="270" y="4" width="56" height="24" rx="12" fill="#10b981" opacity="0.12" />
        <text x="278" y="20" fill="#10b981" class="title" font-size="10">ACTIVE</text>
      </g>

      <line x1="26" y1="96" x2="354" y2="96" stroke="${border}" stroke-width="1" />

      <!-- Document Internal Metadata Mockup -->
      <g transform="translate(26, 116)">
        <text x="0" y="14" fill="${textSecondary}" class="text" font-size="11">Document ID</text>
        <text x="0" y="32" fill="${textPrimary}" class="mono" font-size="13">•••• •••• •••• 8492</text>

        <text x="170" y="14" fill="${textSecondary}" class="text" font-size="11">Security Vault</text>
        <text x="170" y="32" fill="${textPrimary}" class="title" font-size="13">SHA-256 Validated</text>
      </g>

      <!-- Bottom Card Tag Bar -->
      <g transform="translate(26, 184)">
        <rect x="0" y="0" width="68" height="24" rx="6" fill="${badgeBg}" />
        <text x="10" y="16" fill="${textSecondary}" class="title" font-size="11">Identity</text>

        <rect x="76" y="0" width="58" height="24" rx="6" fill="${badgeBg}" />
        <text x="86" y="16" fill="${textSecondary}" class="title" font-size="11">Travel</text>

        <text x="264" y="16" fill="${textSecondary}" class="mono" font-size="11">2.4 MB</text>
      </g>
    </g>
  </g>

  <!-- Bottom Accent Line -->
  <rect x="0" y="626" width="1200" height="4" fill="${isDark ? '#27272a' : '#18181b'}" />
</svg>
`
}

// 1. Generate Light og-image.png
const lightSvg = Buffer.from(renderOgSvg(false))
await sharp(lightSvg)
  .resize(1200, 630)
  .png({ quality: 90, compressionLevel: 8 })
  .toFile(path.join(publicDir, 'og-image.png'))
console.log('Created public/og-image.png (Light)')

// 2. Generate Dark og-image-dark.png
const darkSvg = Buffer.from(renderOgSvg(true))
await sharp(darkSvg)
  .resize(1200, 630)
  .png({ quality: 90, compressionLevel: 8 })
  .toFile(path.join(publicDir, 'og-image-dark.png'))
console.log('Created public/og-image-dark.png (Dark)')

// 3. Generate social-card.png (same canonical source)
fs.copyFileSync(path.join(publicDir, 'og-image.png'), path.join(publicDir, 'social-card.png'))
console.log('Created public/social-card.png')

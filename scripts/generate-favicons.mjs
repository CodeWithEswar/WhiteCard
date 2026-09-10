import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const publicDir = path.resolve('public')
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

// 1. MASTER SVG FAVICON (64x64 vector)
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <defs>
    <style>
      .bg { fill: #09090b; }
      .fold { fill: #71717a; }
      .mark { stroke: #fafafa; }
      .dot { fill: #fafafa; }
      @media (prefers-color-scheme: light) {
        .bg { fill: #18181b; }
        .fold { fill: #a1a1aa; }
        .mark { stroke: #ffffff; }
        .dot { fill: #ffffff; }
      }
    </style>
  </defs>
  <!-- Card Silhouette -->
  <rect x="6" y="8" width="52" height="48" rx="12" class="bg" />
  <!-- Folded Corner Accent -->
  <path d="M42 8L58 24H47C44.2386 24 42 21.7614 42 19V8Z" class="fold" />
  <!-- Minimalist Geometric "W" Card Slot Monogram -->
  <path d="M17 26L22.5 38L27 28L31.5 38L37 26" class="mark" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
  <!-- Precision Vault Status Index -->
  <circle cx="48" cy="38" r="3.5" class="dot" />
</svg>
`

fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSvg, 'utf8')
console.log('Created public/favicon.svg')

// Raster SVG with fixed colors for high-res PNGs and Apple Touch Icon
const staticCardSvg = (bg = '#09090b', fold = '#71717a', fg = '#ffffff') => `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" rx="16" fill="${bg === '#09090b' ? '#09090b' : 'transparent'}" />
  <rect x="6" y="8" width="52" height="48" rx="12" fill="${bg}" />
  <path d="M42 8L58 24H47C44.2386 24 42 21.7614 42 19V8Z" fill="${fold}" />
  <path d="M17 26L22.5 38L27 28L31.5 38L37 26" stroke="${fg}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
  <circle cx="48" cy="38" r="3.5" fill="${fg}" />
</svg>
`

// Generate Favicons: 16x16, 32x32, 48x48
const svgBuffer = Buffer.from(staticCardSvg('#09090b', '#71717a', '#ffffff'))

await sharp(svgBuffer)
  .resize(16, 16)
  .png()
  .toFile(path.join(publicDir, 'favicon-16x16.png'))
console.log('Created public/favicon-16x16.png')

await sharp(svgBuffer)
  .resize(32, 32)
  .png()
  .toFile(path.join(publicDir, 'favicon-32x32.png'))
console.log('Created public/favicon-32x32.png')

await sharp(svgBuffer)
  .resize(48, 48)
  .png()
  .toFile(path.join(publicDir, 'favicon-48x48.png'))

// Create favicon.ico (Multi-size ICO containing 16x16, 32x32, 48x48 or clean 32x32 png container)
// Modern browsers accept PNG in .ico, or standard 32x32 ICO header
const buf32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer()
const buf16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer()

function createIco(images) {
  // ICO Header: 6 bytes
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // Reserved
  header.writeUInt16LE(1, 2) // Type: 1 = ICO
  header.writeUInt16LE(images.length, 4) // Number of images

  let offset = 6 + images.length * 16
  const dirEntries = []
  const imageBuffers = []

  for (const img of images) {
    const entry = Buffer.alloc(16)
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0)
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1)
    entry.writeUInt8(0, 2) // Color palette
    entry.writeUInt8(0, 3) // Reserved
    entry.writeUInt16LE(1, 4) // Color planes
    entry.writeUInt16LE(32, 6) // Bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8) // Size of image data
    entry.writeUInt32LE(offset, 12) // Offset of image data
    dirEntries.push(entry)
    imageBuffers.push(img.buffer)
    offset += img.buffer.length
  }

  return Buffer.concat([header, ...dirEntries, ...imageBuffers])
}

const icoBuffer = createIco([
  { width: 16, height: 16, buffer: buf16 },
  { width: 32, height: 32, buffer: buf32 },
])
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer)
console.log('Created public/favicon.ico')

// Apple Touch Icon: 180x180 with safe padding
const appleSvg = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180" fill="none">
  <!-- Solid neutral Zinc-950 background for iOS home screen -->
  <rect width="180" height="180" fill="#09090b" />
  <g transform="translate(18, 18) scale(2.25)">
    <rect x="6" y="8" width="52" height="48" rx="12" fill="#18181b" stroke="#27272a" stroke-width="1" />
    <path d="M42 8L58 24H47C44.2386 24 42 21.7614 42 19V8Z" fill="#71717a" />
    <path d="M17 26L22.5 38L27 28L31.5 38L37 26" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="48" cy="38" r="3.5" fill="#ffffff" />
  </g>
</svg>
`)

await sharp(appleSvg)
  .resize(180, 180)
  .png()
  .toFile(path.join(publicDir, 'apple-touch-icon.png'))
console.log('Created public/apple-touch-icon.png')

// Android Chrome / PWA icons: 192x192 & 512x512
const pwaSvg = (size) => Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none">
  <rect width="${size}" height="${size}" fill="#09090b" rx="${size * 0.22}" />
  <g transform="translate(${size * 0.1}, ${size * 0.1}) scale(${(size * 0.8) / 64})">
    <rect x="6" y="8" width="52" height="48" rx="12" fill="#18181b" stroke="#27272a" stroke-width="1" />
    <path d="M42 8L58 24H47C44.2386 24 42 21.7614 42 19V8Z" fill="#71717a" />
    <path d="M17 26L22.5 38L27 28L31.5 38L37 26" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="48" cy="38" r="3.5" fill="#ffffff" />
  </g>
</svg>
`)

await sharp(pwaSvg(192))
  .resize(192, 192)
  .png()
  .toFile(path.join(publicDir, 'android-chrome-192x192.png'))
console.log('Created public/android-chrome-192x192.png')

await sharp(pwaSvg(512))
  .resize(512, 512)
  .png()
  .toFile(path.join(publicDir, 'android-chrome-512x512.png'))
console.log('Created public/android-chrome-512x512.png')

// Maskable icon: 512x512 with safe area (60% inner content)
const maskableSvg = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" fill="#09090b" />
  <g transform="translate(102, 102) scale(4.8)">
    <rect x="6" y="8" width="52" height="48" rx="12" fill="#18181b" stroke="#27272a" stroke-width="1" />
    <path d="M42 8L58 24H47C44.2386 24 42 21.7614 42 19V8Z" fill="#71717a" />
    <path d="M17 26L22.5 38L27 28L31.5 38L37 26" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="48" cy="38" r="3.5" fill="#ffffff" />
  </g>
</svg>
`)

await sharp(maskableSvg)
  .resize(512, 512)
  .png()
  .toFile(path.join(publicDir, 'maskable-icon-512x512.png'))
console.log('Created public/maskable-icon-512x512.png')

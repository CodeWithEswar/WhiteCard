export type PreviewStrategy =
  | 'image'
  | 'pdf'
  | 'text'
  | 'markdown'
  | 'json'
  | 'csv'
  | 'spreadsheet'
  | 'archive'
  | 'audio'
  | 'video'
  | 'office'
  | 'code'
  | 'generic'

export interface PreviewCapability {
  strategy: PreviewStrategy
  label: string
  canZoom: boolean
  canRotate: boolean
  canPaginate: boolean
  canSearch: boolean
  canFullscreen: boolean
  canWrap: boolean
  canCopy: boolean
}

export const PREVIEW_CAPABILITIES: Record<PreviewStrategy, PreviewCapability> = {
  image: {
    strategy: 'image',
    label: 'Image Viewer',
    canZoom: true,
    canRotate: true,
    canPaginate: false,
    canSearch: false,
    canFullscreen: true,
    canWrap: false,
    canCopy: false,
  },
  pdf: {
    strategy: 'pdf',
    label: 'PDF Document',
    canZoom: true,
    canRotate: true,
    canPaginate: true,
    canSearch: true,
    canFullscreen: true,
    canWrap: false,
    canCopy: false,
  },
  text: {
    strategy: 'text',
    label: 'Plain Text',
    canZoom: false,
    canRotate: false,
    canPaginate: false,
    canSearch: true,
    canFullscreen: true,
    canWrap: true,
    canCopy: true,
  },
  markdown: {
    strategy: 'markdown',
    label: 'Markdown Document',
    canZoom: false,
    canRotate: false,
    canPaginate: false,
    canSearch: true,
    canFullscreen: true,
    canWrap: true,
    canCopy: true,
  },
  json: {
    strategy: 'json',
    label: 'JSON Document',
    canZoom: false,
    canRotate: false,
    canPaginate: false,
    canSearch: true,
    canFullscreen: true,
    canWrap: true,
    canCopy: true,
  },
  csv: {
    strategy: 'csv',
    label: 'CSV Data',
    canZoom: false,
    canRotate: false,
    canPaginate: true,
    canSearch: true,
    canFullscreen: true,
    canWrap: false,
    canCopy: true,
  },
  spreadsheet: {
    strategy: 'spreadsheet',
    label: 'Spreadsheet',
    canZoom: false,
    canRotate: false,
    canPaginate: true,
    canSearch: true,
    canFullscreen: true,
    canWrap: false,
    canCopy: false,
  },
  archive: {
    strategy: 'archive',
    label: 'Archive Inspector',
    canZoom: false,
    canRotate: false,
    canPaginate: false,
    canSearch: true,
    canFullscreen: true,
    canWrap: false,
    canCopy: false,
  },
  audio: {
    strategy: 'audio',
    label: 'Audio Player',
    canZoom: false,
    canRotate: false,
    canPaginate: false,
    canSearch: false,
    canFullscreen: false,
    canWrap: false,
    canCopy: false,
  },
  video: {
    strategy: 'video',
    label: 'Video Player',
    canZoom: false,
    canRotate: false,
    canPaginate: false,
    canSearch: false,
    canFullscreen: true,
    canWrap: false,
    canCopy: false,
  },
  office: {
    strategy: 'office',
    label: 'Office Document',
    canZoom: true,
    canRotate: false,
    canPaginate: false,
    canSearch: false,
    canFullscreen: true,
    canWrap: false,
    canCopy: false,
  },
  code: {
    strategy: 'code',
    label: 'Source Code',
    canZoom: false,
    canRotate: false,
    canPaginate: false,
    canSearch: true,
    canFullscreen: true,
    canWrap: true,
    canCopy: true,
  },
  generic: {
    strategy: 'generic',
    label: 'File Workspace',
    canZoom: false,
    canRotate: false,
    canPaginate: false,
    canSearch: false,
    canFullscreen: false,
    canWrap: false,
    canCopy: false,
  },
}

const EXTENSION_MAP: Record<string, PreviewStrategy> = {
  // Images
  jpg: 'image',
  jpeg: 'image',
  png: 'image',
  webp: 'image',
  gif: 'image',
  avif: 'image',
  ico: 'image',
  bmp: 'image',

  // PDF
  pdf: 'pdf',

  // Markdown
  md: 'markdown',
  markdown: 'markdown',

  // JSON
  json: 'json',
  jsonld: 'json',

  // CSV
  csv: 'csv',
  tsv: 'csv',

  // Spreadsheets
  xls: 'spreadsheet',
  xlsx: 'spreadsheet',
  ods: 'spreadsheet',

  // Archives
  zip: 'archive',
  tar: 'archive',
  gz: 'archive',
  rar: 'archive',
  '7z': 'archive',

  // Audio
  mp3: 'audio',
  wav: 'audio',
  ogg: 'audio',
  m4a: 'audio',
  flac: 'audio',
  aac: 'audio',

  // Video
  mp4: 'video',
  webm: 'video',
  mov: 'video',
  mkv: 'video',

  // Office / Docs
  doc: 'office',
  docx: 'office',
  ppt: 'office',
  pptx: 'office',
  odp: 'office',
  odt: 'office',
  rtf: 'office',

  // Code
  js: 'code',
  jsx: 'code',
  ts: 'code',
  tsx: 'code',
  py: 'code',
  java: 'code',
  c: 'code',
  cpp: 'code',
  h: 'code',
  hpp: 'code',
  cs: 'code',
  go: 'code',
  rs: 'code',
  php: 'code',
  rb: 'code',
  swift: 'code',
  kt: 'code',
  sql: 'code',
  html: 'code',
  css: 'code',
  scss: 'code',
  sh: 'code',
  bash: 'code',
  zsh: 'code',
  yaml: 'code',
  yml: 'code',
  xml: 'code',

  // Text
  txt: 'text',
  log: 'text',
  ini: 'text',
  cfg: 'text',
  conf: 'text',
  env: 'text',
}

const MIME_MAP: Record<string, PreviewStrategy> = {
  'application/pdf': 'pdf',
  'text/markdown': 'markdown',
  'application/json': 'json',
  'text/csv': 'csv',
  'text/tab-separated-values': 'csv',
  'application/zip': 'archive',
  'application/x-zip-compressed': 'archive',
  'application/vnd.ms-excel': 'spreadsheet',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'spreadsheet',
  'application/msword': 'office',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'office',
  'application/vnd.ms-powerpoint': 'office',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'office',
}

export function resolvePreviewStrategy(params: {
  mimeType?: string
  filename?: string
}): PreviewStrategy {
  const mime = (params.mimeType || '').toLowerCase().trim()
  const filename = (params.filename || '').toLowerCase().trim()
  const ext = filename.split('.').pop() || ''

  // 1. Direct extension match (authoritative if non-generic)
  if (ext && EXTENSION_MAP[ext]) {
    return EXTENSION_MAP[ext]
  }

  // 2. MIME exact match
  if (mime && MIME_MAP[mime]) {
    return MIME_MAP[mime]
  }

  // 3. MIME category match
  if (mime.startsWith('image/')) {
    // Treat SVG as code/text rather than raw image for security
    if (mime.includes('svg')) return 'code'
    return 'image'
  }

  if (mime.startsWith('video/')) return 'video'
  if (mime.startsWith('audio/')) return 'audio'
  if (mime.startsWith('text/')) return 'text'

  return 'generic'
}

export function getPreviewCapabilities(strategy: PreviewStrategy): PreviewCapability {
  return PREVIEW_CAPABILITIES[strategy] || PREVIEW_CAPABILITIES.generic
}

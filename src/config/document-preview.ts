export type PreviewStrategy =
  | 'pdf'
  | 'docx'
  | 'image'
  | 'archive'
  | 'spreadsheet'
  | 'presentation'
  | 'text'
  | 'markdown'
  | 'json'
  | 'csv'
  | 'xml'
  | 'yaml'
  | 'code'
  | 'audio'
  | 'video'
  | 'svg'
  | 'rtf'
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
  isTextBased?: boolean
}

export const PREVIEW_LIMITS = {
  textMaxBytes: 5 * 1024 * 1024, // 5MB
  codeMaxBytes: 5 * 1024 * 1024, // 5MB
  spreadsheetMaxBytes: 25 * 1024 * 1024, // 25MB
  spreadsheetMaxRows: 500,
  spreadsheetMaxCols: 50,
  csvMaxRows: 500,
  archiveMaxBytes: 100 * 1024 * 1024, // 100MB
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
  svg: {
    strategy: 'svg',
    label: 'SVG Vector',
    canZoom: true,
    canRotate: false,
    canPaginate: false,
    canSearch: true,
    canFullscreen: true,
    canWrap: true,
    canCopy: true,
    isTextBased: true,
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
  docx: {
    strategy: 'docx',
    label: 'Word Document',
    canZoom: true,
    canRotate: false,
    canPaginate: false,
    canSearch: false,
    canFullscreen: true,
    canWrap: false,
    canCopy: false,
  },
  spreadsheet: {
    strategy: 'spreadsheet',
    label: 'Spreadsheet Workbook',
    canZoom: false,
    canRotate: false,
    canPaginate: true,
    canSearch: true,
    canFullscreen: true,
    canWrap: false,
    canCopy: false,
  },
  presentation: {
    strategy: 'presentation',
    label: 'Presentation',
    canZoom: false,
    canRotate: false,
    canPaginate: false,
    canSearch: false,
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
    isTextBased: true,
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
    isTextBased: true,
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
    isTextBased: true,
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
    isTextBased: true,
  },
  xml: {
    strategy: 'xml',
    label: 'XML Document',
    canZoom: false,
    canRotate: false,
    canPaginate: false,
    canSearch: true,
    canFullscreen: true,
    canWrap: true,
    canCopy: true,
    isTextBased: true,
  },
  yaml: {
    strategy: 'yaml',
    label: 'YAML Configuration',
    canZoom: false,
    canRotate: false,
    canPaginate: false,
    canSearch: true,
    canFullscreen: true,
    canWrap: true,
    canCopy: true,
    isTextBased: true,
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
    isTextBased: true,
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
  rtf: {
    strategy: 'rtf',
    label: 'Rich Text Document',
    canZoom: false,
    canRotate: false,
    canPaginate: false,
    canSearch: false,
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
  png: 'image',
  jpg: 'image',
  jpeg: 'image',
  webp: 'image',
  gif: 'image',
  bmp: 'image',
  ico: 'image',
  tiff: 'image',
  tif: 'image',
  svg: 'svg',

  // PDF
  pdf: 'pdf',

  // Word / Office
  docx: 'docx',
  doc: 'docx',
  dotx: 'docx',
  odt: 'docx',
  rtf: 'rtf',

  // Presentations
  pptx: 'presentation',
  ppt: 'presentation',
  odp: 'presentation',

  // Spreadsheets
  xlsx: 'spreadsheet',
  xls: 'spreadsheet',
  ods: 'spreadsheet',
  csv: 'csv',
  tsv: 'csv',

  // Structured Documents
  json: 'json',
  xml: 'xml',
  xaml: 'xml',
  yaml: 'yaml',
  yml: 'yaml',
  md: 'markdown',
  markdown: 'markdown',

  // Text & Logs
  txt: 'text',
  log: 'text',
  ini: 'text',
  cfg: 'text',
  conf: 'text',
  config: 'text',
  env: 'text',
  gitignore: 'text',
  editorconfig: 'text',
  toml: 'code',

  // Audio
  mp3: 'audio',
  wav: 'audio',
  ogg: 'audio',
  m4a: 'audio',
  aac: 'audio',
  flac: 'audio',

  // Video
  mp4: 'video',
  webm: 'video',
  mov: 'video',
  mkv: 'video',
  ogv: 'video',

  // Archives
  zip: 'archive',
  tar: 'archive',
  gz: 'archive',
  rar: 'archive',
  '7z': 'archive',

  // Source Code
  js: 'code',
  jsx: 'code',
  mjs: 'code',
  cjs: 'code',
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
  kts: 'code',
  dart: 'code',
  sql: 'code',
  html: 'code',
  htm: 'code',
  css: 'code',
  scss: 'code',
  sass: 'code',
  less: 'code',
  sh: 'code',
  bash: 'code',
  zsh: 'code',
  ps1: 'code',
}

const MIME_MAP: Record<string, PreviewStrategy> = {
  'application/pdf': 'pdf',
  'image/svg+xml': 'svg',
  'text/markdown': 'markdown',
  'application/json': 'json',
  'application/xml': 'xml',
  'text/xml': 'xml',
  'application/x-yaml': 'yaml',
  'text/yaml': 'yaml',
  'text/csv': 'csv',
  'text/tab-separated-values': 'csv',
  'application/zip': 'archive',
  'application/x-zip-compressed': 'archive',
  'application/vnd.ms-excel': 'spreadsheet',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'spreadsheet',
  'application/vnd.oasis.opendocument.spreadsheet': 'spreadsheet',
  'application/msword': 'docx',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-powerpoint': 'presentation',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'presentation',
  'application/rtf': 'rtf',
  'text/rtf': 'rtf',
}

export function resolvePreviewStrategy(params: {
  mimeType?: string
  filename?: string
}): PreviewStrategy {
  const mime = (params.mimeType || '').toLowerCase().trim()
  const filename = (params.filename || '').toLowerCase().trim()
  const ext = filename.split('.').pop() || ''

  // 1. Extension match (authoritative for source code, markdown, csv, etc.)
  if (ext && EXTENSION_MAP[ext]) {
    return EXTENSION_MAP[ext]
  }

  // 2. MIME exact match
  if (mime && MIME_MAP[mime]) {
    return MIME_MAP[mime]
  }

  // 3. MIME category matching
  if (mime.startsWith('image/')) {
    if (mime.includes('svg')) return 'svg'
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

export function getHumanReadableFileType(params: {
  mimeType?: string
  filename?: string
}): string {
  const filename = (params.filename || '').toLowerCase().trim()
  const ext = filename.split('.').pop() || ''

  const labelMap: Record<string, string> = {
    pdf: 'PDF Document',
    docx: 'Word Document',
    doc: 'Word Document',
    xlsx: 'Excel Spreadsheet',
    xls: 'Excel Spreadsheet',
    csv: 'CSV Spreadsheet',
    tsv: 'TSV Spreadsheet',
    pptx: 'PowerPoint Presentation',
    ppt: 'PowerPoint Presentation',
    json: 'JSON Data',
    xml: 'XML Document',
    yaml: 'YAML Configuration',
    yml: 'YAML Configuration',
    md: 'Markdown Document',
    txt: 'Plain Text',
    log: 'Log File',
    zip: 'ZIP Archive',
    tar: 'TAR Archive',
    gz: 'GZ Archive',
    '7z': '7-Zip Archive',
    png: 'PNG Image',
    jpg: 'JPEG Image',
    jpeg: 'JPEG Image',
    webp: 'WebP Image',
    svg: 'SVG Vector',
    gif: 'GIF Animation',
    mp3: 'MP3 Audio',
    wav: 'WAV Audio',
    ogg: 'OGG Audio',
    mp4: 'MP4 Video',
    webm: 'WebM Video',
    mov: 'QuickTime Video',
    ts: 'TypeScript Source',
    tsx: 'TypeScript React',
    js: 'JavaScript Source',
    jsx: 'JavaScript React',
    py: 'Python Script',
    java: 'Java Source',
    c: 'C Source',
    cpp: 'C++ Source',
    cs: 'C# Source',
    go: 'Go Source',
    rs: 'Rust Source',
    sql: 'SQL Query',
    html: 'HTML Document',
    css: 'CSS Stylesheet',
    sh: 'Shell Script',
  }

  if (ext && labelMap[ext]) {
    return labelMap[ext]
  }

  const strategy = resolvePreviewStrategy(params)
  return PREVIEW_CAPABILITIES[strategy]?.label || 'Binary Document'
}

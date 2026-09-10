import {
  Folder01Icon,
  FolderOpenIcon,
  File01Icon,
  Pdf01Icon,
  Image01Icon,
  Zip01Icon,
  Table01Icon,
  BookOpen01Icon,
  CodeIcon,
} from '@hugeicons/core-free-icons'
import type { IconSvgElement } from '@hugeicons/react'

export type ArchiveEntryKind =
  | 'code'
  | 'text'
  | 'markdown'
  | 'json'
  | 'csv'
  | 'image'
  | 'pdf'
  | 'binary'

export interface ArchiveFileTypeInfo {
  kind: ArchiveEntryKind
  label: string
  badgeText: string
  icon: IconSvgElement
  mimeType: string
}

const EXTENSION_MAP: Record<string, { kind: ArchiveEntryKind; label: string; badge: string; icon: IconSvgElement; mime: string }> = {
  // TypeScript & JavaScript
  ts: { kind: 'code', label: 'TypeScript', badge: 'TS', icon: CodeIcon, mime: 'text/typescript' },
  tsx: { kind: 'code', label: 'TypeScript React', badge: 'TSX', icon: CodeIcon, mime: 'text/tsx' },
  js: { kind: 'code', label: 'JavaScript', badge: 'JS', icon: CodeIcon, mime: 'text/javascript' },
  jsx: { kind: 'code', label: 'JavaScript React', badge: 'JSX', icon: CodeIcon, mime: 'text/jsx' },
  mjs: { kind: 'code', label: 'JavaScript Module', badge: 'MJS', icon: CodeIcon, mime: 'text/javascript' },
  cjs: { kind: 'code', label: 'CommonJS', badge: 'CJS', icon: CodeIcon, mime: 'text/javascript' },

  // Web Styles & Markup
  html: { kind: 'code', label: 'HTML', badge: 'HTML', icon: CodeIcon, mime: 'text/html' },
  htm: { kind: 'code', label: 'HTML', badge: 'HTML', icon: CodeIcon, mime: 'text/html' },
  css: { kind: 'code', label: 'CSS', badge: 'CSS', icon: CodeIcon, mime: 'text/css' },
  scss: { kind: 'code', label: 'SCSS', badge: 'SCSS', icon: CodeIcon, mime: 'text/x-scss' },
  sass: { kind: 'code', label: 'Sass', badge: 'SASS', icon: CodeIcon, mime: 'text/x-sass' },
  less: { kind: 'code', label: 'Less', badge: 'LESS', icon: CodeIcon, mime: 'text/x-less' },

  // Programming Languages
  py: { kind: 'code', label: 'Python', badge: 'PY', icon: CodeIcon, mime: 'text/x-python' },
  java: { kind: 'code', label: 'Java', badge: 'JAVA', icon: CodeIcon, mime: 'text/x-java' },
  c: { kind: 'code', label: 'C', badge: 'C', icon: CodeIcon, mime: 'text/x-c' },
  cpp: { kind: 'code', label: 'C++', badge: 'C++', icon: CodeIcon, mime: 'text/x-c++' },
  h: { kind: 'code', label: 'C Header', badge: 'H', icon: CodeIcon, mime: 'text/x-c' },
  hpp: { kind: 'code', label: 'C++ Header', badge: 'HPP', icon: CodeIcon, mime: 'text/x-c++' },
  cs: { kind: 'code', label: 'C#', badge: 'C#', icon: CodeIcon, mime: 'text/x-csharp' },
  go: { kind: 'code', label: 'Go', badge: 'GO', icon: CodeIcon, mime: 'text/x-go' },
  rs: { kind: 'code', label: 'Rust', badge: 'RS', icon: CodeIcon, mime: 'text/rust' },
  php: { kind: 'code', label: 'PHP', badge: 'PHP', icon: CodeIcon, mime: 'text/x-php' },
  rb: { kind: 'code', label: 'Ruby', badge: 'RB', icon: CodeIcon, mime: 'text/x-ruby' },
  swift: { kind: 'code', label: 'Swift', badge: 'SWIFT', icon: CodeIcon, mime: 'text/x-swift' },
  kt: { kind: 'code', label: 'Kotlin', badge: 'KT', icon: CodeIcon, mime: 'text/x-kotlin' },
  sql: { kind: 'code', label: 'SQL', badge: 'SQL', icon: CodeIcon, mime: 'text/x-sql' },
  sh: { kind: 'code', label: 'Shell Script', badge: 'SH', icon: CodeIcon, mime: 'text/x-sh' },
  bash: { kind: 'code', label: 'Bash Script', badge: 'BASH', icon: CodeIcon, mime: 'text/x-sh' },
  zsh: { kind: 'code', label: 'Zsh Script', badge: 'ZSH', icon: CodeIcon, mime: 'text/x-sh' },
  yaml: { kind: 'code', label: 'YAML', badge: 'YAML', icon: CodeIcon, mime: 'text/yaml' },
  yml: { kind: 'code', label: 'YAML', badge: 'YML', icon: CodeIcon, mime: 'text/yaml' },
  xml: { kind: 'code', label: 'XML', badge: 'XML', icon: CodeIcon, mime: 'text/xml' },
  toml: { kind: 'code', label: 'TOML', badge: 'TOML', icon: CodeIcon, mime: 'text/x-toml' },

  // Data & Docs
  json: { kind: 'json', label: 'JSON', badge: 'JSON', icon: CodeIcon, mime: 'application/json' },
  csv: { kind: 'csv', label: 'CSV', badge: 'CSV', icon: Table01Icon, mime: 'text/csv' },
  tsv: { kind: 'csv', label: 'TSV', badge: 'TSV', icon: Table01Icon, mime: 'text/tab-separated-values' },
  md: { kind: 'markdown', label: 'Markdown', badge: 'MD', icon: BookOpen01Icon, mime: 'text/markdown' },
  markdown: { kind: 'markdown', label: 'Markdown', badge: 'MD', icon: BookOpen01Icon, mime: 'text/markdown' },
  txt: { kind: 'text', label: 'Plain Text', badge: 'TXT', icon: File01Icon, mime: 'text/plain' },
  log: { kind: 'text', label: 'Log File', badge: 'LOG', icon: File01Icon, mime: 'text/plain' },
  ini: { kind: 'text', label: 'Configuration', badge: 'INI', icon: File01Icon, mime: 'text/plain' },
  env: { kind: 'text', label: 'Environment Config', badge: 'ENV', icon: File01Icon, mime: 'text/plain' },
  gitignore: { kind: 'text', label: 'Git Ignore', badge: 'GIT', icon: File01Icon, mime: 'text/plain' },

  // PDF
  pdf: { kind: 'pdf', label: 'PDF Document', badge: 'PDF', icon: Pdf01Icon, mime: 'application/pdf' },

  // Images
  png: { kind: 'image', label: 'PNG Image', badge: 'PNG', icon: Image01Icon, mime: 'image/png' },
  jpg: { kind: 'image', label: 'JPEG Image', badge: 'JPG', icon: Image01Icon, mime: 'image/jpeg' },
  jpeg: { kind: 'image', label: 'JPEG Image', badge: 'JPG', icon: Image01Icon, mime: 'image/jpeg' },
  webp: { kind: 'image', label: 'WebP Image', badge: 'WEBP', icon: Image01Icon, mime: 'image/webp' },
  svg: { kind: 'image', label: 'SVG Vector', badge: 'SVG', icon: Image01Icon, mime: 'image/svg+xml' },
  gif: { kind: 'image', label: 'GIF Image', badge: 'GIF', icon: Image01Icon, mime: 'image/gif' },
  ico: { kind: 'image', label: 'Icon', badge: 'ICO', icon: Image01Icon, mime: 'image/x-icon' },

  // Archives
  zip: { kind: 'binary', label: 'ZIP Archive', badge: 'ZIP', icon: Zip01Icon, mime: 'application/zip' },
  tar: { kind: 'binary', label: 'TAR Archive', badge: 'TAR', icon: Zip01Icon, mime: 'application/x-tar' },
  gz: { kind: 'binary', label: 'GZ Archive', badge: 'GZ', icon: Zip01Icon, mime: 'application/gzip' },
}

export function resolveArchiveFileType(filename: string, isDirectory = false): ArchiveFileTypeInfo {
  if (isDirectory) {
    return {
      kind: 'binary',
      label: 'Directory',
      badgeText: 'DIR',
      icon: Folder01Icon,
      mimeType: 'inode/directory',
    }
  }

  const clean = filename.trim().toLowerCase()
  const ext = clean.split('.').pop() || ''

  // Special full filename matching (e.g. .gitignore, .env)
  if (clean === '.gitignore' || clean.endsWith('.gitignore')) {
    return {
      kind: 'text',
      label: 'Git Ignore',
      badgeText: 'GIT',
      icon: File01Icon,
      mimeType: 'text/plain',
    }
  }
  if (clean.startsWith('.env')) {
    return {
      kind: 'text',
      label: 'Environment Config',
      badgeText: 'ENV',
      icon: File01Icon,
      mimeType: 'text/plain',
    }
  }

  if (ext && EXTENSION_MAP[ext]) {
    const item = EXTENSION_MAP[ext]
    return {
      kind: item.kind,
      label: item.label,
      badgeText: item.badge,
      icon: item.icon,
      mimeType: item.mime,
    }
  }

  return {
    kind: 'binary',
    label: ext ? `${ext.toUpperCase()} File` : 'Binary File',
    badgeText: ext ? ext.slice(0, 4).toUpperCase() : 'FILE',
    icon: File01Icon,
    mimeType: 'application/octet-stream',
  }
}

export { Folder01Icon, FolderOpenIcon }

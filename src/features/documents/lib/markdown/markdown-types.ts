export type MarkdownMode = 'rendered' | 'source'

export interface HeadingItem {
  id: string
  title: string
  level: number
}

export type MarkdownCalloutType = 'note' | 'tip' | 'important' | 'warning' | 'caution'

export interface MarkdownContext {
  kind: 'standalone' | 'archive'
  resolveRelativePath?: (path: string) => Promise<string | null> | string | null
  openArchiveEntry?: (path: string) => void
}

export interface MarkdownBrandMeta {
  id: string
  name: string
  color: string
  svgPath: string
}

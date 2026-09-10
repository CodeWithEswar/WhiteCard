import Prism from 'prismjs'

// Import Prism core and common languages in safe dependency sequence
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-csharp'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-rust'

export type CodeLanguage =
  | 'typescript'
  | 'javascript'
  | 'python'
  | 'java'
  | 'c'
  | 'cpp'
  | 'csharp'
  | 'go'
  | 'rust'
  | 'html'
  | 'css'
  | 'json'
  | 'sql'
  | 'shell'
  | 'yaml'
  | 'markdown'
  | 'plaintext'

export const LANGUAGE_MAP: Record<string, CodeLanguage> = {
  ts: 'typescript',
  tsx: 'typescript',
  js: 'javascript',
  jsx: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  py: 'python',
  java: 'java',
  c: 'c',
  h: 'c',
  cpp: 'cpp',
  hpp: 'cpp',
  cs: 'csharp',
  go: 'go',
  rs: 'rust',
  html: 'html',
  htm: 'html',
  xml: 'html',
  svg: 'html',
  css: 'css',
  scss: 'css',
  sass: 'css',
  less: 'css',
  json: 'json',
  sql: 'sql',
  sh: 'shell',
  bash: 'shell',
  zsh: 'shell',
  yaml: 'yaml',
  yml: 'yaml',
  md: 'markdown',
  markdown: 'markdown',
  txt: 'plaintext',
  env: 'plaintext',
  gitignore: 'plaintext',
  dockerfile: 'shell',
}

const EXTENSION_TO_PRISM: Record<string, string> = {
  ts: 'typescript',
  tsx: 'tsx',
  js: 'javascript',
  jsx: 'jsx',
  mjs: 'javascript',
  cjs: 'javascript',
  py: 'python',
  java: 'java',
  c: 'c',
  h: 'c',
  cpp: 'cpp',
  hpp: 'cpp',
  cs: 'csharp',
  go: 'go',
  rs: 'rust',
  html: 'markup',
  htm: 'markup',
  xml: 'markup',
  svg: 'markup',
  css: 'css',
  scss: 'css',
  sass: 'css',
  less: 'css',
  json: 'json',
  sql: 'sql',
  sh: 'bash',
  bash: 'bash',
  zsh: 'bash',
  yaml: 'yaml',
  yml: 'yaml',
  md: 'markdown',
  markdown: 'markdown',
}

export function resolveLanguageFromFilename(filename: string): CodeLanguage {
  const ext = filename.trim().toLowerCase().split('.').pop() || ''
  return LANGUAGE_MAP[ext] || 'plaintext'
}

export function resolvePrismGrammarKey(filename: string): string {
  const ext = filename.trim().toLowerCase().split('.').pop() || ''
  return EXTENSION_TO_PRISM[ext] || 'clike'
}

export interface CodeSpan {
  type: string | null
  text: string
}

export interface FormattedLine {
  lineNumber: number
  spans: CodeSpan[]
}

/**
 * Backward-compatible single-line tokenizer
 */
export interface CodeToken {
  type: 'keyword' | 'string' | 'comment' | 'number' | 'function' | 'type' | 'text' | 'operator'
  value: string
}

export function tokenizeLine(line: string, language: CodeLanguage): CodeToken[] {
  const lines = tokenizeFullCode(line, `file.${language === 'typescript' ? 'ts' : 'js'}`)
  if (lines.length === 0) return [{ type: 'text', value: '' }]
  return lines[0].spans.map((s) => ({
    type: (s.type as any) || 'text',
    value: s.text,
  }))
}

/**
 * Flattens Prism token trees into a linear stream of styled spans
 */
function flattenTokens(
  token: string | Prism.Token | (string | Prism.Token)[],
  parentType: string | null = null,
  out: CodeSpan[] = []
): CodeSpan[] {
  if (typeof token === 'string') {
    out.push({ type: parentType, text: token })
  } else if (Array.isArray(token)) {
    for (const item of token) {
      flattenTokens(item, parentType, out)
    }
  } else if (token && typeof token === 'object') {
    const currentType = token.type || parentType
    if (typeof token.content === 'string') {
      out.push({ type: currentType, text: token.content })
    } else {
      flattenTokens(token.content, currentType, out)
    }
  }
  return out
}

/**
 * High-performance full-file tokenizer powered by PrismJS.
 * Correctly handles multi-line comments, template literals, JSX tags,
 * regexes, and language-specific grammars with 100% line fidelity.
 */
export function tokenizeFullCode(code: string, filename: string): FormattedLine[] {
  if (!code) {
    return [{ lineNumber: 1, spans: [{ type: null, text: '' }] }]
  }

  const grammarKey = resolvePrismGrammarKey(filename)
  const grammar = Prism.languages[grammarKey] || Prism.languages.clike

  if (!grammar) {
    return code.split(/\r?\n/).map((line, idx) => ({
      lineNumber: idx + 1,
      spans: [{ type: null, text: line }],
    }))
  }

  const rawTokens = Prism.tokenize(code, grammar)
  const flatSpans = flattenTokens(rawTokens)

  const lines: FormattedLine[] = []
  let currentSpans: CodeSpan[] = []
  let currentLineNumber = 1

  for (const span of flatSpans) {
    const text = span.text
    if (!text.includes('\n')) {
      if (text.length > 0) {
        currentSpans.push(span)
      }
      continue
    }

    // Split multi-line token across line boundaries
    const parts = text.split(/\r?\n/)
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      if (part.length > 0) {
        currentSpans.push({ type: span.type, text: part })
      }

      if (i < parts.length - 1) {
        lines.push({
          lineNumber: currentLineNumber++,
          spans: currentSpans.length > 0 ? currentSpans : [{ type: null, text: '' }],
        })
        currentSpans = []
      }
    }
  }

  // Push trailing line
  lines.push({
    lineNumber: currentLineNumber,
    spans: currentSpans.length > 0 ? currentSpans : [{ type: null, text: '' }],
  })

  return lines
}

/**
 * Maps a Prism token type to White Card's monochrome-first semantic theme classes.
 */
export function getMonochromeTokenClassName(type: string | null): string {
  if (!type) return 'text-foreground'

  switch (type) {
    // Control flow, imports, declarations
    case 'keyword':
    case 'atrule':
    case 'rule':
      return 'font-semibold text-primary/95'

    // Multi-line and single-line comments, docstrings
    case 'comment':
    case 'prolog':
    case 'doctype':
    case 'cdata':
      return 'italic text-muted-foreground/60'

    // Strings, template literals
    case 'string':
    case 'char':
    case 'attr-value':
      return 'text-emerald-700 dark:text-emerald-300/90 font-normal'

    // Numbers, constants, booleans
    case 'number':
    case 'boolean':
    case 'constant':
      return 'text-amber-700 dark:text-amber-300/90 font-normal'

    // Functions and methods
    case 'function':
    case 'function-variable':
      return 'font-medium text-foreground'

    // Classes, interfaces, types, builtins
    case 'class-name':
    case 'builtin':
      return 'font-medium text-foreground/90'

    // HTML / JSX / XML tags
    case 'tag':
      return 'font-semibold text-primary/90'

    // HTML / JSX attributes
    case 'attr-name':
      return 'text-muted-foreground font-normal'

    // Operators and expressions
    case 'operator':
      return 'text-muted-foreground/90'

    // Punctuation (braces, brackets, commas, semicolons)
    case 'punctuation':
      return 'text-muted-foreground/70'

    // Regular expressions
    case 'regex':
    case 'important':
      return 'text-rose-600 dark:text-rose-400 font-normal'

    // Variables, properties, selectors
    case 'variable':
    case 'property':
      return 'text-foreground'

    case 'selector':
      return 'font-medium text-primary'

    default:
      return 'text-foreground'
  }
}

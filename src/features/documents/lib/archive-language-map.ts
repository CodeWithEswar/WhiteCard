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
 * Maps a Prism token type to rich, professional syntax theme classes (GitHub Dark/Light standard).
 */
export function getMonochromeTokenClassName(type: string | null): string {
  if (!type) return 'text-foreground'

  switch (type) {
    // Control flow, keywords, imports, exports, returns
    case 'keyword':
    case 'atrule':
    case 'rule':
      return 'text-[#cf222e] dark:text-[#ff7b72] font-semibold'

    // Functions and methods
    case 'function':
    case 'function-variable':
      return 'text-[#8250df] dark:text-[#d2a8ff] font-medium'

    // Classes, interfaces, types, builtins
    case 'class-name':
    case 'builtin':
      return 'text-[#953800] dark:text-[#ffa657] font-medium'

    // Strings and characters
    case 'string':
    case 'char':
    case 'attr-value':
      return 'text-[#0a3069] dark:text-[#a5d6ff] font-normal'

    // Numbers, constants, booleans, null, undefined
    case 'number':
    case 'boolean':
    case 'constant':
      return 'text-[#0550ae] dark:text-[#79c0ff] font-mono'

    // Comments and docstrings
    case 'comment':
    case 'prolog':
    case 'doctype':
    case 'cdata':
      return 'text-[#6e7781] dark:text-[#8b949e] italic font-normal'

    // HTML / JSX / XML tags
    case 'tag':
      return 'text-[#116329] dark:text-[#7ee787] font-semibold'

    // HTML / JSX attributes
    case 'attr-name':
      return 'text-[#8250df] dark:text-[#d2a8ff] font-normal'

    // Object keys, CSS properties
    case 'property':
      return 'text-[#0550ae] dark:text-[#79c0ff] font-medium'

    // Variables, identifiers
    case 'variable':
      return 'text-[#953800] dark:text-[#ffa657]'

    // Operators and expressions
    case 'operator':
      return 'text-[#cf222e] dark:text-[#ff7b72]'

    // Punctuation (braces, brackets, commas, semicolons)
    case 'punctuation':
      return 'text-[#57606a] dark:text-[#8b949e]'

    // Regular expressions
    case 'regex':
    case 'important':
      return 'text-[#116329] dark:text-[#7ee787] font-mono'

    // CSS selectors
    case 'selector':
      return 'text-[#116329] dark:text-[#7ee787] font-medium'

    case 'unit':
      return 'text-[#0550ae] dark:text-[#79c0ff]'

    default:
      return 'text-foreground'
  }
}

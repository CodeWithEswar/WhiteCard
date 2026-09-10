export type CodeLanguage =
  | 'typescript'
  | 'javascript'
  | 'python'
  | 'java'
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
  html: 'html',
  htm: 'html',
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
}

export function resolveLanguageFromFilename(filename: string): CodeLanguage {
  const ext = filename.trim().toLowerCase().split('.').pop() || ''
  return LANGUAGE_MAP[ext] || 'plaintext'
}

export interface CodeToken {
  type: 'keyword' | 'string' | 'comment' | 'number' | 'function' | 'type' | 'text' | 'operator'
  value: string
}

const KEYWORDS = new Set([
  'import', 'export', 'from', 'default', 'return', 'function', 'const', 'let', 'var',
  'if', 'else', 'switch', 'case', 'break', 'continue', 'for', 'while', 'do',
  'try', 'catch', 'finally', 'throw', 'new', 'class', 'extends', 'implements',
  'interface', 'type', 'async', 'await', 'yield', 'typeof', 'instanceof', 'void',
  'null', 'undefined', 'true', 'false', 'as', 'in', 'of', 'public', 'private',
  'protected', 'static', 'readonly', 'def', 'self', 'lambda', 'print', 'package',
  'SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'JOIN', 'LEFT', 'RIGHT',
])

/**
 * High-performance, monochrome-first line tokenizer for read-only code viewing.
 * Provides subtle typographical emphasis rather than saturated rainbow IDE colors.
 */
export function tokenizeLine(line: string, _language: CodeLanguage): CodeToken[] {
  if (!line) return [{ type: 'text', value: '' }]

  const tokens: CodeToken[] = []
  let i = 0
  const len = line.length

  while (i < len) {
    // 1. Comments (// or # or --)
    if (
      (line[i] === '/' && line[i + 1] === '/') ||
      line[i] === '#' ||
      (line[i] === '-' && line[i + 1] === '-')
    ) {
      tokens.push({ type: 'comment', value: line.slice(i) })
      break
    }

    // 2. Strings ('...', "...", `...`)
    const quote = line[i]
    if (quote === '"' || quote === "'" || quote === '`') {
      let end = i + 1
      while (end < len && line[end] !== quote) {
        if (line[end] === '\\') end++ // escape next char
        end++
      }
      end = Math.min(len, end + 1)
      tokens.push({ type: 'string', value: line.slice(i, end) })
      i = end
      continue
    }

    // 3. Numbers
    if (/\d/.test(line[i]) && (i === 0 || /[\s,([{:+\-*/%=<>]/.test(line[i - 1]))) {
      let end = i
      while (end < len && /[\d.a-fA-FxX]/.test(line[end])) {
        end++
      }
      tokens.push({ type: 'number', value: line.slice(i, end) })
      i = end
      continue
    }

    // 4. Words (Keywords, Types, Functions, Identifiers)
    if (/[a-zA-Z_$]/.test(line[i])) {
      let end = i
      while (end < len && /[a-zA-Z0-9_$]/.test(line[end])) {
        end++
      }
      const word = line.slice(i, end)

      if (KEYWORDS.has(word) || KEYWORDS.has(word.toUpperCase())) {
        tokens.push({ type: 'keyword', value: word })
      } else if (/^[A-Z][a-zA-Z0-9]*$/.test(word)) {
        tokens.push({ type: 'type', value: word })
      } else if (end < len && line[end] === '(') {
        tokens.push({ type: 'function', value: word })
      } else {
        tokens.push({ type: 'text', value: word })
      }
      i = end
      continue
    }

    // 5. Operators & Punctuation
    if (/[{}()[\].,;:+\-*/%=<>!&|^~?]/.test(line[i])) {
      tokens.push({ type: 'operator', value: line[i] })
      i++
      continue
    }

    // 6. Whitespace and other characters
    tokens.push({ type: 'text', value: line[i] })
    i++
  }

  return tokens
}

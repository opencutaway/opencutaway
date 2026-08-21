import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const EMAIL = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/

/** Kill hung git before Vitest's 5s wall. Do not raise that wall. */
const GIT_LIST_TIMEOUT_MS = 2000

const candidateCache = new Map()

function windowsUserPrefix() {
  return ['C:', 'Users'].join('\\') + '\\'
}

function windowsUserPrefixFwd() {
  return ['C:', 'Users'].join('/') + '/'
}

function macUserPrefix() {
  return ['', 'Users', ''].join('/')
}

export function piiNeedles() {
  return {
    windowsUserPrefix: windowsUserPrefix(),
    windowsUserPrefixFwd: windowsUserPrefixFwd(),
    macUserPrefix: macUserPrefix(),
    email: EMAIL
  }
}

export function findPiiInText(text) {
  const findings = []
  const { windowsUserPrefix, windowsUserPrefixFwd, macUserPrefix, email } =
    piiNeedles()

  if (text.includes(windowsUserPrefix) || text.toLowerCase().includes(windowsUserPrefix.toLowerCase())) {
    findings.push('windows-user-path')
  }
  if (text.includes(windowsUserPrefixFwd) || text.toLowerCase().includes(windowsUserPrefixFwd.toLowerCase())) {
    findings.push('windows-user-path-forward')
  }
  if (text.includes(macUserPrefix)) {
    findings.push('macos-user-path')
  }
  if (email.test(text)) {
    findings.push('email-like')
  }
  return findings
}

export function isIgnoredScanPath(relativePath) {
  const normalized = relativePath.replaceAll('\\', '/')
  if (normalized === 'node_modules' || normalized.startsWith('node_modules/')) {
    return true
  }
  if (normalized.includes('/node_modules/')) {
    return true
  }
  if (normalized === 'dist' || normalized.startsWith('dist/')) {
    return true
  }
  if (normalized === 'coverage' || normalized.startsWith('coverage/')) {
    return true
  }
  if (normalized.startsWith('.vite/') || normalized.includes('/.vite/')) {
    return true
  }
  return false
}

export function shouldScanRelativePath(relativePath) {
  const normalized = relativePath.replaceAll('\\', '/')
  if (isIgnoredScanPath(normalized)) {
    return false
  }
  const base = normalized.split('/').at(-1) ?? normalized
  if (base === 'package-lock.json' || base.endsWith('.lock')) {
    return false
  }
  if (/\.(png|jpe?g|gif|webp|ico|woff2?|pdf|bin)$/i.test(base)) {
    return false
  }
  return true
}

function execGit(root, args) {
  return execFileSync('git', ['--no-optional-locks', ...args], {
    cwd: root,
    encoding: 'utf8',
    timeout: GIT_LIST_TIMEOUT_MS,
    maxBuffer: 2 * 1024 * 1024,
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: {
      ...process.env,
      GIT_OPTIONAL_LOCKS: '0',
      GIT_TERMINAL_PROMPT: '0'
    }
  })
}

function parsePorcelainPath(raw) {
  let value = raw.trim()
  if (value.startsWith('"') && value.endsWith('"') && value.length >= 2) {
    value = value.slice(1, -1)
  }
  return value.replaceAll('\\', '/')
}

function collectCandidateFiles(root) {
  // Index only — never `ls-files -o`, which can walk ignored trees when the
  // untracked cache is cold and outlive the 5s Vitest budget.
  const tracked = execGit(root, ['ls-files', '-z'])
    .split('\0')
    .filter(Boolean)
    .map((rel) => rel.replaceAll('\\', '/'))
  // `git status` skips ignored directories (node_modules, Vite temp).
  const status = execGit(root, [
    'status',
    '--porcelain',
    '--untracked-files=all',
    '--ignored=no'
  ])
  const untracked = []
  for (const line of status.split(/\r?\n/).filter(Boolean)) {
    if (!line.startsWith('?? ')) {
      continue
    }
    untracked.push(parsePorcelainPath(line.slice(3)))
  }
  const seen = new Set()
  const out = []
  for (const relativePath of [...tracked, ...untracked]) {
    if (seen.has(relativePath)) {
      continue
    }
    seen.add(relativePath)
    if (!shouldScanRelativePath(relativePath)) {
      continue
    }
    out.push(relativePath)
  }
  return out
}

export function listCandidateFiles(root) {
  const key = path.resolve(root)
  const cached = candidateCache.get(key)
  if (cached) {
    return cached
  }
  const files = collectCandidateFiles(key)
  candidateCache.set(key, files)
  return files
}

export function scanPiiInTree(root) {
  const findings = []
  for (const relativePath of listCandidateFiles(root)) {
    let text
    try {
      text = readFileSync(path.join(root, relativePath), 'utf8')
    } catch {
      continue
    }
    const hits = findPiiInText(text)
    if (hits.length > 0) {
      findings.push({ file: relativePath, hits })
    }
  }
  return findings
}

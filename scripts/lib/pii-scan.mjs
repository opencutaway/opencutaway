const EMAIL = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/

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

export function shouldScanRelativePath(relativePath) {
  const normalized = relativePath.replaceAll('\\', '/')
  const base = normalized.split('/').at(-1) ?? normalized
  if (base === 'package-lock.json' || base.endsWith('.lock')) {
    return false
  }
  if (/\.(png|jpe?g|gif|webp|ico|woff2?|pdf|bin)$/i.test(base)) {
    return false
  }
  return true
}

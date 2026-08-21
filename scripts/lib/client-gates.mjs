/**
 * G-ethos forbidden client tokens. Scanned over src/ by scan-client-tree.mjs.
 *
 * Two match kinds, both case-insensitive:
 *   - substring: the token text appears anywhere (the original behaviour;
 *     every token that predates the bounded kind stays substring so nothing
 *     previously detected stops being detected);
 *   - bounded: a regex with a word boundary, for short tokens such as `fetch(`
 *     where a bare substring would trip on `prefetch(`.
 *
 * Grouped by the rule each token guards. A token is removed only by an owner
 * decision recorded in docs/settled.md; `node tools/pii-lint.mjs --ethos`
 * prints the token count so a shrinking list is visible.
 */

const SUBSTRING_TOKENS = [
  // S6: no camera, no GPS, no getUserMedia, no geolocation APIs or stubs.
  'geolocation',
  'getUserMedia',
  'mediaDevices',
  'ImageCapture',
  // S4: no analytics, monitoring, or ads.
  'gtag',
  'Sentry',
  'analytics',
  'amplitude',
  'mixpanel',
  // S4 / S5: no cloud back ends, no child-cloud accounts.
  'firebase',
  'supabase',
  // S4: no model calls from the child app.
  'openai',
  'anthropic',
  '@ai-sdk',
  'langchain',
  'langgraph',
  // S4: no network primitives.
  'XMLHttpRequest',
  'WebSocket',
  'EventSource',
  'sendBeacon',
  // S5: no durable storage that could grow into an account.
  'indexedDB',
  'localStorage',
  'sessionStorage',
  'serviceWorker'
]

const BOUNDED_TOKENS = [
  // S4: `fetch(` with a boundary, so `prefetch(` and `refetchQueries(` pass.
  { token: 'fetch(', pattern: /\bfetch\s*\(/i },
  // S4: worker-side script loading from a URL.
  { token: 'importScripts(', pattern: /\bimportScripts\s*\(/i },
  // S4: Segment under its npm scope or either domain; bare "segment" is a
  // drawing word and stays allowed.
  { token: 'segment.io', pattern: /@segment\/|\bsegment\.(?:io|com)\b/i },
  // S5: CacheStorage writes.
  { token: 'caches.open', pattern: /\bcaches\s*\.\s*open\b/i }
]

export function forbiddenClientTokens() {
  return [
    ...SUBSTRING_TOKENS,
    ...BOUNDED_TOKENS.map((entry) => entry.token)
  ]
}

export function findForbiddenTokens(text) {
  const lower = text.toLowerCase()
  const hits = SUBSTRING_TOKENS.filter((token) =>
    lower.includes(token.toLowerCase())
  )
  for (const { token, pattern } of BOUNDED_TOKENS) {
    if (pattern.test(text)) hits.push(token)
  }
  return hits
}

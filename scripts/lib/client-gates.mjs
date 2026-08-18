const FORBIDDEN_TOKENS = [
  'geolocation',
  'getUserMedia',
  'gtag',
  'Sentry',
  'openai',
  'langgraph'
]

export function forbiddenClientTokens() {
  return [...FORBIDDEN_TOKENS]
}

export function findForbiddenTokens(text) {
  const lower = text.toLowerCase()
  return FORBIDDEN_TOKENS.filter((token) => lower.includes(token.toLowerCase()))
}

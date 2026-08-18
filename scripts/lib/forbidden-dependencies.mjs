const FORBIDDEN_PACKAGE_NAMES = [
  'next',
  'firebase',
  'supabase',
  '@sentry/browser',
  '@sentry/node',
  'openai',
  'langgraph',
  'langchain',
  'next-auth',
  '@auth/core',
  'electron',
  'plausible-tracker',
  'react-ga',
  'react-ga4'
]

export function forbiddenPackageNames() {
  return [...FORBIDDEN_PACKAGE_NAMES]
}

export function findForbiddenDependencies(packageJson) {
  const declared = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  }
  return forbiddenPackageNames().filter((name) =>
    Object.hasOwn(declared, name)
  )
}

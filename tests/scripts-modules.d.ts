/// <reference types="node" />

declare module '../scripts/lib/client-gates.mjs' {
  export function forbiddenClientTokens(): string[]
  export function findForbiddenTokens(text: string): string[]
}

declare module '../scripts/lib/scan-client-tree.mjs' {
  export function scanClientTree(
    rootDir: string
  ): Promise<{ file: string; hits: string[] }[]>
}

declare module '../scripts/lib/pii-scan.mjs' {
  export function piiNeedles(): {
    windowsUserPrefix: string
    windowsUserPrefixFwd: string
    macUserPrefix: string
    email: RegExp
  }
  export function findPiiInText(text: string): string[]
  export function shouldScanRelativePath(relativePath: string): boolean
}

declare module '../scripts/lib/forbidden-dependencies.mjs' {
  export function forbiddenPackageNames(): string[]
  export function findForbiddenDependencies(packageJson: {
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
  }): string[]
}

declare module 'ajv/dist/2020.js' {
  import Ajv from 'ajv'
  export default Ajv
}

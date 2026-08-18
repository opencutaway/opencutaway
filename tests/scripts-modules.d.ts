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

declare module '../scripts/lib/ajv-validate.mjs' {
  import type { ErrorObject, ValidateFunction } from 'ajv'
  export const repoRoot: string
  export function readJson(relativePath: string, root?: string): unknown
  export function listSchemaFiles(root?: string): string[]
  export function createAjv(root?: string): import('ajv').default
  export function compileByPath(
    relativePath: string,
    root?: string
  ): ValidateFunction
  export function validateInstance(
    schemaRelativePath: string,
    data: unknown,
    root?: string
  ): { ok: boolean; errors: ErrorObject[] }
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

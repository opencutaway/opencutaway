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
  export function isIgnoredScanPath(relativePath: string): boolean
  export function shouldScanRelativePath(relativePath: string): boolean
  export function listCandidateFiles(root: string): string[]
  export function scanPiiInTree(root: string): { file: string; hits: string[] }[]
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

declare module '../tools/check-gate-integrity.mjs' {
  export function shouldScanRelativePath(relativePath: string): boolean
  export function findPaperOvers(text: string): { code: string; detail: string }[]
  export function findForcedSuccessInPackageJson(
    text: string,
    file?: string
  ): { code: string; file: string; script: string; detail: string }[]
  export function findConfigProblems(
    relativePath: string,
    text: string
  ): { code: string; file: string }[]
  export function scanRepoPaperOvers(
    root?: string
  ): { code: string; file?: string; detail?: string; script?: string }[]
  export function listScanTargets(
    root?: string,
    filter?: (relativePath: string) => boolean
  ): string[]
  export function scanRepo(root?: string): {
    problems: { code: string; file?: string; detail?: string; script?: string }[]
    scanned: string[]
  }
  export function findPopulationProblems(
    scanned: string[],
    tracked: string[]
  ): { code: string; file: string; detail?: string }[]
  export function selfTestControlCount(): number
  export const REQUIRED_SCAN_TARGETS: string[]
  export const VITEST_CONFIG_FILES: string[]
  export const PLAYWRIGHT_CONFIG_FILES: string[]
  export function runSelfTest(): string[]
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

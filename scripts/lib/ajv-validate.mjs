/**
 * Shared Ajv 2020 compiler. JSON Schema is the authority path for every
 * player-facing content, config, save, and UI contract.
 */
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Ajv2020 from 'ajv/dist/2020.js'

const here = path.dirname(fileURLToPath(import.meta.url))
export const repoRoot = path.resolve(here, '../..')

export function readJson(relativePath, root = repoRoot) {
  return JSON.parse(readFileSync(path.join(root, relativePath), 'utf8'))
}

export function listSchemaFiles(root = repoRoot) {
  return readdirSync(path.join(root, 'schema'))
    .filter((name) => name.endsWith('.schema.json'))
    .map((name) => `schema/${name}`)
    .sort()
}

export function createAjv(root = repoRoot) {
  const ajv = new Ajv2020({
    allErrors: true,
    strict: true,
    validateSchema: true,
    unicodeRegExp: true
  })
  for (const rel of listSchemaFiles(root)) {
    ajv.addSchema(readJson(rel, root))
  }
  return ajv
}

export function compileByPath(relativePath, root = repoRoot) {
  const ajv = createAjv(root)
  const schema = readJson(relativePath, root)
  if (typeof schema.$id === 'string') {
    const fn = ajv.getSchema(schema.$id)
    if (!fn) {
      throw new Error(`Schema not registered: ${schema.$id} (${relativePath})`)
    }
    return fn
  }
  return ajv.compile(schema)
}

export function validateInstance(schemaRelativePath, data, root = repoRoot) {
  const validate = compileByPath(schemaRelativePath, root)
  const ok = validate(data) === true
  return { ok, errors: validate.errors ?? [] }
}

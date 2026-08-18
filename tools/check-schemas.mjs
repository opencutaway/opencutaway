#!/usr/bin/env node
/**
 * Ajv inventory: every schema compiles; every player-facing instance validates.
 */
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { parse as parseYaml } from 'yaml'
import { CODE_ROWS } from './code-map.mjs'
import { repoRoot } from './file-map.mjs'
import { listSchemaFiles, validateInstance, readJson } from '../scripts/lib/ajv-validate.mjs'

function loadInstance(relativePath, root = repoRoot) {
  const full = path.join(root, relativePath)
  const text = readFileSync(full, 'utf8')
  if (relativePath.endsWith('.yaml') || relativePath.endsWith('.yml')) {
    return parseYaml(text)
  }
  return JSON.parse(text)
}

export function schemaRows(rows = CODE_ROWS) {
  return rows.filter((row) => typeof row.validates === 'string')
}

export function findProblems(rows = CODE_ROWS, root = repoRoot) {
  const problems = []
  const declared = new Set(schemaRows(rows).map((row) => row.validates))
  for (const file of listSchemaFiles(root)) {
    if (!declared.has(file)) {
      problems.push({ code: 'schema-not-in-code-map', file })
    }
  }
  for (const row of schemaRows(rows)) {
    if (!existsSync(path.join(root, row.validates))) {
      problems.push({ code: 'schema-missing', id: row.id, file: row.validates })
      continue
    }
    try {
      readJson(row.validates, root)
    } catch (error) {
      problems.push({
        code: 'schema-unreadable',
        id: row.id,
        file: row.validates,
        error: String(error)
      })
      continue
    }
    if (row.instances.length === 0) {
      problems.push({ code: 'schema-without-instance', id: row.id })
    }
    for (const instancePath of row.instances) {
      if (!existsSync(path.join(root, instancePath))) {
        problems.push({ code: 'instance-missing', id: row.id, file: instancePath })
        continue
      }
      const data = loadInstance(instancePath, root)
      const result = validateInstance(row.validates, data, root)
      if (!result.ok) {
        problems.push({
          code: 'instance-invalid',
          id: row.id,
          file: instancePath,
          errors: result.errors
        })
      }
    }
  }
  return problems
}

export function runSelfTest() {
  const failures = []
  const ghostSchema = findProblems([
    ...CODE_ROWS,
    {
      id: 'CODE-GHOST-SCHEMA',
      factId: 'DATA-GHOST',
      kind: 'content',
      produces: [],
      consumes: [],
      validates: 'schema/does-not-exist.schema.json',
      instances: [],
      publishes: 'ghost'
    }
  ])
  if (!ghostSchema.some((p) => p.code === 'schema-missing')) {
    failures.push('schema-missing detector silent')
  }

  const titleRow = CODE_ROWS.find((row) => row.id === 'CODE-TITLE-SCREEN')
  const badTitle = { ...titleRow, instances: ['content/ui/title-screen.json'] }
  const invalid = validateInstance(titleRow.validates, {
    schemaVersion: '0.1.0',
    screenId: 'title',
    title: 'Open Cutaway',
    blurb: 'x',
    actors: ['child', 'adult'],
    lessonsShipped: true
  })
  if (invalid.ok) {
    failures.push('lessonsShipped true accepted')
  }
  void badTitle
  void ghostSchema
  return failures
}

function main() {
  const arg = process.argv[2]
  if (arg === '--self-test') {
    const failures = runSelfTest()
    if (failures.length > 0) {
      for (const failure of failures) console.error(failure)
      process.exitCode = 1
      return
    }
    console.log('schema inventory self-test: 2/2 controls')
    return
  }
  const problems = findProblems()
  for (const problem of problems) console.error(JSON.stringify(problem))
  console.log(
    `schema inventory: ${listSchemaFiles().length} schemas, ${schemaRows().length} mapped, ${problems.length} problems`
  )
  if (problems.length > 0) process.exitCode = 1
}

const invoked = process.argv[1]
  ? pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url
  : false
if (invoked) {
  main()
}

#!/usr/bin/env node
/**
 * Ajv inventory: every schema compiles; every player-facing instance validates.
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
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

const TITLE_SCHEMA = 'schema/ui-title-screen.schema.json'
const TITLE_INSTANCE = 'content/ui/title-screen.json'
const ORPHAN_SCHEMA = 'schema/planted-orphan.schema.json'

/**
 * Plant a one-schema, one-instance repo root under the OS temp dir: the real
 * title-screen schema plus its committed instance. Each control mutates one
 * thing in that root and runs the real findProblems path against it.
 */
function plantRoot(tempRoots) {
  const root = mkdtempSync(path.join(tmpdir(), 'opencutaway-check-schemas-'))
  tempRoots.push(root)
  mkdirSync(path.join(root, 'schema'))
  mkdirSync(path.join(root, 'content', 'ui'), { recursive: true })
  copyFileSync(path.join(repoRoot, TITLE_SCHEMA), path.join(root, TITLE_SCHEMA))
  copyFileSync(path.join(repoRoot, TITLE_INSTANCE), path.join(root, TITLE_INSTANCE))
  return root
}

function onlyProblem(problems, expected) {
  if (problems.length !== 1) return false
  return Object.entries(expected).every(([key, value]) => problems[0][key] === value)
}

function describeProblems(problems) {
  return JSON.stringify(problems.map(({ code, id, file }) => ({ code, id, file })))
}

/**
 * Every detector code in findProblems has a control that runs through
 * findProblems itself on a planted fixture, plus one clean-fixture control
 * that proves the fixture is not red on its own. Returns a list of failures.
 */
export function runSelfTest() {
  const failures = []
  const tempRoots = []
  const titleRow = CODE_ROWS.find((row) => row.id === 'CODE-TITLE-SCREEN')
  if (!titleRow || titleRow.validates !== TITLE_SCHEMA) {
    return ['self-test fixture: CODE-TITLE-SCREEN row missing or moved']
  }
  const controls = [
    {
      name: 'clean-fixture',
      run: () => {
        const root = plantRoot(tempRoots)
        const problems = findProblems([titleRow], root)
        return problems.length === 0
          ? null
          : `clean fixture reported problems: ${describeProblems(problems)}`
      }
    },
    {
      name: 'schema-not-in-code-map',
      run: () => {
        const root = plantRoot(tempRoots)
        writeFileSync(
          path.join(root, ORPHAN_SCHEMA),
          JSON.stringify({
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            $id: 'https://opencutaway.github.io/schema/planted-orphan.schema.json',
            type: 'object'
          })
        )
        const problems = findProblems([titleRow], root)
        return onlyProblem(problems, { code: 'schema-not-in-code-map', file: ORPHAN_SCHEMA })
          ? null
          : `schema-not-in-code-map detector did not report exactly the planted problem: ${describeProblems(problems)}`
      }
    },
    {
      name: 'schema-missing',
      run: () => {
        const problems = findProblems([
          ...CODE_ROWS,
          {
            id: 'CODE-GHOST-SCHEMA',
            factId: 'DATA-GHOST',
            kind: 'content',
            produces: [],
            consumes: [],
            validates: 'schema/does-not-exist.schema.json',
            instances: [],
            e2eSpecs: [],
            publishes: 'ghost'
          }
        ])
        return problems.some(
          (p) =>
            p.code === 'schema-missing' &&
            p.id === 'CODE-GHOST-SCHEMA' &&
            p.file === 'schema/does-not-exist.schema.json'
        )
          ? null
          : `schema-missing detector silent: ${describeProblems(problems)}`
      }
    },
    {
      name: 'schema-unreadable',
      run: () => {
        const root = plantRoot(tempRoots)
        writeFileSync(path.join(root, TITLE_SCHEMA), '{ "not": json\n')
        const problems = findProblems([titleRow], root)
        return onlyProblem(problems, {
          code: 'schema-unreadable',
          id: 'CODE-TITLE-SCREEN',
          file: TITLE_SCHEMA
        })
          ? null
          : `schema-unreadable detector did not report exactly the planted problem: ${describeProblems(problems)}`
      }
    },
    {
      name: 'schema-without-instance',
      run: () => {
        const root = plantRoot(tempRoots)
        const problems = findProblems([{ ...titleRow, instances: [] }], root)
        return onlyProblem(problems, {
          code: 'schema-without-instance',
          id: 'CODE-TITLE-SCREEN'
        })
          ? null
          : `schema-without-instance detector did not report exactly the planted problem: ${describeProblems(problems)}`
      }
    },
    {
      name: 'instance-missing',
      run: () => {
        const root = plantRoot(tempRoots)
        const problems = findProblems(
          [{ ...titleRow, instances: ['content/ui/does-not-exist.json'] }],
          root
        )
        return onlyProblem(problems, {
          code: 'instance-missing',
          id: 'CODE-TITLE-SCREEN',
          file: 'content/ui/does-not-exist.json'
        })
          ? null
          : `instance-missing detector did not report exactly the planted problem: ${describeProblems(problems)}`
      }
    },
    {
      name: 'instance-invalid',
      run: () => {
        // The committed title instance with Cross the Street pointed at the Lights sitting.
        const root = plantRoot(tempRoots)
        const wrongTitle = loadInstance(TITLE_INSTANCE, root)
        wrongTitle.learnControl.sittingId = 'sitting-widen-2-lights'
        writeFileSync(path.join(root, TITLE_INSTANCE), JSON.stringify(wrongTitle))
        const problems = findProblems([titleRow], root)
        const hit =
          onlyProblem(problems, {
            code: 'instance-invalid',
            id: 'CODE-TITLE-SCREEN',
            file: TITLE_INSTANCE
          }) && problems[0].errors.length > 0
        return hit
          ? null
          : `instance-invalid detector did not report exactly the planted problem (wrong learn sittingId accepted): ${describeProblems(problems)}`
      }
    }
  ]
  try {
    for (const control of controls) {
      const failure = control.run()
      if (failure) failures.push(`${control.name}: ${failure}`)
    }
  } finally {
    for (const root of tempRoots) rmSync(root, { recursive: true, force: true })
  }
  return { failures, controlCount: controls.length }
}

function main() {
  const arg = process.argv[2]
  if (arg === '--self-test') {
    const { failures, controlCount } = runSelfTest()
    if (failures.length > 0) {
      for (const failure of failures) console.error(failure)
      console.error(
        `schema inventory self-test: ${controlCount - failures.length}/${controlCount} controls`
      )
      process.exitCode = 1
      return
    }
    console.log(`schema inventory self-test: ${controlCount}/${controlCount} controls`)
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

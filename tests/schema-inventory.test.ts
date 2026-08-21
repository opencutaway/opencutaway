import { spawnSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'
import { listSchemaFiles, validateInstance } from '../scripts/lib/ajv-validate.mjs'
import { readRepoJson, repoRoot } from './helpers/repo-files.ts'

function runCheckSchemas(...args: string[]) {
  const result = spawnSync(process.execPath, ['tools/check-schemas.mjs', ...args], {
    cwd: repoRoot,
    encoding: 'utf8'
  })
  return { status: result.status, stdout: result.stdout, stderr: result.stderr }
}

describe('Ajv schema inventory', () => {
  it('lists every committed JSON Schema file', () => {
    expect(listSchemaFiles()).toEqual([
      'schema/art-provenance.schema.json',
      'schema/art-tokens.schema.json',
      'schema/infrastructure-object-card.schema.json',
      'schema/local-profile.schema.json',
      'schema/sitting-widen-1.schema.json',
      'schema/sitting-widen-2.schema.json',
      'schema/system-chain.schema.json',
      'schema/ui-title-screen.schema.json',
      'schema/workflow-graph.schema.json'
    ])
  })

  it('accepts the title-screen UI contract', () => {
    const data = readRepoJson('content/ui/title-screen.json') as {
      title: string
      learnControl: { label: string; sittingId: string }
      lightsControl: { label: string; sittingId: string }
    }
    const result = validateInstance('schema/ui-title-screen.schema.json', data)
    expect(result.ok).toBe(true)
    expect(data.title).toBe('Open Cutaway')
    expect(data.learnControl.label).toBe('Get across')
    expect(data.learnControl.sittingId).toBe('sitting-widen-1-get-across')
    expect(data.lightsControl.label).toBe('Lights')
    expect(data.lightsControl.sittingId).toBe('sitting-widen-2-lights')
  })

  it('rejects a title contract that opens Get across as Lights', () => {
    const result = validateInstance('schema/ui-title-screen.schema.json', {
      schemaVersion: '0.3.0',
      screenId: 'title',
      title: 'Open Cutaway',
      blurb: 'A visual game about how infrastructure works.',
      actors: ['child', 'adult'],
      learnControl: {
        label: 'Get across',
        sittingId: 'sitting-widen-2-lights'
      },
      lightsControl: {
        label: 'Lights',
        sittingId: 'sitting-widen-2-lights'
      }
    })
    expect(result.ok).toBe(false)
  })

  it('rejects a title contract that opens Lights as Get across', () => {
    const result = validateInstance('schema/ui-title-screen.schema.json', {
      schemaVersion: '0.3.0',
      screenId: 'title',
      title: 'Open Cutaway',
      blurb: 'A visual game about how infrastructure works.',
      actors: ['child', 'adult'],
      learnControl: {
        label: 'Get across',
        sittingId: 'sitting-widen-1-get-across'
      },
      lightsControl: {
        label: 'Lights',
        sittingId: 'sitting-widen-1-get-across'
      }
    })
    expect(result.ok).toBe(false)
  })

  it('rejects a title contract with an extra property', () => {
    const result = validateInstance('schema/ui-title-screen.schema.json', {
      schemaVersion: '0.3.0',
      screenId: 'title',
      title: 'Open Cutaway',
      blurb: 'A visual game about how infrastructure works.',
      actors: ['child', 'adult'],
      learnControl: {
        label: 'Get across',
        sittingId: 'sitting-widen-1-get-across'
      },
      lightsControl: {
        label: 'Lights',
        sittingId: 'sitting-widen-2-lights'
      },
      analyticsId: 'nope'
    })
    expect(result.ok).toBe(false)
  })

  it('accepts the widen sitting 1 contract', () => {
    const result = validateInstance(
      'schema/sitting-widen-1.schema.json',
      readRepoJson('content/sittings/widen-1-get-across.json')
    )
    expect(result.ok).toBe(true)
  })

  it('accepts the widen sitting 2 contract', () => {
    const result = validateInstance(
      'schema/sitting-widen-2.schema.json',
      readRepoJson('content/sittings/widen-2-lights.json')
    )
    expect(result.ok).toBe(true)
  })
})

describe('check-schemas tool', () => {
  it('maps every schema file to a code row and finds no problems', () => {
    const run = runCheckSchemas()
    expect(run.stderr).toBe('')
    expect(run.stdout.trim()).toBe('schema inventory: 9 schemas, 9 mapped, 0 problems')
    expect(run.status).toBe(0)
  })

  it('runs a negative control for every detector code through findProblems', () => {
    const run = runCheckSchemas('--self-test')
    expect(run.stderr).toBe('')
    expect(run.stdout.trim()).toBe('schema inventory self-test: 7/7 controls')
    expect(run.status).toBe(0)
  })
})

import { describe, expect, it } from 'vitest'
import { listSchemaFiles, validateInstance } from '../scripts/lib/ajv-validate.mjs'
import { readRepoJson } from './helpers/repo-files.ts'

describe('Ajv schema inventory', () => {
  it('lists every committed JSON Schema file', () => {
    expect(listSchemaFiles()).toEqual([
      'schema/infrastructure-object-card.schema.json',
      'schema/local-profile.schema.json',
      'schema/system-chain.schema.json',
      'schema/ui-title-screen.schema.json',
      'schema/workflow-graph.schema.json'
    ])
  })

  it('accepts the title-screen UI contract', () => {
    const data = readRepoJson('content/ui/title-screen.json') as {
      title: string
      lessonsShipped: boolean
    }
    const result = validateInstance('schema/ui-title-screen.schema.json', data)
    expect(result.ok).toBe(true)
    expect(data.title).toBe('Open Cutaway')
    expect(data.lessonsShipped).toBe(false)
  })

  it('rejects a title contract that claims lessons already shipped', () => {
    const result = validateInstance('schema/ui-title-screen.schema.json', {
      schemaVersion: '0.1.0',
      screenId: 'title',
      title: 'Open Cutaway',
      blurb: 'A visual game about how infrastructure works.',
      actors: ['child', 'adult'],
      lessonsShipped: true
    })
    expect(result.ok).toBe(false)
  })

  it('rejects a title contract with an extra property', () => {
    const result = validateInstance('schema/ui-title-screen.schema.json', {
      schemaVersion: '0.1.0',
      screenId: 'title',
      title: 'Open Cutaway',
      blurb: 'A visual game about how infrastructure works.',
      actors: ['child', 'adult'],
      lessonsShipped: false,
      analyticsId: 'nope'
    })
    expect(result.ok).toBe(false)
  })
})

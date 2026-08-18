import { describe, expect, it } from 'vitest'
import { readRepoJson } from './helpers/repo-files.ts'

const CONTRACT_GROUPS = [
  'classification',
  'cleanup',
  'environment',
  'exception',
  'execution',
  'identity',
  'operation',
  'oracle',
  'ownership',
  'preconditions',
  'quality',
  'scope',
  'test_data',
  'traceability'
] as const

const EXCLUSION_FIELDS = [
  'exclusion_id',
  'category_ids',
  'reason',
  'role_owner',
  'review_date',
  'independent_review',
  'user_approval'
] as const

type TestEntry = {
  identity: { test_id: string }
  classification: { test_types: string[] }
}

type Exclusion = {
  exclusion_id: string
  category_ids: string[]
}

type Registry = {
  tests: Record<string, TestEntry>
  exclusions: Record<string, Exclusion>
}

describe('test registry coverage', () => {
  const taxonomy = readRepoJson(
    'tests/registry/test-taxonomy-ids.json'
  ) as string[]
  const registry = readRepoJson('tests/registry/test-registry.json') as Registry

  it('assesses every taxonomy category as applicable or excluded, never both', () => {
    const applicable = new Map<string, string[]>()
    const excluded = new Map<string, string>()

    for (const [testId, entry] of Object.entries(registry.tests)) {
      expect(entry.identity.test_id).toBe(testId)
      for (const group of CONTRACT_GROUPS) {
        expect(entry).toHaveProperty(group)
      }
      const uniqueTypes = new Set(entry.classification.test_types)
      expect(uniqueTypes.size).toBe(entry.classification.test_types.length)
      for (const categoryId of entry.classification.test_types) {
        const owners = applicable.get(categoryId) ?? []
        owners.push(testId)
        applicable.set(categoryId, owners)
      }
    }

    for (const [exclusionId, exclusion] of Object.entries(registry.exclusions)) {
      expect(exclusion.exclusion_id).toBe(exclusionId)
      for (const field of EXCLUSION_FIELDS) {
        expect(exclusion).toHaveProperty(field)
      }
      const uniqueIds = new Set(exclusion.category_ids)
      expect(uniqueIds.size).toBe(exclusion.category_ids.length)
      for (const categoryId of exclusion.category_ids) {
        expect(
          excluded.has(categoryId),
          `${categoryId} listed in multiple exclusions`
        ).toBe(false)
        excluded.set(categoryId, exclusionId)
      }
    }

    const both = [...applicable.keys()].filter((id) => excluded.has(id))
    expect(both).toEqual([])

    const assessed = new Set([...applicable.keys(), ...excluded.keys()])
    const missing = taxonomy.filter((id) => !assessed.has(id))
    const extra = [...assessed].filter((id) => !taxonomy.includes(id))
    expect(missing).toEqual([])
    expect(extra).toEqual([])
  })
})

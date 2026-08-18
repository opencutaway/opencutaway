import { describe, expect, it } from 'vitest'
import { compileSchema } from './helpers/schema.ts'
import { readRepoJson } from './helpers/repo-files.ts'

const objectCard = compileSchema('schema/infrastructure-object-card.schema.json')
const systemChain = compileSchema('schema/system-chain.schema.json')
const localProfile = compileSchema('schema/local-profile.schema.json')

describe('committed schema examples', () => {
  it('accepts the placeholder object card', () => {
    expect(objectCard(readRepoJson('content/examples/object-card.example.json'))).toBe(
      true
    )
  })

  it('accepts the placeholder system chain', () => {
    expect(systemChain(readRepoJson('content/examples/system-chain.example.json'))).toBe(
      true
    )
  })

  it('accepts the fake local profile', () => {
    const profile = readRepoJson('content/examples/local-profile.example.json') as {
      displayName: string
      cloudSync: boolean
    }
    expect(localProfile(profile)).toBe(true)
    expect(profile.cloudSync).toBe(false)
    expect(['Pat', 'Jordan', 'Player A']).toContain(profile.displayName)
  })
})

describe('invalid schema instances', () => {
  it('rejects an object card that omits safety', () => {
    const ok = objectCard({
      schemaVersion: '0.1.0',
      id: 'obj-example-placeholder',
      displayName: 'Example street object',
      functionSummary: 'Missing safety on purpose.',
      visualKind: 'object-portrait',
      license: { codeCompatible: 'MIT-clean', assetKind: 'original-writing' }
    })
    expect(ok).toBe(false)
  })

  it('rejects live-gear approach values other than never', () => {
    const ok = objectCard({
      schemaVersion: '0.1.0',
      id: 'obj-example-placeholder',
      displayName: 'Example street object',
      functionSummary: 'Unsafe approach value.',
      visualKind: 'cutaway',
      safety: { approachLiveGear: 'sometimes' },
      license: { codeCompatible: 'MIT-clean', assetKind: 'original-writing' }
    })
    expect(ok).toBe(false)
  })

  it('rejects cloudSync true on a local profile', () => {
    const ok = localProfile({
      schemaVersion: '0.1.0',
      profileId: 'profile-example-jordan',
      displayName: 'Jordan',
      createdOnDevice: true,
      cloudSync: true
    })
    expect(ok).toBe(false)
  })

  it('rejects a chain with fewer than two steps', () => {
    const ok = systemChain({
      schemaVersion: '0.1.0',
      id: 'chain-too-short',
      title: 'Too short',
      steps: [
        {
          order: 1,
          objectId: 'obj-example-placeholder',
          roleInChain: 'Only step'
        }
      ]
    })
    expect(ok).toBe(false)
  })

  it('rejects empty display names at the lower bound', () => {
    const ok = objectCard({
      schemaVersion: '0.1.0',
      id: 'obj-example-placeholder',
      displayName: '',
      functionSummary: 'Boundary: empty name.',
      visualKind: 'object-portrait',
      safety: { approachLiveGear: 'never' },
      license: { codeCompatible: 'MIT-clean', assetKind: 'original-writing' }
    })
    expect(ok).toBe(false)
  })

  it('rejects extra properties on an object card', () => {
    const ok = objectCard({
      schemaVersion: '0.1.0',
      id: 'obj-example-placeholder',
      displayName: 'Example street object',
      functionSummary: 'Additional property.',
      visualKind: 'object-portrait',
      safety: { approachLiveGear: 'never' },
      license: { codeCompatible: 'MIT-clean', assetKind: 'original-writing' },
      secretEmail: ['not-a-person', 'example.invalid'].join('@')
    })
    expect(ok).toBe(false)
  })
})

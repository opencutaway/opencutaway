import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { compileSchema } from './helpers/schema.ts'
import { readRepoJson, repoRoot } from './helpers/repo-files.ts'

type Provenance = {
  schemaVersion: string
  assetId: string
  file: string
  kind: string
  creator: string
  reviewer: string
  promptRecord: string
  references: { kind: string; note: string; licence: string }[]
  licence: string
  humanChanges: string
  technicalReview?: { result: string; record: string }
  originalityReview?: { result: string; record: string }
  fileHash: { algorithm: string; hex: string }
}

const provenanceSchema = compileSchema('schema/art-provenance.schema.json')
const RECORD_PATH = 'content/art/provenance/busy-block-placeholder.json'

function loadRecord(): Provenance {
  return structuredClone(readRepoJson(RECORD_PATH)) as Provenance
}

function errorPaths() {
  return (
    provenanceSchema.errors?.map((error) => `${error.keyword}${error.instancePath}`) ?? []
  )
}

function sha256OfRepoFile(relativePath: string): string {
  return createHash('sha256')
    .update(readFileSync(path.join(repoRoot, relativePath)))
    .digest('hex')
}

describe('busy block placeholder provenance', () => {
  it('accepts the committed record', () => {
    expect(provenanceSchema(readRepoJson(RECORD_PATH))).toBe(true)
  })

  it('records the placeholder honestly: role IDs, no prompt, original SVG', () => {
    const record = loadRecord()
    expect(record.assetId).toBe('TOWN_BUSY_BLOCK_OVERVIEW_IDLE_v001')
    expect(record.file).toBe('src/app/renderers/BusyBlock.tsx')
    expect(record.kind).toBe('svg-placeholder')
    expect(record.creator).toBe('ROLE-IMPLEMENTER')
    expect(record.reviewer).toBe('ROLE-REVIEWER')
    expect(record.promptRecord).toBe('none')
    expect(record.licence).toBe('MIT-clean')
    expect(record.references.length).toBe(1)
    expect(record.references[0].kind).toBe('none')
    expect(record.technicalReview?.result).toBe('pass')
    expect(record.originalityReview?.result).toBe('pass')
    expect(record.fileHash.algorithm).toBe('sha256')
  })

  it('pins the asset bytes: a redraw of BusyBlock.tsx must update the record hash', () => {
    const record = loadRecord()
    expect(record.fileHash.hex).toBe(
      '2729830554cf32afeee7dfc69f36d3d3f57f9d9a613aa3118a5216ab9eb748ac'
    )
    expect(sha256OfRepoFile(record.file)).toBe(record.fileHash.hex)
  })

  it('accepts each deliverable kind of the bible vocabulary', () => {
    for (const kind of ['svg-placeholder', 'scene', 'layer', 'mask', 'frames', 'audio', 'font']) {
      const record = loadRecord()
      record.kind = kind
      expect(provenanceSchema(record)).toBe(true)
    }
  })

  it('rejects a kind outside the deliverable vocabulary', () => {
    const record = loadRecord()
    record.kind = 'gif'
    expect(provenanceSchema(record)).toBe(false)
    expect(errorPaths()).toEqual(['enum/kind'])
  })

  it('rejects the retired png-layer kind', () => {
    const record = loadRecord()
    record.kind = 'png-layer'
    expect(provenanceSchema(record)).toBe(false)
    expect(errorPaths()).toEqual(['enum/kind'])
  })

  it('rejects an asset id outside the [LOCATION]_[OBJECT]_[VIEW]_[STATE]_[VERSION] pattern', () => {
    const record = loadRecord()
    record.assetId = 'town-busy-block-overview-idle-v1'
    expect(provenanceSchema(record)).toBe(false)
    expect(errorPaths()).toEqual(['pattern/assetId'])
  })

  it('rejects an asset id with no version suffix', () => {
    const record = loadRecord()
    record.assetId = 'TOWN_BUSY_BLOCK_OVERVIEW_IDLE'
    expect(provenanceSchema(record)).toBe(false)
    expect(errorPaths()).toEqual(['pattern/assetId'])
  })

  it('rejects an empty references list (a record must say what it drew from, even "none")', () => {
    const record = loadRecord()
    record.references = []
    expect(provenanceSchema(record)).toBe(false)
    expect(errorPaths()).toEqual(['minItems/references'])
  })

  it('rejects a sample-player name as creator (S7: role IDs only)', () => {
    const record = loadRecord()
    record.creator = 'Pat'
    expect(provenanceSchema(record)).toBe(false)
    expect(errorPaths()).toEqual(['pattern/creator'])
  })

  it('rejects a lower-case role id as reviewer', () => {
    const record = loadRecord()
    record.reviewer = 'role-reviewer'
    expect(provenanceSchema(record)).toBe(false)
    expect(errorPaths()).toEqual(['pattern/reviewer'])
  })

  it('rejects a file hash that is too short', () => {
    const record = loadRecord()
    record.fileHash.hex = '2729830554cf32afeee7dfc69f36d3d3f57f9d9a613aa3118a5216ab9eb748a'
    expect(record.fileHash.hex.length).toBe(63)
    expect(provenanceSchema(record)).toBe(false)
    expect(errorPaths()).toEqual(['pattern/fileHash/hex'])
  })

  it('rejects a hash algorithm other than sha256', () => {
    const record = loadRecord()
    record.fileHash.algorithm = 'md5'
    expect(provenanceSchema(record)).toBe(false)
    expect(errorPaths()).toEqual(['const/fileHash/algorithm'])
  })

  it('rejects an inline prompt record (prompt text never enters git)', () => {
    const record = loadRecord()
    record.promptRecord = 'inline'
    expect(provenanceSchema(record)).toBe(false)
    expect(errorPaths()).toEqual(['enum/promptRecord'])
  })

  it('rejects a record with no originality review', () => {
    const record = loadRecord()
    delete record.originalityReview
    expect(provenanceSchema(record)).toBe(false)
    expect(
      provenanceSchema.errors?.map(
        (error) => `${error.keyword}:${String(error.params.missingProperty)}`
      )
    ).toEqual(['required:originalityReview'])
  })

  it('rejects a review with an empty record reference', () => {
    const record = loadRecord()
    record.technicalReview = { result: 'pass', record: '' }
    expect(provenanceSchema(record)).toBe(false)
    expect(errorPaths()).toEqual(['minLength/technicalReview/record'])
  })

  it('rejects a licence outside the allowed set', () => {
    const record = loadRecord()
    record.licence = 'CC-BY-NC'
    expect(provenanceSchema(record)).toBe(false)
    expect(errorPaths()).toEqual(['enum/licence'])
  })

  it('rejects an extra property', () => {
    const record = { ...loadRecord(), promptText: 'draw a town' }
    expect(provenanceSchema(record)).toBe(false)
    expect(
      provenanceSchema.errors?.map(
        (error) => `${error.keyword}:${String(error.params.additionalProperty)}`
      )
    ).toEqual(['additionalProperties:promptText'])
  })
})

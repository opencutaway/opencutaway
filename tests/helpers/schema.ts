import Ajv2020 from 'ajv/dist/2020.js'
import { readRepoJson } from './repo-files.ts'

const ajv = new Ajv2020({ allErrors: true, strict: true })

export function compileSchema(relativePath: string) {
  const schema = readRepoJson(relativePath)
  return ajv.compile(schema)
}

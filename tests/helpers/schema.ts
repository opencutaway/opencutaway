import type { AnySchema, ValidateFunction } from 'ajv'
import { compileByPath } from '../../scripts/lib/ajv-validate.mjs'

export function compileSchema(relativePath: string): ValidateFunction<AnySchema> {
  return compileByPath(relativePath) as ValidateFunction<AnySchema>
}

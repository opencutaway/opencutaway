import { parse as parseYaml } from 'yaml'
import { describe, expect, it } from 'vitest'
import { compileSchema } from './helpers/schema.ts'
import { readRepoText } from './helpers/repo-files.ts'

type WorkflowNode = {
  id: string
  kind: string
  humanGate?: boolean
  halt?: boolean
}

type WorkflowGraph = {
  locus: string
  cycleCap: number
  unattendedChildCopyLoops: boolean
  nodes: WorkflowNode[]
  edges: { from: string; to: string; handoff: string }[]
}

const validate = compileSchema('schema/workflow-graph.schema.json')

describe('content-authoring workflow graph', () => {
  const graph = parseYaml(
    readRepoText('workflows/content-authoring.example.yaml')
  ) as WorkflowGraph

  it('matches the workflow schema and stays build-time', () => {
    expect(validate(graph)).toBe(true)
    expect(graph.locus).toBe('build-time')
    expect(graph.unattendedChildCopyLoops).toBe(false)
    expect(graph.cycleCap).toBeLessThanOrEqual(3)
  })

  it('requires a human gate before kid-facing copy can be committed', () => {
    const gate = graph.nodes.find((node) => node.id === 'kid-facing-copy-gate')
    expect(gate).toBeDefined()
    expect(gate?.kind).toBe('human-gate')
    expect(gate?.humanGate).toBe(true)
    expect(gate?.halt).toBe(true)
  })

  it('uses file-path handoffs between named nodes', () => {
    const nodeIds = new Set(graph.nodes.map((node) => node.id))
    expect(graph.edges.length).toBeGreaterThan(0)
    for (const edge of graph.edges) {
      expect(nodeIds.has(edge.from)).toBe(true)
      expect(nodeIds.has(edge.to)).toBe(true)
      expect(edge.handoff.length).toBeGreaterThan(0)
    }
  })
})

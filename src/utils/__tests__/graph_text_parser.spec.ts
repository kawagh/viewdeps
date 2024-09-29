import { describe, it, expect } from 'vitest'
import { parse } from '../graph_text_parser'

describe('graph_text_parser', () => {
  it('parse graph (5 nodes, 4 edges)', () => {
    const text = `Controller --> Service
Service --> ComponentA
Service --> ComponentB
ComponentB --> ComponentC
`
    const result = parse(text)
    expect(Object.keys(result.nodes).length).equal(5)
    expect(Object.keys(result.edges).length).equal(4)
  })
})

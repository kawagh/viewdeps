import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { parse } from '@/utils/graph_text_parser'

import * as vNG from 'v-network-graph'
//@ts-ignore
import dagre from 'dagre/dist/dagre.min.js'

export const useGraphStore = defineStore('graph', () => {
  const nodes: vNG.Nodes = reactive({
    node1: { name: 'Node 1' },
    node2: { name: 'Node 2' },
    node3: { name: 'Node 3' },
    node4: { name: 'Node 4' }
  })

  const edges: vNG.Edges = reactive({
    edge1: { source: 'node1', target: 'node2' },
    edge2: { source: 'node2', target: 'node3' },
    edge3: { source: 'node3', target: 'node4' }
  })
  const layouts: vNG.Layouts = reactive({
    nodes: {}
  })

  const configs: vNG.Config = vNG.defineConfigs({
    edge: {
      marker: {
        target: {
          type: 'arrow'
        }
      }
    }
  })

  const clearGraph = () => {
    Object.keys(edges).forEach((it) => {
      delete edges[it]
    })
    Object.keys(nodes).forEach((it) => {
      delete nodes[it]
    })
  }

  const loadGraph = (graphText: string) => {
    clearGraph()
    const result = parse(graphText)
    Object.entries(result.nodes).forEach(([k, v]) => {
      // TODO(future) assign id to avoid name collision between nodes
      nodes[v.name!] = v
    })
    Object.entries(result.edges).forEach(([k, v]) => {
      edges[k] = { source: v.source, target: v.target }
    })
  }

  function layout(direction: 'TB' | 'LR') {
    const nodeSize = 40
    // convert graph
    // ref: https://github.com/dagrejs/dagre/wiki
    const g = new dagre.graphlib.Graph()
    // Set an object for the graph label
    g.setGraph({
      rankdir: direction,
      nodesep: nodeSize * 2,
      edgesep: nodeSize,
      ranksep: nodeSize * 2
    })
    // Default to assigning a new object as a label for each new edge.
    g.setDefaultEdgeLabel(() => ({}))

    // Add nodes to the graph. The first argument is the node id. The second is
    // metadata about the node. In this case we're going to add labels to each of
    // our nodes.
    Object.entries(nodes).forEach(([nodeId, node]) => {
      g.setNode(nodeId, { label: node.name, width: nodeSize, height: nodeSize })
    })

    // Add edges to the graph.
    Object.values(edges).forEach((edge) => {
      g.setEdge(edge.source, edge.target)
    })

    dagre.layout(g)

    g.nodes().forEach((nodeId: string) => {
      // update node position
      const x = g.node(nodeId).x
      const y = g.node(nodeId).y
      layouts.nodes[nodeId] = { x, y }
    })
  }

  return { nodes, edges, layouts, configs, loadGraph, layout }
})

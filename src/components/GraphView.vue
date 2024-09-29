<script setup lang="ts">
import { VNetworkGraph } from "v-network-graph"
import * as vNG from 'v-network-graph'
import { ref } from "vue";
import { reactive } from "vue";
//@ts-ignore
import dagre from "dagre/dist/dagre.min.js"

const nodes: vNG.Nodes = {
    node1: { name: "Node 1" },
    node2: { name: "Node 2" },
    node3: { name: "Node 3" },
    node4: { name: "Node 4" },
}

const edges: vNG.Edges = {
    edge1: { source: "node1", target: "node2" },
    edge2: { source: "node2", target: "node3" },
    edge3: { source: "node3", target: "node4" },
}
const layouts: vNG.Layouts = reactive({
    nodes: {},
})

const configs: vNG.Config = vNG.defineConfigs({
    edge: {
        marker: {
            target: {
                type: "arrow"
            }
        }
    }

})
const graph = ref<vNG.VNetworkGraphInstance>()

function layout(direction: "TB" | "LR") {
    const nodeSize = 40
    // convert graph
    // ref: https://github.com/dagrejs/dagre/wiki
    const g = new dagre.graphlib.Graph()
    // Set an object for the graph label
    g.setGraph({
        rankdir: direction,
        nodesep: nodeSize * 2,
        edgesep: nodeSize,
        ranksep: nodeSize * 2,
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
    Object.values(edges).forEach(edge => {
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

function updateLayout(direction: "TB" | "LR") {
    // Animates the movement of an element.
    graph.value?.transitionWhile(() => {
        layout(direction)
    })
}
</script>

<template>
    <div>
        <!-- layout buttons -->
        <div>
            <button @click="updateLayout('LR')">layout graph Left to Right</button>
            <button @click="updateLayout('TB')">layout graph Top to Bottom</button>
        </div>

        <v-network-graph ref="graph" class="graph" :nodes="nodes" :edges="edges" :layouts=layouts :configs=configs />
    </div>
</template>

<style>
.graph {
    width: 800px;
    height: 600px;
    border: 1px solid;
}
</style>
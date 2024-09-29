<script setup lang="ts">
import { VNetworkGraph } from "v-network-graph"
import * as vNG from 'v-network-graph'

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
const layouts: vNG.Layouts = {
    nodes: {
        node1: { x: 0, y: 0 },
        node2: { x: 50, y: 50 },
        node3: { x: 100, y: 0 },
        node4: { x: 150, y: 50 },
    },
}

const configs: vNG.Config = vNG.defineConfigs({
    edge: {
        marker: {
            target: {
                type: "arrow"
            }
        }
    }

})
</script>

<template>
    <v-network-graph class="graph" :nodes="nodes" :edges="edges" :layouts=layouts :configs=configs />
</template>

<style>
.graph {
    width: 800px;
    height: 600px;
    border: 1px solid;
}
</style>
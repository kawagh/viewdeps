<script setup lang="ts">
import { VNetworkGraph } from 'v-network-graph'
import * as vNG from 'v-network-graph'
import { ref } from 'vue'
import { useGraphStore } from '@/stores/graph'

const inputValue = ref('')
const graphStore = useGraphStore()
const graphInstance = ref<vNG.VNetworkGraphInstance>()
const onSelectedFile = (it: any) => {
  const file: File = it.target.files[0]
  const reader = new FileReader()
  reader.onload = () => {
    if (reader.result) {
      graphStore.loadGraph(reader.result!.toString())
    }
  }
  reader.readAsText(file)
}

function updateLayout(direction: 'TB' | 'LR') {
  // Animates the movement of an element.
  graphInstance.value?.transitionWhile(() => {
    graphStore.layout(direction)
  })
}

const focusNode = (nodeId: string) => {
  const node = graphStore.layouts.nodes[nodeId]
  graphInstance.value?.setViewBox({
    left: node.x - 50,
    top: node.y - 50,
    right: node.x + 50,
    bottom: node.y + 50
  })
}
</script>

<template>
  <div>
    <div>
      <h1>viewdeps</h1>
      <div>
        <h2>import graph</h2>
        <input type="file" @change="onSelectedFile" />
      </div>
      <div style="margin-top: 20px">
        <h2>layout graph</h2>
        <button @click="updateLayout('LR')">Left to Right</button>
        <button @click="updateLayout('TB')">Top to Bottom</button>
      </div>
      <div style="margin-top: 20px">
        <h2>modify viewBox</h2>
        <h3>entire graph</h3>
        <button @click="graphInstance?.fitToContents">Fit contents</button>
        <button @click="graphInstance?.panToCenter">To center</button>

        <h3>focus to specific node</h3>
        <input v-model="inputValue" type="text" placeholder="enter node name" />
        <button @click="focusNode(inputValue)">focus</button>
      </div>
    </div>

    <v-network-graph
      style="margin-top: 20px"
      ref="graphInstance"
      class="graph"
      :nodes="graphStore.nodes"
      :edges="graphStore.edges"
      :layouts="graphStore.layouts"
      :configs="graphStore.configs"
    />
  </div>
</template>

<style>
.graph {
  width: 800px;
  height: 600px;
  border: 1px solid;
}
</style>

<script setup lang="ts">
import { VNetworkGraph } from 'v-network-graph'
import * as vNG from 'v-network-graph'
import { ref } from 'vue'
import { useGraphStore } from '@/stores/graph'

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
</script>

<template>
  <div>
    <!-- layout buttons -->
    <div>
      <button @click="updateLayout('LR')">layout graph Left to Right</button>
      <button @click="updateLayout('TB')">layout graph Top to Bottom</button>
      <div>
        <button @click="graphInstance?.fitToContents">Fit contents</button>
        <button @click="graphInstance?.panToCenter">To center</button>
      </div>
    </div>
    <input type="file" @change="onSelectedFile" />
    <v-network-graph
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

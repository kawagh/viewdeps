import * as vNG from 'v-network-graph'
export const parse = (text: string) => {
  const nodeNames: string[] = []
  const parsedEdges: [string, string][] = []
  console.log(text)
  text.split('\n').forEach((line) => {
    if (line.includes('-->')) {
      const from = line.split(' ')[0]
      const to = line.split(' ')[2]
      nodeNames.push(from)
      nodeNames.push(to)
      parsedEdges.push([from, to])
    }
  })
  const nodes = Array.from(new Set(nodeNames)).reduce((acc, cur, index) => {
    console.log(cur, index)
    acc[`node${index + 1}`] = { name: cur }
    return acc
  }, {} as vNG.Nodes)
  const edges = parsedEdges.reduce((acc, cur, index) => {
    acc[`edge${index + 1}`] = { source: cur[0], target: cur[1] }
    return acc
  }, {} as vNG.Edges)
  return { nodes, edges }
}

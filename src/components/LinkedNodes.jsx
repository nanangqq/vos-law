import React, {useState} from 'react'

import Node from './Node'

export default ({nodes})=>{
    const [nodeIds, setNodeIds] = useState(()=>{
        console.log(nodes)
        if (nodes.length) {
            return nodes.map( node=>node.nodeId )
        } else {
            return []
        }
    })
    console.log(nodeIds)
    return (
        <div>
            {nodes.map( ({nodeId, nodeName, nodeLabel})=><Node key={nodeId} nodeId={nodeId} nodeName={nodeName} nodeLabel={nodeLabel} /> )}
        </div>
    )
}
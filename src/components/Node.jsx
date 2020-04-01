import React, {useState, useMemo, useEffect, useCallback} from 'react'
import Axios from 'axios'

import PropTable from './PropTable'
import { findAllByDisplayValue } from '@testing-library/react'

const colorCode = (ho)=>{
    if (['17'].indexOf(ho)!==-1) {
        return '#3b86ff'
    } else if (['14'].indexOf(ho)!==-1) {
        return '#56d9fe'
    } else if (['03', '04'].indexOf(ho)!==-1) {
        return '#ff8373'
    } else if (['15'].indexOf(ho)!==-1) {
        return '#a3a1fb'
    } else if (['01', '02'].indexOf(ho)!==-1) {
        return '#ffda83'
    } else {
        return '#777777'
    }
}

const flipBool = bool=>!bool

const propsWillBeShown = {
    facility: ['ho', 'hoName', 'mok', 'mokName', 'ssName', 'ssConst1', 'ssConst2', 'ssConst3', 'ssExcluded', 'created_dt', 'updated_dt'],
    const: ['law', 'landuse', 'constNum', 'effect', 'avails', 'ssExcluded', 'created_dt', 'updated_dt'],
    limitation: ['lNum', 'sikText', 'created_dt', 'updated_dt'],
    rawLaw: ['ho', 'mok', 'lawText', 'created_dt', 'updated_dt']
}

const propTypes = {
    ho: 'int',
    hoName: 'text',
    mok: 'text',
    mokName: 'text',
    ssName: 'text',
    ssConst1: 'text',
    ssConst2: 'text',
    ssConst3: 'text',
    ssExcluded: 'text',
    created_dt: 'date',
    updated_dt: 'date',
    law: 'text',
    landuse: 'text',
    constNum: 'int',
    effect: 'text',
    avails: 'text',
    ssExcluded: 'text',
    lNum: 'int',
    sikText: 'text',
    lawText: 'text',
    facility: 'nodes',
    const: 'nodes',
    limitation: 'nodes',
    rawLaw: 'nodes'
}

const typeFunctions = {
    int: {
        read: v=>v.low,
        equalCheck: (a, b)=>a===b
    },
    text: {
        read: v=>v,
        equalCheck: (a, b)=>a===b
    },
    date: {
        read: v=>v? `${v.year.low}-${v.month.low}-${v.day.low}`: '-',
        equalCheck: (a, b)=>a===b // 나중에 수정
    },
    nodes: {
        // read 만들어야 할듯 나중에
        equalCheck: (a, b)=>{
            if (a.size===b.size) {
                a.forEach(el=>{
                    if (!b.has(el)) {
                        return false
                    }
                })
                return true
            } else {
                return false
            }
        }
    }
}

const Node = ({nodeId, nodeName, nodeLabel})=>{
    const [originalData, setOriginalData] = useState({})
    const [editedData, setEditedData] = useState({})
    const [infoBox, setInfoBox] = useState('')
    const [open, setOpen] = useState(false)
    const [linkedNodes, setLinkedNodes] = useState('')
    const [edited, setEdited] = useState(false)

    const saveNode = useCallback(()=>{
        console.log('save'+nodeId)
        console.log(originalData)
        console.log(editedData)

        const updatingParam = { props: Object.keys(editedData)
            .filter( propName=> !typeFunctions[propTypes[propName]].equalCheck(originalData[propName], editedData[propName]) )
            .reduce( (obj, propName)=>({...obj, [propName]: editedData[propName]}), {})
        }
        console.log(updatingParam)

        // Axios.put('/create/create-test', {updatingParam, nodeId, nodeLabel}).then(console.log)
    },[nodeId, originalData, editedData])

    const removeNode = useCallback(()=>{
        console.log('remove'+nodeId)
    },[nodeId])

    // const footer = useMemo(
    //     ()=>(
    //     <div style={{position: 'relative', left: 530}}>
    //         <span style={{color: edited? 'red': 'grey'}} onClick={edited? ()=>{saveNode()}: ()=>{}} >save</span>
    //         &nbsp;&nbsp;&nbsp;
    //         <span style={{color: 'red'}} onClick={()=>{removeNode()}} >remove</span>
    //     </div>
    //     ),
    //     [edited, saveNode]
    // )

    useEffect(()=>{
        if (open) {

            Axios.get(`/search/node-by-id?id=${nodeId}`).then(res=>{
                const node = res.data[0]._fields[0]
                // const tableData = Object.keys(node.properties).map(prop=>({
                // propsWillBeShown[nodeLabel].forEach((prop)=>{
                //     console.log(prop)
                //     console.log(propTypes[prop])
                //     console.log(typeFunctions[propTypes[prop]])
                // })
                const tableData = propsWillBeShown[nodeLabel].map(prop=>({
                    propName: prop,
                    // value: prop==='updated_dt'? '': JSON.stringify(node.properties[prop])
                    value: typeFunctions[propTypes[prop]].read(node.properties[prop])
                }))
                setInfoBox(<PropTable data={tableData} dataTypeIsNodes={false} setEdited={setEdited} setEditedData={setEditedData} />)
                setOriginalData(prev=>tableData.reduce((obj, row)=>({
                    ...obj,
                    [row.propName]: row.value
                }), prev))
            })

            Axios.get(`/search/linked-nodes?id=${nodeId}`).then(res=>{
                const nodes = res.data.reduce( (prev, cur)=>{
                    return { ...prev, [cur._fields[2]]: [...prev[cur._fields[2]], cur] }
                }, {
                    facility: [],
                    const: [],
                    limitation: [],
                    rawLaw: [],
                } )

                const linkedNodesData = Object.keys(nodes).filter(label=>nodes[label].length).map(label=>{
                    // const linkedWithLabel = [<Node key={'+'} nodeId={''} nodeName={'+'} nodeLabel={''} nodeFilter={''} />,
                    //     ...nodes[label].map(node=>(
                    //     // <Node key={node._fields[0].low} nodeId={node._fields[0].low} nodeName={node._fields[1]} nodeLabel={node._fields[2]} />
                    //     <div>{JSON.stringify(node)}</div>
                    // ))]
                    const linkedWithLabel = nodes[label].map( node=>({
                        nodeId: node._fields[0].low,
                        nodeName: node._fields[1],
                        nodeLabel: node._fields[2]
                    }) )//.....

                    return ({propName:`${label}`, value: linkedWithLabel})
                })

                setLinkedNodes(<PropTable data={linkedNodesData} dataTypeIsNodes={true} setEdited={setEdited} setEditedData={setEditedData} />)
                setOriginalData(prev=>linkedNodesData.reduce((obj, row)=>({
                    ...obj,
                    [row.propName]: new Set(row.value.map(node=>node.nodeId))
                }), prev))
            })

        } else {

        }
    }, [open])

    // useEffect(()=>{
    //     console.log(originalData)
    // }, [originalData])

    return (
        <div>
            <div 
                style={{
                    border: `2px solid gray`, //${colorCode(ho)}`,
                    backgroundColor: '#eee',
                    opacity: nodeName==='+'? 0.5: 1,
                    width:300,
                    borderRadius:4,
                    textAlign: nodeName==='+'? 'center': 'left',
                    padding:4,
                    margin:8
                }}
                onClick={()=>{setOpen(flipBool)}}
            >
                {nodeName}
            </div>
            {open? infoBox: ''}
            {open? linkedNodes: ''}
            {open? 
                <div style={{position: 'relative', left: 530}}>
                    <span style={{color: edited? 'red': 'grey'}} onClick={edited? ()=>{saveNode()}: ()=>{}} >save</span>
                    &nbsp;&nbsp;&nbsp;
                    <span style={{color: 'red'}} onClick={()=>{removeNode()}} >remove</span>
                </div>
            : ''}
        </div>
    )
}

export default Node
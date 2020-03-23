import React, {useState, useMemo, useEffect, useCallback} from 'react'
import Axios from 'axios'

import PropTable from './PropTable'

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
const Node = ({nodeId, nodeName})=>{
    // const [ho, mok, name] = facilityId.split('-')
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
    },[nodeId, originalData, editedData])

    const removeNode = useCallback(()=>{
        console.log('remove'+nodeId)
    },[nodeId])

    const footer = useMemo(
        ()=>(
        <div style={{position: 'relative', left: 530}}>
            <span style={{color: edited? 'red': 'grey'}} onClick={edited? ()=>{saveNode()}: ()=>{}} >save</span>
            &nbsp;&nbsp;&nbsp;
            <span style={{color: 'red'}} onClick={()=>{removeNode()}} >remove</span>
        </div>
        ),
        [edited, ]
    )

    useEffect(()=>{
        // console.log(infoBox)
        // console.log(open)
        if (open) {
            const tmp = []
            Axios.get(`/api/node-by-id?id=${nodeId}`).then(res=>{
                const node = res.data[0]._fields[0]
                // Object.keys(facility.properties).forEach(prop=>{
                //     tmp.push(<div>{prop}:{JSON.stringify(facility.properties[prop])}</div>)
                // })
                // // console.log(tmp)
                // console.log(facility)
                const tableData = Object.keys(node.properties).map(prop=>({
                    propName: prop,
                    value: JSON.stringify(node.properties[prop])
                }))
                // console.log(tableData)
                setInfoBox(<PropTable data={tableData} setEdited={setEdited} setEditedData={setEditedData} />)
                setOriginalData(prev=>tableData.reduce((obj, row)=>({
                    ...obj,
                    [row.propName]: row.value
                }), prev))
            })

            Axios.get(`/api/linked-nodes?id=${nodeId}`).then(res=>{
                // const records = res.data
                // console.log(res)
                // console.log(res.data.get(0))
                // console.log(res.data.filter(node=>node._fields[2]==='rawLaw'))
                const nodes = res.data.reduce((prev, cur)=>{
                    return { ...prev, [cur._fields[2]]: [...prev[cur._fields[2]], cur] }
                }, {
                    facility: [],
                    const: [],
                    limitation: [],
                    rawLaw: [],
                })

                const linkedNodesData = Object.keys(nodes).filter(label=>nodes[label].length).map(label=>{
                    const linkedWithLabel = nodes[label].map(node=>(
                        <Node key={node._fields[0].low} nodeId={node._fields[0].low} nodeName={node._fields[1]} />
                    ))
                    return ({propName:`${label}`, value: linkedWithLabel})
                })

                setLinkedNodes(<PropTable data={linkedNodesData} setEdited={setEdited} setEditedData={setEditedData} />)
                setOriginalData(prev=>linkedNodesData.reduce((obj, row)=>({
                    ...obj,
                    [row.propName]: row.value.map(node=>node.key)
                }), prev))

                // setLinkedNodes(Object.keys(nodes).filter(label=>nodes[label].length).map(label=>{
                //     const linkedWithLabel = nodes[label].map(node=>(
                //         <Node key={node._fields[0].low} nodeId={node._fields[0].low} nodeName={node._fields[1]} />
                //     ))
                //     return (<PropTable key={`${nodeId}_${label}`} data={[{propName:`${label}`, value: linkedWithLabel}]} setEdited={setEdited} />)
                // }))
                // const linked = res.data.map(rec=>(
                //     <Node key={rec._fields[0].low} nodeId={rec._fields[0].low} nodeName={rec._fields[1]} />
                // )) 
                // // res.data.filter()
                // // records.forEach(n=>{
                // //     tmp.push(<Node nodeId='1-1-1' nodeName={n._fields[0].properties.lawText} />)
                // // })

                // setLinkedNodes(<PropTable data={[{propName:'nodes', value: linked}]} />)
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
                    width:300,
                    borderRadius:4,
                    // textAlign:'center',
                    padding:4,
                    margin:8
                }}
                onClick={()=>{setOpen(flipBool)}}
            >
                {nodeName}
            </div>
            {open? infoBox: ''}
            {open? linkedNodes: ''}
            {open? footer: ''}
        </div>
    )
}

export default Node
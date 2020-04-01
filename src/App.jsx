import React, {useState, useEffect, useMemo, useCallback} from 'react'
import Axios from 'axios'
import CssBaseline from '@material-ui/core/CssBaseline'
import Checkbox from '@material-ui/core/Checkbox'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'

import Tabs from "./components/Tabs"
import LawParser from './utils/LawParser'
import Node from './components/Node'
import FilterGroup from './components/FilterGroup'

// const pickApi = {
//     0: '/api/facilities',
//     1: '/api/consts',
//     2: '/api/facilities'
// }

const tabNames = ['시설정의', '법규', '시설한정조건', '법규원문']

const tabLoc = 50
const checkBoxLeftMargin = 10

export default ()=>{
    const [tab, setTab] = useState(0)
    const [nodes, setNodes] = useState([])
    const [filtered, setFiltered] = useState([])
    const filterFunctions = useMemo( ()=>[
        node=>filtered.indexOf(node.props.nodeFilter.low)!==-1,
        node=>filtered.indexOf(node.props.nodeFilter)!==-1,
        node=>{
            try {
                // console.log(node.props.nodeFilter.reduce((prev, cur)=>prev+(filtered.indexOf(cur.low)!==-1), 0))
                const containChk = (node.props.nodeFilter.reduce((prev, cur)=>prev+(filtered.indexOf(cur.low)!==-1), 0))
                return containChk? true : false
            } catch (error) {
                return true
            }
        },
        node=>filtered.indexOf(node.props.nodeFilter)!==-1
    ], [filtered])
    
    // useEffect(()=>{
    //     Axios.get('/check/get-avail-list?landuse=제2종일반주거지역&jdName=국제교류복합지구&spcLawList=["교육환경법"]').then(console.log)
    // }, [])

    // useEffect(()=>{
    //     console.log(checked)
    // }, [checked])

    useEffect(()=>{
        Axios.get(`/search/get-nodes-by-label?label=${encodeURI(tabNames[tab])}`).then(res=>{
            setNodes( res.data.map(rec=>(
                <Node key={rec._fields[0].low} nodeId={rec._fields[0].low} nodeName={rec._fields[1]} nodeLabel={rec._fields[2]} nodeFilter={rec._fields[3]} />
            )) )
        })
    },[tab])

    // useEffect(()=>{
    //     console.log(filtered)
    // }, [filtered])

    return (
        <div>
            <CssBaseline />
            {/* <LawParser /> */}
            <Tabs tabs={tabNames} setTab={setTab} />
            <FilterGroup key={tab} tab={tab} setFiltered={setFiltered} />
            <div style={{position: 'relative', top: tabLoc}} >
                <Node key={'+'} nodeId={''} nodeName={'+'} nodeLabel={''} nodeFilter={''} />
                {nodes.filter( filterFunctions[tab] )}
            </div>
        </div>
    )
}

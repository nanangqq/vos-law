import React, {useState, useEffect} from 'react'
import Axios from 'axios'
import CssBaseline from '@material-ui/core/CssBaseline'

import Tabs from "./components/Tabs";
import LawParser from './utils/LawParser'
import Node from './components/Node'

// const pickApi = {
//     0: '/api/facilities',
//     1: '/api/consts',
//     2: '/api/facilities'
// }

const tabNames = ['시설정의', '법규', '시설한정조건', '법규원문']

export default ()=>{
    const [tab, setTab] = useState(0)
    const [nodes, setNodes] = useState([])

    useEffect(()=>{
        Axios.get(`/api/get-nodes-by-cat?cat=${encodeURI(tabNames[tab])}`).then(res=>{
            // console.log(res)
            setNodes( res.data.map(rec=>(
                <Node key={rec._fields[0].low} nodeId={rec._fields[0].low} nodeName={rec._fields[1]} />
            )) )
            // setNodes(records)
        })
    },[tab])

    return (
        <div>
            <CssBaseline />
            {/* <LawParser /> */}
            <Tabs tabs={tabNames}  setTab={setTab} />
            <div style={{position:'relative', top:60}}>
                {nodes}
            </div>
        </div>
    )
}
// "  1. 제1종전용주거지역안에서 건축할 수 있는 건축물 : 별표 2에 규정된 건축물"
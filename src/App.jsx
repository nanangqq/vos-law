import React, {useState, useEffect} from 'react'
import Axios from 'axios'
import LawParser from './utils/LawParser'
import FacilityCard from './components/FacilityCard'

export default ()=>{
    const [facilities, setFacilities] = useState([])

    useEffect(()=>{
        Axios.get('/api/facilities').then(res=>{
            const records = res.data.map(rec=>(
                <FacilityCard key={rec._fields[0]} facilityId={rec._fields[0]} facilityName={rec._fields[1]} />
            ))
            setFacilities(records)
        })
    },[])

    return (
        <div>
            {/* <LawParser /> */}
            {facilities}
        </div>
    )
}
// "  1. 제1종전용주거지역안에서 건축할 수 있는 건축물 : 별표 2에 규정된 건축물"
import React, {useState, useCallback, useEffect} from 'react'
import Axios from 'axios'

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

export default ({facilityId, facilityName})=>{
    const [ho, mok, num] = facilityId.split('-')
    const [infoBox, setInfoBox] = useState('')
    const [open, setOpen] = useState(false)

    useEffect(()=>{
        console.log(infoBox)
        console.log(open)
        if (open) {
            const tmp = []
            Axios.get(`/api/facility-by-id?id=${facilityId}`).then(res=>{
                const facility = res.data[0]._fields[0]
                Object.keys(facility.properties).forEach(prop=>{
                    tmp.push(<div>{prop}:{JSON.stringify(facility.properties[prop])}</div>)
                })
                console.log(tmp)
                setInfoBox(tmp)
            })
        } else {

        }
    }, [open])

    return (
        <div 
            style={{
                backgroundColor: colorCode(ho),
                width:300,
                borderRadius:4,
                // textAlign:'center',
                padding:4,
                margin:8
            }}
            onClick={()=>{setOpen(flipBool)}}
        >
            {`${ho} ${mok} ${facilityName}`}
            {open? infoBox: ''}
        </div>
    )
}
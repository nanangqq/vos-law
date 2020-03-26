import React, {useState, useEffect, useMemo, useCallback} from 'react'
import Checkbox from '@material-ui/core/Checkbox'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import TextField from '@material-ui/core/TextField'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Axios from 'axios'

import FacSearchBox from './FacSearchBox'

const tabLoc = 50
const checkBoxLeftMargin = 10

const catLists = [
    [
        '전체',
        '1호: 단독주택',
        '2호: 공동주택',
        '3호: 제1종근린생활시설',
        '4호: 제2종근린생활시설',
        '5호: 문화시설',
        '6호: 종교시설',
        '7호: 판매시설',
        '8호: 운수시설',
        '9호: 의료시설',
        '10호: 교육연구시설',
        '11호: 노유자시설',
        '12호: 수련시설',
        '13호: 운동시설',
        '14호: 업무시설',
        '15호: 숙박시설',
        '16호: 위락시설',
        '17호: 공장',
        '18호: 창고시설',
        '19호: 위험물 저장 및 처리 시설',
        '20호: 자동차 관련 시설',
        '21호: 동물 및 식물 관련 시설',
        '22호: 자원순환 관련 시설',
        '23호: 교정 및 군사 시설',
        '24호: 방송통신시설',
        '25호: 발전시설',
        '26호: 묘지 관련 시설',
        '27호: 관광 휴게시설',
        '28호: 장례시설',
        '29호: 야영장 시설',
    ],
    [
        '전체',
        '국토계획법',
        '도시계획조례(서울)',
        '지구단위계획',
        '교육환경법'
    ],
    [
        '전체'
    ],
    [
        '전체',
        '건축법 시행령'
    ]
]

const initCheckedGen = (tab, catList)=>{
    if (tab===2) {
        const emptyArr = [...Array(408)]
        return emptyArr.map( ()=>true )
    } else {
        return catList.map( ()=>true )
    }
}

const filteredGenFunctionList = (checked, catList)=>[
    ()=>checked.map( (bool, idx)=>{if (bool) {return idx}}),
    ()=>checked.map( (bool, idx)=>{if (bool) {return catList[idx]}}),
    ()=>checked.map( (bool, idx)=>{if (bool) {return idx}}),
    ()=>checked.map( (bool, idx)=>{if (bool) {return catList[idx]}})
]

export default ({tab, setFiltered})=>{
    const catList = catLists[tab]
    const initChecked = initCheckedGen(tab, catList)
    // console.log(initChecked)

    const [checked, setChecked] = useState(initChecked)
    const [catCheckBoxes, setCatCheckBoxes] = useState([])

    // const filteredGenFunctions = useMemo( ()=>[
    //     ()=>checked.map( (bool, idx)=>{if (bool) {return idx}}),
    //     ()=>checked.map( (bool, idx)=>{if (bool) {return catList[idx]}}),
    //     ()=>checked.map( (bool, idx)=>{if (bool) {return idx}}),
    //     ()=>checked.map( (bool, idx)=>{if (bool) {return catList[idx]}})
    // ], [checked])

    const handleCheckedList = useCallback((e)=>{
        const targetChecked = e.currentTarget.checked
        // console.log(checked)
        const sum = checked.reduce( (prev, cur)=>prev+cur )

        // console.log(targetChecked)
        const value = Number(e.currentTarget.value)

        let newChecked
        if (value===0) {
            if (targetChecked) {
                newChecked = checked.map( ()=>true )
            } else {
                newChecked = checked.map( ()=>false )
            }
        } else if (sum===checked.length) {
            newChecked = checked.map( (_, idx)=>[0, value].indexOf(idx)===-1? true: false )
        } else if (sum===checked.length-2 && targetChecked===true) {
            newChecked = checked.map( ()=>true )
        } else {
            newChecked = checked.map( (bool, idx)=>idx===value? targetChecked: bool )
        }

        setChecked( ()=>newChecked )
        // setChecked( prev=>prev.map( (bool, idx)=>idx===Number(value)? targetChecked: bool ) )
    }, [checked])


    useEffect(()=>{
        setCatCheckBoxes( () => catList.map( (chkLabel, idx)=>{
            return (
                <FormControlLabel
                    key = {chkLabel}
                    control={<Checkbox
                        checked={initChecked[idx]}
                        onChange={handleCheckedList}
                        value={idx}
                        color='default'
                    />}
                    label={chkLabel}
                />
            )})
        )
        // setFiltered( ()=>initChecked.map( (bool, idx)=>{if (bool) {return idx}}) )


    }, [])


    useEffect(()=>{
        if (catCheckBoxes.length) {
            setCatCheckBoxes( prev => prev.map( (chkBox, idx)=>{
                return (
                    <FormControlLabel
                        key = {chkBox.key}
                        control={<Checkbox
                            checked={checked[idx]}
                            onChange={handleCheckedList}
                            value={idx}
                            color='default'
                        />}
                        label={chkBox.props.label}
                    />
                )
            }))
            
        }
        setFiltered( filteredGenFunctionList(checked, catList)[tab] )
    }, [checked])

    return (
        <div style={{position:'relative', top: tabLoc, marginLeft: checkBoxLeftMargin}} >
            <FormGroup row>
                {catCheckBoxes}
                {tab===2? 
                <FacSearchBox checked={checked} setChecked={setChecked} handleCheckedList={handleCheckedList} />:
                ''}
            </FormGroup>
        </div>
    )
}

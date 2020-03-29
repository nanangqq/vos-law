import React, {useState, useEffect, useCallback} from 'react'
import TextField from '@material-ui/core/TextField'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Checkbox from '@material-ui/core/Checkbox'
import ListItemText from '@material-ui/core/ListItemText'
import Axios from 'axios'
import {debounce} from 'lodash'

const tabLoc = 50
const checkBoxLeftMargin = 10

export default ({checked, handleCheckedList})=>{
    const [searchBox, setSearchBox] = useState(false)
    const [facilityList, setFacilityList] = useState([])
    const [rect, setRect] = useState('')
    const [facilityFilterFunc, setFacilityFilterFunc] = useState( [()=>true] )
    const [scrollFunction, setScrollFunction] = useState( [(el, idx)=>idx<50? true: false] )

    const api = searchText=>searchText?
    `/search/search-facility-by-name?search=${encodeURI(searchText)}`:
    `/search/search-facility-by-name?search=${'all'}`

    // const handleCheck = e=>{
    //     console.log(e)
    // }

    useEffect(()=>{
        Axios.get(api('')).then(res=>{
            setFacilityList(res.data.map(rec => {
                const value = rec._fields[0].low
                const name = rec._fields[1]
                return (
                <ListItem key={`${value}_${name}`} dense button >
                    <ListItemIcon>
                        <Checkbox
                            checked={checked[value]}
                            value={value}
                            onChange={handleCheckedList}
                            // onClick={console.log}
                            color='default'
                        />
                    </ListItemIcon>
                    <ListItemText primary={name} />
                </ListItem>
                )
            }))
        })
    }, [])

    useEffect(()=>{
        // console.log(checked)
        setFacilityList(prev=>prev.map(item => {
            const [value, name] = item.key.split('_')
            // console.log(value)
            // console.log(name)
            return (
            <ListItem id='searchItem' key={`${value}_${name}`} dense button >
                <ListItemIcon id='searchIcon'>
                    <Checkbox
                        id='checkBox'
                        checked={checked[value]}
                        value={value}
                        onChange={handleCheckedList}
                        // onClick={console.log}
                        color='default'
                    />
                </ListItemIcon>
                <ListItemText primary={name} />
            </ListItem>
            )
        }))
    }, [checked])

    const realHandleChange = debounce(target=>{
        // console.log(target)
        const searchText = target.value
        if (searchText) {
            setFacilityFilterFunc( [facility=>facility.key.indexOf(searchText)!==-1] )
        } else {
            setFacilityFilterFunc( [()=>true] )
        }
    }, 100)

    const handleChange = e=>{
        // console.log(e.target)
        realHandleChange(e.target)
    }

    const handleFocus = useCallback( e=>{
        // console.log(e.target.value)
        const searchText = e.target.value
        if (searchText) {
            setFacilityFilterFunc( [facility=>facility.key.indexOf(searchText)!==-1] )
        } else {
            setFacilityFilterFunc( [()=>true] )
        }
        const rect = e.target.getBoundingClientRect()
        setRect(rect)
        setSearchBox(true)
    }, [facilityList])

    const handleBlur = e=>{
        // actualHandleBlur(e.nativeEvent.toElement.id)
        const elementId = e.nativeEvent.toElement.id
        if (['searchList', 'searchBox', 'searchTooltip', 'searchItem', 'searchIcon', 'checkBox'].indexOf(elementId)===-1) {
            setSearchBox(false)
        }
    }

    const actualScrollHandler = debounce(scrollTop=>{
        // console.log(scrollTop)
        const scrollNum = Math.floor((scrollTop+1200)/2500)+1
        // console.log(scrollNum)
        setScrollFunction( [(el, idx)=>idx<50*scrollNum? true: false] )
    }, 100)

    const handleScroll = e=>{
        actualScrollHandler(e.nativeEvent.srcElement.scrollTop)
    }

    return (
        <div>
            <TextField 
                id='searchBox' 
                type="search" 
                margin='dense' 
                style={{width: 300}} 
                // onFocus={handleFocus} 
                onMouseOver={handleFocus} 
                onChange={handleChange}
                onMouseLeave={handleBlur}
            />
            {/* {searchBox} */}
            <div id='searchTooltip' 
                style={{
                    border: '1px solid black', 
                    width: 300, height: 400, 
                    position: 'absolute', 
                    left: rect? rect.left-checkBoxLeftMargin: 0, 
                    top: rect? rect.bottom-tabLoc: 0, 
                    zIndex:10, 
                    overflow:'auto',
                    backgroundColor: 'white',
                    display: searchBox? '': 'none'
                }}
                onScroll={handleScroll}
                onMouseLeave={handleBlur} >
                <List id='searchList'>
                    {facilityList.filter( facilityFilterFunc[0] ).filter( scrollFunction[0] )}
                </List>
            </div>
        </div>
    )
}
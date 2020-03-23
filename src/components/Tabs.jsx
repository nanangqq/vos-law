import React, {useState, useEffect} from 'react'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

export default function SimpleTabs({tabs, setTab}) {
    const [value, setValue] = useState(0)
    const [items, setItems] = useState([])
    const handleChange = (event, newValue) => {
        setValue(newValue)
    }
    // console.log(tabs)

    useEffect(()=>{
        setItems(tabs.map((tabName, i)=><Tab key={tabName} label={tabName} onClick={()=>{setTab(i)}} />))
    }, [])

    return (
    <div>
        <AppBar color='default'>
            <Tabs value={value} onChange={handleChange}>
                {items}
            </Tabs>
        </AppBar>
    </div>
    )
}
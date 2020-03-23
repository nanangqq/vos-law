import React, {useState, useMemo, useEffect} from 'react'
import { useTable, useBlockLayout } from 'react-table'
import MaUTable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Input from '@material-ui/core/Input'

const nodeLabels = ['facility', 'const', 'limitation', 'rawLaw']

const EditableCell = (data) => {
    // console.log(data.row.original.propName)

    const initialValue = data.cell.value
    const index = data.row.index
    const id = data.column.id
    const updateCellData = data.updateCellData
    const rowName = data.row.original.propName

    // We need to keep and update the state of the cell normally
    // console.log(id)
    // console.log(index)
    const [value, setValue] = useState(initialValue)
    
    const onChange = e => {
        setValue(e.target.value)
    }

    // We'll only update the external data when the input is blurred
    const onBlur = () => {
        updateCellData(index, id, value)
    }

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])
    // console.log(rowName)
    // console.log(value)
    return id==='propName' ? 
        <div>{value}</div>:
        nodeLabels.indexOf(rowName)!==-1 ?
        <div>{value}</div>:
        <Input value={value} onChange={onChange} onBlur={onBlur} style={{width:300}} />
}


// Set our editable cell renderer as the default Cell renderer
const defaultColumn = { Cell: EditableCell }


const Table = ({ columns, data, updateCellData, skipPageReset })=>{
// Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data,
        defaultColumn,
        autoResetPage: !skipPageReset,
        updateCellData
        },
        useBlockLayout
    )

    // Render the UI for your table
    return (
        <MaUTable {...getTableProps()} size='small' >
            <TableBody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row)
                    return (
                        <TableRow {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return <TableCell {...cell.getCellProps()} >{cell.render('Cell')}</TableCell>
                            })}
                        </TableRow>
                    )
                })}
            </TableBody>
        </MaUTable>
    )
}


export default ({data, setEdited, setEditedData})=>{
    const columns = React.useMemo(
        ()=>[
                {
                    Header: 'propName',
                    accessor: 'propName',
                    width: 300
                },
                {
                    Header: 'value',
                    accessor: 'value',
                    width: 325
                }
            ],
        []
    )

    const [tmpData, setTmpData] = React.useState(data)
    const [skipPageReset, setSkipPageReset] = React.useState(false)
  
    // We need to keep the table from resetting the pageIndex when we
    // Update data. So we can keep track of that flag with a ref.
  
    // When our cell renderer calls updateMyData, we'll use
    // the rowIndex, columnId and new value to update the
    // original data
    const updateCellData = (rowIndex, columnId, value) => {
        // We also turn on the flag to not reset the page
        setSkipPageReset(true)
        setTmpData(old =>
            old.map((row, index) => {
                if (index === rowIndex) {
                    return {
                        ...old[rowIndex],
                        [columnId]: value,
                    }
                }
                return row
            })
        )
    }

    // After data chagnes, we turn the flag back off
    // so that if data actually changes when we're not
    // editing it, the page is reset
    React.useEffect(() => {
        setSkipPageReset(false)
        // console.log(data)
        // console.log(tmpData)
        // tmpData.forEach(row=>{
        //     if 
        //     console.log(row)
        // })
        for (let i=0; i<tmpData.length; i++) {
            // console.log(tmpData[i].value)
            // console.log(data[i].value)
            if (tmpData[i].value!==data[i].value) {
                console.log('edited')
                setEdited(true)
                setEditedData(tmpData)
                break
            }
            setEdited(false)
            setEditedData(tmpData)
        }

    }, [tmpData])
  
    // Let's add a data resetter/randomizer to help
    // illustrate that flow...
    // const resetData = () => setData(originalData)
    return (
        <div>
            <Table 
                columns={columns} 
                data={tmpData} 
                updateCellData={updateCellData}
                skipPageReset={skipPageReset}
            />
        </div>
    )
}

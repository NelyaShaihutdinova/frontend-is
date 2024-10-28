import { useMemo} from 'react'
import { useTable, usePagination } from 'react-table'
import MOCK_DATA from '../../constans/MOCK_DATA.json'
import {COLUMNS} from '../../constans/Columns.js'
import './table.css'

function PaginationTable() {
    const columns = useMemo(() => COLUMNS, [])
    const data = useMemo(() => MOCK_DATA, [])

    const tableInstance = useTable({
        columns,
        data
    }, usePagination)

    const { getTableProps, getTableBodyProps, headerGroups, page, nextPage, previousPage, prepareRow} = tableInstance
    return (
        <>
            <table {...getTableProps()}>
                <thead>
                {headerGroups.map((headerGroup) => (
                    <tr key="" {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th key="" {...column.getHeaderProps()}>{column.render('Header')}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {
                    page.map(row => {
                        prepareRow(row)
                        return (
                            <tr key="" {...row.getRowProps()}>
                                {row.cells.map((cell) => {
                                    return <td key="" {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                })}
                            </tr>
                        )
                    })
                }
                </tbody>
                <div>
                    <button onClick={() => previousPage()} className="table-btn">Previous</button>
                    <button onClick={() => nextPage()} className="table-btn">Next</button>
                </div>
            </table>
        </>
    )
}

export default PaginationTable
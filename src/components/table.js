import React from 'react'
import { useTable, useSortBy } from 'react-table'
import './table.css'

const Table = ({ 
	columns, 
	data, 
	initialState = {},
	disableSortBy = false,
	scrolling = false,
	getRowProps = () => ({}),
}) => {
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
	} = useTable(
		{
			columns,
			data,
			initialState,
			disableSortBy
		},
		useSortBy
	)

	return (
		<div className={`table-wrapper ${scrolling ? 'scrolling' : ''}`}>
			<table { ...getTableProps() }>
				<thead>
					{ headerGroups.map(headerGroup => (
						<tr { ...headerGroup.getHeaderGroupProps() }>
							{ headerGroup.headers.map(column => (
								// Add the sorting props to control sorting. For this example
								// we can add them into the header props
								<th { ...column.getHeaderProps(column.getSortByToggleProps()) } className={column.className || ''}>
									{column.render('Header')}
									{/* Add a sort direction indicator */}
									<span className="sort-indicator">
										{ column.isSorted
											? column.isSortedDesc
												? '‹'
												: '›'
											: ''
										}
									</span>
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody { ...getTableBodyProps() }>
					{ rows.map(
						(row, i) => {
							prepareRow(row);
							return (
								<tr { ...row.getRowProps(getRowProps(row)) }>
									{ row.cells.map(cell => {
										return (
											<td 
												{ ...cell.getCellProps({
														className: cell.column.className,
														style: cell.column.style,
													}) 
												}
											>
												{ cell.render('Cell') }
											</td>
										)
									})}
								</tr>
							)}
					)}
				</tbody>
			</table>
		</div>
	)
}

export default Table

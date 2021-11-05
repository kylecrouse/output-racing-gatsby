import React from 'react'
import { useTable, useSortBy } from 'react-table'

const Table = ({ 
	columns, 
	data, 
	initialState = {},
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
		},
		useSortBy
	)

	return (
		<table { ...getTableProps() }>
			<thead>
				{ headerGroups.map(headerGroup => (
					<tr { ...headerGroup.getHeaderGroupProps() }>
						{ headerGroup.headers.map(column => (
							// Add the sorting props to control sorting. For this example
							// we can add them into the header props
							<th { ...column.getHeaderProps(column.getSortByToggleProps()) }>
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
	)
}

export default Table
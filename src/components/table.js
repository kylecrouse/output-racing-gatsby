import React from 'react'
import { useTable, useSortBy } from 'react-table'
import './table.scss'

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
	
	const [overflowLeft, setOverflowLeft] = React.useState(false)
	const [overflowRight, setOverflowRight] = React.useState(false)
	const [left, setLeft] = React.useState(0)
	
	const tableRef = React.useRef()
	const wrapperRef = React.useRef()
	
	const handleScroll = ({ target: { scrollLeft, scrollLeftMax } }) => {
		if (scrollLeft > 0)
			!overflowLeft && setOverflowLeft(true)
		else 
			overflowLeft && setOverflowLeft(false)
			
		if (scrollLeft < scrollLeftMax)
			!overflowRight && setOverflowRight(true)
		else
			overflowRight && setOverflowRight(false)
	}
	
	let wrapperClassName = ['table-wrapper']
	if (scrolling)
		wrapperClassName.push('scrolling')
	if (overflowLeft)
		wrapperClassName.push('overflow-left')
	if (overflowRight)
		wrapperClassName.push('overflow-right')
		
	React.useEffect(() => {
		const stickyCells = Array.from(tableRef.current.querySelectorAll('tbody tr:first-child td'))
		const stickyCols = stickyCells.reduce((n, cell) => {
			return (window.getComputedStyle(cell).getPropertyValue("position") === "sticky") 
				? ++n
				: n
		}, 0)
		
		setLeft(
			stickyCells.reduce((a, cell) => {
				const style = window.getComputedStyle(cell)
				if (style.getPropertyValue("position") === "sticky")
					a += parseFloat(style.getPropertyValue("width"))
				return a
			}, 0)
		)

		tableRef.current
			.querySelectorAll(`th:nth-child(-n+${stickyCols}), td:nth-child(-n+${stickyCols})`)
			.forEach(cell => {
				cell.style.setProperty('left', `${cell.offsetLeft}px`)
			})

		if (scrolling &&
			parseFloat(window.getComputedStyle(tableRef.current).getPropertyValue('width'))
				> parseFloat(window.getComputedStyle(wrapperRef.current).getPropertyValue('width'))
		) 
			setOverflowRight(true)
		
	}, [scrolling])
	
	React.useEffect(() => {
		wrapperRef.current.style.setProperty('--left', `${left}px`)
	}, [left])

	return (
		<div className="table-container">
			<div className={wrapperClassName.join(' ')} onScroll={ handleScroll } ref={wrapperRef}>
				<table { ...getTableProps() } ref={tableRef}>
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
		</div>
	)
}

export default Table

import React from 'react'
import {
	useReactTable,
	getCoreRowModel,
	getFilteredRowModel,
	getGroupedRowModel,
	getSortedRowModel,
	flexRender,
} from '@tanstack/react-table'
import './table.scss'

const TYPE_ORDER = ['Overall', 'Short Track', '1 mile', 'Intermediate', '2+ mile', 'Superspeedway', 'Road Course', 'Dirt Oval', 'Rallycross']

const Table = ({ 
	columns, 
	data, 
	initialState = {},
	scrolling = false,
	showFooter = false,
	filters = [],
}) => {
	const [grouping, setGrouping] = React.useState(initialState.grouping ?? [])
	const [sorting, setSorting] = React.useState(initialState.sorting ?? [])
	const [columnFilters, setColumnFilters] = React.useState(initialState.columnFilters ?? [])
	const [columnVisibility, setColumnVisibility] = React.useState(initialState.columnVisibility ?? {})
	
	const table = useReactTable({
		data,
		columns,
		state: { 
			grouping, 
			sorting, 
			columnFilters, 
			columnVisibility 
		},
		onGroupingChange: setGrouping,
		onSortingChange: setSorting,
		onColumnVisibilityChange: setColumnVisibility,
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		getGroupedRowModel: getGroupedRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getCoreRowModel: getCoreRowModel(),
		groupedColumnMode: false,
		sortingFns: {
			trackNameSorting: (a, b, columnId) => {
				const [aTrack, aType] = a.getValue(columnId).split('|')
				const [bTrack, bType] = b.getValue(columnId).split('|')
				if (aTrack < bTrack)
					return -1
				else if (aTrack > bTrack)
					return 1
				else
					return TYPE_ORDER.indexOf(aType) - TYPE_ORDER.indexOf(bType)
			},
			trackTypeSorting: (a, b, columnId) => {
				const aType = a.getValue(columnId)
				const bType = b.getValue(columnId)
				return TYPE_ORDER.indexOf(aType) - TYPE_ORDER.indexOf(bType)
			}
		},
	})
	
	const [overflowLeft, setOverflowLeft] = React.useState(false)
	const [overflowRight, setOverflowRight] = React.useState(false)
	const [left, setLeft] = React.useState(0)
	
	const tableRef = React.useRef()
	const wrapperRef = React.useRef()
	
	const handleScroll = (props) => {
		const { clientWidth, scrollLeft, scrollWidth } = props.target

		if (scrollLeft > 0)
			!overflowLeft && setOverflowLeft(true)
		else 
			overflowLeft && setOverflowLeft(false)
			
		if (scrollLeft + clientWidth < scrollWidth)
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
	
	React.useEffect(() => {
		filters?.forEach(
			({ id, value }) => {
				const column = table.getColumn(id)
				column.setFilterValue((old) => value)
			}
		)
	}, [filters, table])
	
	return (
		<div className="table-container">
			<div className={wrapperClassName.join(' ')} onScroll={ handleScroll } ref={wrapperRef}>
				<table ref={tableRef}>
					<thead>
						{ table.getHeaderGroups().map(headerGroup => (
							<tr key={headerGroup.id}>
								{ headerGroup.headers.map(header => (
									<th key={header.id} colSpan={header.colSpan} className={header.column.columnDef.className ?? ''}>
										{
											flexRender(
												header.column.columnDef.header,
												header.getContext()
											)
										}
										<span className="sort-indicator">
											{ header.column.getCanSort()
												? { asc: '›', desc: '‹' }[header.column.getIsSorted()] ?? null
												: ''
											}
										</span>
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody>
						{ table.getRowModel().rows.map((row) => {
							return (
								<tr key={row.id}>
									{ row.getVisibleCells().map((cell) => {
										return (
											<td 
												{...{
													key: cell.id,
													className: cell.column.columnDef.className,
													style: cell.column.style,
												}}
											>
												{ cell.getIsAggregated() ? (
													// If the cell is aggregated, use the Aggregated
													// renderer for cell
													flexRender(
														cell.column.columnDef.aggregatedCell ??
															cell.column.columnDef.cell,
														cell.getContext()
													)
												) : cell.getIsPlaceholder() ? null : ( // For cells with repeated values, render null
													// Otherwise, just render the regular cell
													flexRender(
														cell.column.columnDef.cell,
														cell.getContext()
													)
												)}
											</td>
										)
									})}
								</tr>
							)}
						)}
					</tbody>
					{ showFooter &&
						<tfoot>
							{table.getFooterGroups().map(footerGroup => (
								<tr key={footerGroup.id}>
									{footerGroup.headers.map(header => (
										<th key={header.id} className={header.column.columnDef.className ?? ''}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.footer,
														header.getContext()
													)}
										</th>
									))}
								</tr>
							))}
						</tfoot>						
					}
				</table>
			</div>
		</div>
	)
}

export default Table
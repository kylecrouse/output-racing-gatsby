import * as React from "react"
import { graphql } from 'gatsby'
import DriverChip from '../components/driverChip'
import Layout from '../components/layout'
import Meta from '../components/meta'
import Select from 'react-select'
import { useTable, useGroupBy, useSortBy } from 'react-table'
import * as styles from './stats.module.scss'

// const formatValue = ({ value }) => (Math.round(value * 10) / 10).toFixed(1)
const sortAlpha = (a, b) => {
	const va = a[a.hasOwnProperty('sort') ? 'sort' : 'label'].toUpperCase(),
				vb = b[b.hasOwnProperty('sort') ? 'sort' : 'label'].toUpperCase()
	if (va < vb)
		return -1
	else if (va > vb)
		return 1
	else return 0
}

const StatsTemplate = props => {
	const [carId, setCarId] = React.useState([])
	const [driverId, setDriverId] = React.useState([])
	const [trackConfigId, setTrackConfigId] = React.useState([])
	const [trackType, setTrackType] = React.useState([])
	const data = React.useMemo(
		() => props.data.races.edges.reduce(
			(a, { node }) => {
				if (trackConfigId.length > 0 && !trackConfigId.includes(node.trackConfigId))
					return a
				if (trackType.length > 0 && !trackType.includes(node.trackType))
					return a
				return [
					...a, 
					...node.participants.filter(p => {
						if (driverId.length > 0 && !driverId.includes(p.driverId))
							return false
						if (carId.length > 0 && !carId.includes(p.carId))
							return false
						return props.data.activeDrivers.edges.some(
							({ node }) => node.driverId === p.driverId
						)
					})
				]	
			},
			[]
		),
		[
			props.data.races.edges, 
			props.data.activeDrivers.edges, 
			trackConfigId, 
			trackType, 
			driverId,
			carId
		]
	)
	const { 
		driverOptions = [], 
		trackOptions = [], 
		typeOptions = []
	} = React.useMemo(
		() => {
			const options = props.data.races.edges.reduce(
				(a, { node }) => {
					if (!a.config.hasOwnProperty(node.trackConfigId))
						a.config[node.trackConfigId] = {
							value: node.trackConfigId, 
							label: node.trackConfigName 
								? `${node.trackName} – ${node.trackConfigName}`
								: node.trackName
						}
					if (!a.type.hasOwnProperty(node.trackType))
						a.type[node.trackType] = {
							value: node.trackType, 
							label: node.trackType 
						}
					node.participants.forEach(p => {
						if (!a.driver.hasOwnProperty(p.driverId))
							if (props.data.activeDrivers.edges.some(
								({ node }) => node.driverId === p.driverId
							))
								a.driver[p.driverId] = {
									value: p.driverId,
									label: p.driverName,
									sort: p.driverName.split(' ').pop()
								}
					})
					return a
				},
				{ driver: {}, config: {}, type: {} }
			)
			return {
				driverOptions: Object.values(options.driver).sort(sortAlpha),
				trackOptions: Object.values(options.config).sort(sortAlpha),
				typeOptions: Object.values(options.type)//.sort(sortAlpha),
			}
		},
		[props.data.races.edges]
	)
	const carOptions = React.useMemo(
		() => {
			const options = props.data.cars.edges.reduce((a, { node }) => {
				node.seasonClass.forEach(c => {
					if (!a.hasOwnProperty(c.seasonClassName))
						a[c.seasonClassName] = c.seasonClassCars.map(({ carId }) => carId)
				})
				return a
			}, {})
			return Object.entries(options).map(
				([label, value]) => ({ value, label })
			).sort(sortAlpha)
		},
		[props.data.cars.edges]
	)
	const columns = React.useMemo(
		() => [
			{
				Header: '',
				accessor: 'driverName',
				className: 'cell-driver',
				Cell: ({ row }) => (
					<DriverChip { ...row.leafRows[0].original.member } />
				)	
			},
			{
				Header: 'S',
				id: 'starts',
				sortDescFirst: true,
				accessor: 'raceId',
				aggregate: 'count',
				Aggregated: ({ value, groupedRows }) => {
					return value === Math.max(...groupedRows.map(({ values }) => values.starts))
						? <b>{ value }</b>
						: value
				}
			},
			{
				Header: 'AS',
				accessor: 'qualifyPos',
				aggregate: (leafValues) => {
					const attempts = leafValues.filter(v => v)
					const total = attempts.reduce((a, v) => a + v, 0)
					return attempts.length > 0 
						? total/attempts.length
						: null
				},
				aggregateValue: (value, row) => row.original.qualifyTime > 0 
					? value 
					: null,
				Aggregated: ({ value, groupedRows }) => {
					return value === Math.min(...groupedRows.reduce(
						(a, { values }) => values.qualifyPos 
							? [...a, values.qualifyPos] 
							: a,
						[]
					))
						? <b>{ value.toFixed(1) }</b>
						: value?.toFixed(1) ?? '-'
				}
			},
			{
				Header: 'AF',
				accessor: 'finishPos',
				aggregate: 'average',
				Aggregated: ({ value, groupedRows }) => {
					return value === Math.min(...groupedRows.reduce(
						(a, { values }) => values.finishPos 
							? [...a, values.finishPos] 
							: a,
						[]
					))
						? <b>{ value.toFixed(1) }</b>
						: value?.toFixed(1) ?? '-'
				}
			},
			{
				Header: 'ARP',
				accessor: 'arp',
				aggregate: 'average',
				Aggregated: ({ value, groupedRows }) => {
					return value === Math.min(...groupedRows.reduce(
						(a, { values }) => values.arp 
							? [...a, values.arp] 
							: a,
						[]
					))
						? <b>{ value.toFixed(1) }</b>
						: value?.toFixed(1) ?? '-'
				}
			},
			{
				Header: 'GP',
				accessor: 'passes',
				sortDescFirst: true,
				aggregate: 'sum',
				Aggregated: ({ value, groupedRows }) => {
					return value === Math.max(...groupedRows.reduce(
						(a, { values }) => values.passes 
							? [...a, values.passes] 
							: a,
						[]
					))
						? <b>{ value }</b>
						: value ?? '-'
				}
			},
			{
				Header: 'QP',
				accessor: 'qualityPasses',
				sortDescFirst: true,
				aggregate: 'sum',
				Aggregated: ({ value, groupedRows }) => {
					return value === Math.max(...groupedRows.reduce(
						(a, { values }) => values.qualityPasses 
							? [...a, values.qualityPasses] 
							: a,
						[]
					))
						? <b>{ value }</b>
						: value ?? '-'
				}
			},
			{
				Header: '#FL',
				accessor: 'numFastLap',
				sortDescFirst: true,
				aggregate: 'sum',
				Aggregated: ({ value, groupedRows }) => {
					return value === Math.max(...groupedRows.reduce(
						(a, { values }) => values.numFastLap 
							? [...a, values.numFastLap] 
							: a,
						[]
					))
						? <b>{ value }</b>
						: value ?? '-'
				}
			},
			{
				Header: 'W',
				accessor: 'wins',
				sortDescFirst: true,
				aggregate: (leafRows) => leafRows.reduce((a, v) => a + v, 0),
				aggregateValue: (value, row) => row.original.finishPos === 1 ? 1 : 0,
				Aggregated: ({ value, groupedRows }) => {
					return value === Math.max(...groupedRows.reduce(
						(a, { values }) => values.wins 
							? [...a, values.wins] 
							: a,
						[]
					))
						? <b>{ value }</b>
						: value ?? '-'
				}
			},
			{
				Header: '%W',
				accessor: 'winPct',
				sortDescFirst: true,
				aggregate: (leafRows) => Math.round(leafRows.reduce((a, v) => a + v, 0) / leafRows.length * 1000) / 10,
				aggregateValue: (value, row) => row.original.finishPos === 1 ? 1 : 0,
				Aggregated: ({ value, groupedRows }) => {
					return value === Math.max(...groupedRows.reduce(
						(a, { values }) => values.winPct 
							? [...a, values.winPct] 
							: a,
						[]
					))
						? <b>{ value.toFixed(1) }</b>
						: value?.toFixed(1) ?? '-'
				}
			},
			{
				Header: 'T5',
				accessor: 'top5s',
				sortDescFirst: true,
				aggregate: (leafRows) => leafRows.reduce((a, v) => a + v, 0),
				aggregateValue: (value, row) => row.original.finishPos <= 5 ? 1 : 0,
				Aggregated: ({ value, groupedRows }) => {
					return value === Math.max(...groupedRows.reduce(
						(a, { values }) => values.top5s 
							? [...a, values.top5s] 
							: a,
						[]
					))
						? <b>{ value }</b>
						: value ?? '-'
				}
			},
			{
				Header: '%T5',
				accessor: 'top5Pct',
				sortDescFirst: true,
				aggregate: (leafRows) => Math.round(leafRows.reduce((a, v) => a + v, 0) / leafRows.length * 1000) / 10,
				aggregateValue: (value, row) => row.original.finishPos <= 5 ? 1 : 0,
				Aggregated: ({ value, groupedRows }) => {
					return value === Math.max(...groupedRows.reduce(
						(a, { values }) => values.top5Pct 
							? [...a, values.top5Pct] 
							: a,
						[]
					))
						? <b>{ value.toFixed(1) }</b>
						: value?.toFixed(1) ?? '-'
				}
			},
			{
				Header: 'T10',
				accessor: 'top10s',
				sortDescFirst: true,
				aggregate: (leafRows) => leafRows.reduce((a, v) => a + v, 0),
				aggregateValue: (value, row) => row.original.finishPos <= 10 ? 1 : 0,
				Aggregated: ({ value, groupedRows }) => {
					return value === Math.max(...groupedRows.reduce(
						(a, { values }) => values.top10s 
							? [...a, values.top10s] 
							: a,
						[]
					))
						? <b>{ value }</b>
						: value ?? '-'
				}
			},
			{
				Header: '%T10',
				accessor: 'top10Pct',
				sortDescFirst: true,
				aggregate: (leafRows) => Math.round(leafRows.reduce((a, v) => a + v, 0) / leafRows.length * 1000) / 10,
				aggregateValue: (value, row) => row.original.finishPos <= 10 ? 1 : 0,
				Aggregated: ({ value, groupedRows }) => {
					return value === Math.max(...groupedRows.reduce(
						(a, { values }) => values.top10Pct 
							? [...a, values.top10Pct] 
							: a,
						[]
					))
						? <b>{ value.toFixed(1) }</b>
						: value?.toFixed(1) ?? '-'
				}
			},
			{
				Header: 'P',
				accessor: 'poles',
				sortDescFirst: true,
				aggregate: (leafRows) => leafRows.reduce((a, v) => a + v, 0),
				aggregateValue: (value, row) => row.original.qualifyPos === 1 ? 1 : 0,
				Aggregated: ({ value, groupedRows }) => {
					return value === Math.max(...groupedRows.reduce(
						(a, { values }) => values.poles 
							? [...a, values.poles] 
							: a,
						[]
					))
						? <b>{ value }</b>
						: value ?? '-'
				}
			},
			{
				Header: `%P`,
				accessor: 'polePct',
				sortDescFirst: true,
				aggregate: (leafRows) => Math.round(leafRows.reduce((a, v) => a + v, 0) / leafRows.length * 1000) / 10,
				aggregateValue: (value, row) => row.original.qualifyPos === 1 ? 1 : 0,
				Aggregated: ({ value, groupedRows }) => {
					return value === Math.max(...groupedRows.reduce(
						(a, { values }) => values.polePct 
							? [...a, values.polePct] 
							: a,
						[]
					))
						? <b>{ value.toFixed(1) }</b>
						: value?.toFixed(1) ?? '-'
				}

			},
			{
				Header: 'LL',
				accessor: 'lapsLed',
				aggregate: 'sum',
				sortDescFirst: true,
				Aggregated: ({ value, groupedRows }) => {
					return value === Math.max(...groupedRows.reduce(
						(a, { values }) => values.lapsLed 
							? [...a, values.lapsLed] 
							: a,
						[]
					))
						? <b>{ value }</b>
						: value ?? '-'
				}
			},
			{
				Header: '%LL',
				accessor: 'lapsLedPct',
				sortDescFirst: true,
				aggregate: (leafRows) => leafRows.reduce((a, v) => a + v, 0),
				aggregateValue: (value, row) => row.original.lapsLed,
				Aggregated: ({ value, row, groupedRows }) => {
					value = Math.round(value / row.values.lapsCompleted * 1000) / 10
					return value === Math.max(...groupedRows.reduce(
						(a, { values }) => values.lapsLed 
							? [...a, Math.round(values.lapsLed / values.lapsCompleted * 1000) / 10] 
							: a,
						[]
					))
						? <b>{ value.toFixed(1) }</b>
						: value?.toFixed(1) ?? '-'
				}
			},
			{
				Header: 'TL',
				accessor: 'lapsCompleted',
				sortDescFirst: true,
				aggregate: 'sum',
				Aggregated: ({ value, groupedRows }) => {
					return value === Math.max(...groupedRows.reduce(
						(a, { values }) => values.lapsCompleted 
							? [...a, values.lapsCompleted] 
							: a,
						[]
					))
						? <b>{ value }</b>
						: value ?? '-'
				}
			},
			{
				Header: 'DR',
				accessor: 'rating',
				sortDescFirst: true,
				aggregate: 'average',
				Aggregated: ({ value, groupedRows }) => {
					return value === Math.max(...groupedRows.reduce(
						(a, { values }) => values.rating 
							? [...a, values.rating] 
							: a,
						[]
					))
						? <b>{ value.toFixed(1) }</b>
						: value?.toFixed(1) ?? '-'
				}
			},
		],
		[]
	)
	
	return (
		<Layout {...props}>
			<Meta {...props}/>
			
			<main className="container">
				
				<div className="columns">   
					<div className="column col-8 col-xl-10 col-lg-12 col-mx-auto content">
					
						<hgroup className="page-header">
							<h2 className="page-title">Stats</h2>
						</hgroup>
						
						<div class="columns">
							<div className="column col-6 col-lg-12">
								<Select 
									className={styles.selectContainer}
									isMulti={true}
									onChange={selected => setDriverId(
										selected.map(({ value }) => value)
									)}
									options={driverOptions} 
									placeholder="Compare drivers..."
								/>
								<Select 
									className={styles.selectContainer}
									isMulti={true}
									onChange={selected => setCarId(
										selected.flatMap(({ value }) => value)
									)}
									options={carOptions} 
									placeholder="Filter by car..."
								/>
							</div>
							<div className="column col-6 col-lg-12">
								<Select 
									className={styles.selectContainer}
									isMulti={true}
									onChange={selected => setTrackConfigId(
										selected.map(({ value }) => value)
									)}
									options={trackOptions} 
									placeholder="Filter by track..."
								/>
								<Select 
									className={styles.selectContainer}
									isMulti={true}
									onChange={selected => setTrackType(
										selected.map(({ value }) => value)
									)}
									options={typeOptions} 
									placeholder="Filter by track type..."
								/>
							</div>
						</div>

						<Table 
							columns={columns} 
							data={data}
							scrolling={true}
							initialState={{
								groupBy: ['driverName'],
								sortBy: [{ id: 'starts', desc: true }],
							}}
						/>							

					</div>
				</div>
	
			</main>
		</Layout>
	)
}

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
		state: { groupBy },
	} = useTable(
		{
			columns,
			data,
			initialState,
			disableSortBy
		},
		useGroupBy,
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
		<div className={`table-container ${styles.table}`}>
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
													{ cell.isAggregated 
															? cell.render('Aggregated')
															: cell.render('Cell') 
													}
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

export const query = graphql`
	query StatsQuery($seriesId: Int) {
		activeDrivers: allSimRacerHubDriver(
			filter: {active: {eq: true}}
		) {
			edges {
				node {
					driverId
				}
			}
		}
		cars: allSimRacerHubSeason(
			filter: {seriesId: {eq: $seriesId}}
		) {
			edges {
				node {
					active
					seasonClass {
						seasonClassName
						seasonClassCars {
							carId
						}
					}
				}
			}
		}
		races: allSimRacerHubRace(
			filter: {seriesId: {eq: $seriesId}}
		) {
			edges {
				node {	
					...raceData	
				}
			}
		}	
	}
`

export default StatsTemplate
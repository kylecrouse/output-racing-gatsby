import * as React from "react"
import { graphql } from 'gatsby'
import Select from 'react-select'
import { renderDriverChip } from '../components/driverChip'
import Layout from '../components/layout'
import Table from '../components/table'
import * as styles from './stats.module.scss'

const TYPE_ORDER = ['Overall', 'Short Track', '1 mile', 'Intermediate', '2+ mile', 'Superspeedway', 'Road Course', 'Dirt Oval', 'Rallycross']

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
	const data = React.useMemo(
		() => props.data.participants.nodes.filter(
			(p) => p.driver.member !== null
							&& p.race.schedule.season.series.seriesId === props.pageContext.seriesId
							&& p.finishPos > 0 
							&& p.provisional === 'N' 
							&& p.race.schedule.pointsCount === 'Y'
							&& p.race.schedule.chase === 'N'
		),
		[props.data, props.pageContext.seriesId]
	)

	const [carName, setCarName] = React.useState([])
	const [driverName, setDriverName] = React.useState([])
	const [trackName, setTrackName] = React.useState([])
	const [trackType, setTrackType] = React.useState([])
	const [columnFilters, setColumnFilters] = React.useState([])
	
	const { driverOptions, trackOptions, typeOptions } = React.useMemo(
		() => {
			const options = data.reduce(
				(acc, p) => {
					if (p.race.schedule.trackConfig) {
						const name = p.race.schedule.trackConfig.trackName.replace(/(\[Legacy\]\s)|( - 200[89])/g, '')
						const type = getTrackTypeName(p.race.schedule.trackConfig)
						if (!acc.trackOptions.hasOwnProperty(name))
							acc.trackOptions[name] = { value: name, label: name }
						if (!acc.typeOptions.hasOwnProperty(type))
							acc.typeOptions[type] = { value: type, label: type }
					}
					acc.driverOptions[p.driver.driverName] = { 
						value: p.driver.driverName, 
						label: p.driver.member?.driverNickName ?? p.driver.driverName
					}
					return acc
				},
				{ carOptions: [], driverOptions: [], trackOptions: [], typeOptions: [] }
			)
			return {
				driverOptions: Object.values(options.driverOptions).sort(sortAlpha),
				trackOptions: Object.values(options.trackOptions).sort(sortAlpha),
				typeOptions: Object.values(options.typeOptions).sort(
					(a, b) => TYPE_ORDER.indexOf(a.value) - TYPE_ORDER.indexOf(b.value)
				),
			}
		},
		[data]
	)

	const carOptions = React.useMemo(
		() => {
			const options = props.data.classes.nodes.reduce(
				(acc, node) => !acc.hasOwnProperty(node.seasonClassName)
					? { ...acc, [node.seasonClassName]: {
							value: node.seasonClassName,
							label: node.seasonClassName,
							cars: node.seasonClassCars.map(({ carName }) => carName)
						}}
					: acc,
				{}
			)
			return Object.values(options).sort(sortAlpha)
		},
		[props.data.classes]
	)
	
	React.useEffect(() => {
		setColumnFilters([
			{ id: 'carName', value: carName.reduce(
				(acc,value) => [...acc, ...(carOptions.find((option) => option.value === value)?.cars ?? [])], 
				[]
			)},
			{ id: 'trackName', value: trackName },
			{ id: 'trackType', value: trackType },
			{ id: 'driverName', value: driverName }
		])
	}, [carOptions, carName, driverName, trackName, trackType])
	
	const columns = React.useMemo(
		() => [
			{
				header: 'Driver',
				id: 'driverName',
				accessorFn: (row) => row.driver.driverName,
				className: 'cell-driver',
				cell: ({ row }) => renderDriverChip(row.original),
				filterFn: 'arrIncludesSome',
			},
			{
				header: 'Car',
				id: 'carName',
				accessorFn: (row) => row.car?.carName,
				className: 'text-left',
				filterFn: 'arrIncludesSome',
			},
			{
				header: 'Track',
				id: 'trackName',
				accessorFn: (row) => row.race.schedule.trackConfig.trackName.replace(/(\[Legacy\]\s)|( - 200[89])/g, ''),
				className: 'text-left',
				filterFn: 'arrIncludesSome',
			},
			{
				header: 'Type',
				id: 'trackType',
				accessorFn: (row) => getTrackTypeName(row.race.schedule.trackConfig),
				className: 'text-left',
				filterFn: 'arrIncludesSome',
			},
			{
				header: 'S',
				id: 'starts',
				accessorKey: 'startPos',
				sortDescFirst: true,
				aggregationFn: 'count',
				aggregatedCell: renderAggregatedIntValue,
			},
			{
				header: 'AS',
				id: 'avgStart',
				sortDescFirst: false,
				accessorFn: (row) => row.qualifyTime > 0 ? row.startPos : null,
				aggregationFn: (key, rows) => {
					const { sum, count } = rows.reduce(
						(acc, { original: row }) => row.qualifyTime > 0 
							? { 
									sum: acc.sum + row.startPos, 
									count: acc.count + 1 
								} 
							: acc,
						{ sum: 0, count: 0 }
					)
					return sum / count
				},
				aggregatedCell: renderAggregatedFloatValue,
			},
			{
				header: 'AF',
				id: 'avgFinish',
				sortDescFirst: false,
				accessorKey: 'finishPos',
				aggregationFn: (key, rows) => {
					const { sum, count } = rows.reduce(
						(acc, { original: row }) => ({ 
							sum: acc.sum + row.finishPos, 
							count: acc.count + 1 
						}),
						{ sum: 0, count: 0 }
					)
					return sum / count
				},
				aggregatedCell: renderAggregatedFloatValue,
			},
			{
				header: 'W',
				id: 'wins',
				accessorFn: (row) => row.finishPos === 1 ? 1 : 0,
				sortDescFirst: true,
				aggregationFn: 'sum',
				aggregatedCell: renderAggregatedIntValue,
			},
			{
				header: 'W%',
				id: 'pctW',
				sortDescFirst: true,
				accessorFn: (row) => row.finishPos === 1 ? 1 : 0,
				aggregationFn: (key, rows) => {
					const { sum, count } = rows.reduce(
						(acc, { original: row }) => ({ 
							sum: acc.sum + (row.finishPos === 1 ? 1 : 0), 
							count: acc.count + 1
						}),
						{ sum: 0, count: 0 }
					)
					return sum / count
				},
				aggregatedCell: renderAggregatedPercentValue,
			},
			{
				header: 'T5',
				id: 't5s',
				accessorFn: (row) => row.finishPos <= 5 ? 1 : 0,
				sortDescFirst: true,
				aggregationFn: 'sum',
				aggregatedCell: renderAggregatedIntValue,
			},
			{
				header: 'T5%',
				id: 'pctT5',
				sortDescFirst: true,
				accessorFn: (row) => row.finishPos <= 5 ? 1 : 0,
				aggregationFn: (key, rows) => {
					const { sum, count } = rows.reduce(
						(acc, { original: row }) => ({ 
							sum: acc.sum + (row.finishPos <= 5 ? 1 : 0), 
							count: acc.count + 1
						}),
						{ sum: 0, count: 0 }
					)
					return sum / count
				},
				aggregatedCell: renderAggregatedPercentValue,
			},
			{
				header: 'T10',
				id: 't10s',
				sortDescFirst: true,
				accessorFn: (row) => row.finishPos <= 10 ? 1 : 0,
				aggregationFn: 'sum',
				aggregatedCell: renderAggregatedIntValue,
			},
			{
				header: 'T10%',
				id: 'pctT10',
				sortDescFirst: true,
				accessorFn: (row) => row.finishPos <= 10 ? 1 : 0,
				aggregationFn: (key, rows) => {
					const { sum, count } = rows.reduce(
						(acc, { original: row }) => ({ 
							sum: acc.sum + (row.finishPos <= 10 ? 1 : 0), 
							count: acc.count + 1
						}),
						{ sum: 0, count: 0 }
					)
					return sum / count
				},
				aggregatedCell: renderAggregatedPercentValue,
			},
			{
				header: 'P',
				id: 'poles',
				sortDescFirst: true,
				accessorFn: (row) => row.startPos === 1 ? 1 : 0,
				aggregationFn: 'sum',
				aggregatedCell: renderAggregatedIntValue,
			},
			{
				header: `P%`,
				id: 'pctPole',
				sortDescFirst: true,
				accessorFn: (row) => row.startPos === 1 ? 1 : 0,
				aggregationFn: (key, rows) => {
					const { sum, count } = rows.reduce(
						(acc, { original: row }) => ({ 
							sum: acc.sum + (row.startPos === 1 ? 1 : 0), 
							count: acc.count + 1
						}),
						{ sum: 0, count: 0 }
					)
					return sum / count
				},
				aggregatedCell: renderAggregatedPercentValue,
			},		
			{
				header: 'ARP',
				id: 'avgPos',
				sortDescFirst: false,
				accessorFn: (row) => row.loopstat?.avgPos,
				aggregationFn: (key, rows) => {
					const { sum, count } = rows.reduce(
						(acc, { original: row }) => row.loopstat?.avgPos > 0
							? { 
									sum: acc.sum + row.loopstat.avgPos, 
									count: acc.count + 1 
								} 
							: acc,
						{ sum: 0, count: 0 }
					)
					return sum / count
				},
				aggregatedCell: renderAggregatedFloatValue,
			},	
			{
				header: 'GP',
				id: 'passes',
				sortDescFirst: true,
				accessorFn: (row) => row.loopstat?.passes,
				aggregationFn: 'sum',
				aggregatedCell: renderAggregatedIntValue,
			},
			{
				header: 'QP',
				id: 'qualityPasses',
				sortDescFirst: true,
				accessorFn: (row) => row.loopstat?.qualityPasses,
				aggregationFn: 'sum',
				aggregatedCell: renderAggregatedIntValue,
			},
			{
				header: 'CP',
				id: 'closingPasses',
				sortDescFirst: true,
				accessorFn: (row) => row.loopstat?.closingPasses,
				aggregationFn: 'sum',
				aggregatedCell: renderAggregatedIntValue,
			},
			{
				header: 'TL',
				id: 'laps',
				sortDescFirst: true,
				accessorKey: 'lapsCompleted',
				aggregationFn: 'sum',
				aggregatedCell: renderAggregatedIntValue,
			},
			{
				header: 'LL',
				id: 'lapsLed',
				sortDescFirst: true,
				accessorKey: 'lapsLed',
				aggregationFn: 'sum',
				aggregatedCell: renderAggregatedIntValue,
			},
			{
				header: 'LL%',
				id: 'pctLed',
				sortDescFirst: true,
				accessorFn: (row) => row.lapsLed / row.lapsCompleted,
				aggregationFn: (key, rows) => {
					const { laps, led } = rows.reduce(
						(acc, { original: row }) => ({
							laps: acc.laps + row.lapsCompleted,
							led: acc.led + row.lapsLed
						}),
						{ laps: 0, led: 0 }
					)
					return led / laps
				},
				aggregatedCell: renderAggregatedPercentValue,
			},
			{
				header: 'FL',
				id: 'numFastLap',
				sortDescFirst: true,
				accessorFn: (row) => row.loopstat?.numFastLap,
				aggregationFn: 'sum',
				aggregatedCell: renderAggregatedIntValue,
			},
			{
				header: 'I',
				id: 'incidents',
				sortDescFirst: false,
				accessorKey: 'incidents',
				aggregationFn: 'sum',
				aggregatedCell: renderAggregatedIntValue,
			},
			{
				header: 'IR',
				id: 'incRace',
				sortDescFirst: false,
				accessorFn: (row) => row.incidents,
				aggregationFn: (key, rows) => {
					const { sum, count } = rows.reduce(
						(acc, { original: row }) => ({ 
							sum: acc.sum + row.incidents, 
							count: acc.count + 1 
						}),
						{ sum: 0, count: 0 }
					)
					return sum / count
				},
				aggregatedCell: (props) => renderAggregatedFloatValue(props, 2),
			},
			{
				header: 'IL',
				id: 'incLap',
				sortDescFirst: false,
				accessorFn: (row) => row.incidents,
				aggregationFn: (key, rows) => {
					const { sum, count } = rows.reduce(
						(acc, { original: row }) => ({ 
							sum: acc.sum + row.incidents, 
							count: acc.count + row.lapsCompleted
						}),
						{ sum: 0, count: 0 }
					)
					return sum / count
				},
				aggregatedCell: (props) => renderAggregatedFloatValue(props, 2),
			},
			{
				header: 'DR',
				id: 'avgRating',
				sortDescFirst: true,
				accessorFn: (row) => row.loopstat?.rating,
				aggregationFn: (key, rows) => {
					const { sum, count } = rows.reduce(
						(acc, { original: row }) => row.loopstat?.rating > 0
							? { 
									sum: acc.sum + row.loopstat.rating, 
									count: acc.count + 1 
								} 
							: acc,
						{ sum: 0, count: 0 }
					)
					return sum / count
				},
				aggregatedCell: renderAggregatedFloatValue,
			},
		],
		[]
	)
	
	return (
		<Layout {...props}>
			
			<main className="container">
				
				<div className="columns">   
					<div className="column col-8 col-xl-10 col-lg-12 col-mx-auto content">
					
						<hgroup className="page-header">
							<h2 className="page-title">Stats</h2>
						</hgroup>
						
						<div className="columns">
							<div className="column col-6 col-lg-12">
								<Select 
									className={styles.selectContainer}
									isMulti={true}
									onChange={selected => setDriverName(
										selected.map(({ value }) => value)
									)}
									options={driverOptions} 
									placeholder="Compare drivers..."
								/>
								<Select 
									className={styles.selectContainer}
									isMulti={true}
									onChange={selected => setCarName(
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
									onChange={selected => setTrackName(
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
							filters={columnFilters}
							scrolling={true}
							initialState={{
								grouping: ['driverName'],
								sorting: [{ id: 'starts', desc: true }],
								columnVisibility: { carName: false, trackName: false, trackType: false }
							}}
						/>
					
						<div className={ styles.glossary }>
							<h3>Glossary</h3>
							<dl>
								<dt>S</dt>
								<dd>Starts</dd>
								<dt>AS</dt>
								<dd>
									Average Starting Position<br/>
									<i>Only starts with valid qualifying attempts</i>
								</dd>
								<dt>AF</dt>
								<dd>
									Average Finishing Position
								</dd>
								<dt>W</dt>
								<dd>
									Wins
								</dd>
								<dt>W%</dt>
								<dd>
									Winning Percentage
								</dd>
								<dt>T5</dt>
								<dd>
									Top 5s
								</dd>
								<dt>T5%</dt>
								<dd>
									Top 5 Percentage
								</dd>
								<dt>T10</dt>
								<dd>
									Top 10s
								</dd>
								<dt>T10%</dt>
								<dd>
									Top 10 Percentage
								</dd>
								<dt>P</dt>
								<dd>
									Poles
								</dd>
								<dt>P%</dt>
								<dd>
									Poles Percentage
								</dd>
								<dt>ARP</dt>
								<dd>
									Average Running Position<br/>
									<i>Only green flag laps while on the lead lap</i>
								</dd>
								<dt>GP</dt>
								<dd>
									Green Flag Passes
								</dd>
								<dt>QP</dt>
								<dd>
									Quality Passes<br/>
									<i>Green flag passes within top seven</i>
								</dd>
								<dt>CP</dt>
								<dd>
									Closing Passes<br/>
									<i>Green flag passes within last 10% of race</i>
								</dd>
								<dt>TL</dt>
								<dd>
									Total Laps Completed
								</dd>
								<dt>LL</dt>
								<dd>
									Laps Led
								</dd>
								<dt>LL%</dt>
								<dd>
									Laps Led Percentage
								</dd>
								<dt>FL</dt>
								<dd>
									Number of Fast Laps<br/>
									<i>Fastest time recorded each race lap</i>
								</dd>
								<dt>I</dt>
								<dd>
									Incidents
								</dd>
								<dt>IR</dt>
								<dd>
									Average Incidents per Race
								</dd>
								<dt>IL</dt>
								<dd>
									Average Incidents per Lap
								</dd>
								<dt>DR</dt>
								<dd>
									Driver Rating<br/>
									<i>Formula combining the following categories: Win, Finish, Top-15 Finish, Average Running Position While on Lead Lap, Average Speed Under Green, Fastest Lap, Led Most Laps, Lead-Lap Finish. Maximum: 150 points per race</i>
								</dd>
							</dl>
						</div>
		
					</div>
				</div>
	
			</main>
		</Layout>
	)
}

function getTrackTypeName(trackConfig) {
	if (!trackConfig) 
		return null
	else if (trackConfig.trackType.toLowerCase() !== 'speedway') 
		return trackConfig.trackType
	else
		return trackConfig.trackLength < 2
			? trackConfig.trackLength > 1
				? 'Intermediate'
				: '1 mile'
			: '2+ mile'
}

function renderAggregatedFloatValue({ getValue, table, column }, power = 1) {
	const places = Math.pow(10, Number.isInteger(power) ? power : 1)
	const value = getValue()
	const values = table.getGroupedRowModel().rows.reduce(
		(acc, { getValue }) => { 
			const value = getValue(column.id) 
			return value > 0 ? [...acc, value] : acc
		}, 
		[]
	)
	return value > 0 
		? value === Math[column.columnDef.sortDescFirst ? 'max' : 'min'](...values)
			? <b>{Math.floor(value * places) / places}</b>
			: Math.floor(value * places) / places
		: '-'
}

function renderAggregatedIntValue({ getValue, table, column }) {
	const value = getValue()
	const values = table.getGroupedRowModel().rows.reduce(
		(acc, { getValue }) => { 
			const value = getValue(column.id) 
			return value > 0 ? [...acc, value] : acc
		}, 
		[]
	)
	return value > 0 
		? value === Math[column.columnDef.sortDescFirst ? 'max' : 'min'](...values)
			? <b>{value}</b>
			: value
		: '-'
}

function renderAggregatedPercentValue({ getValue, table, column }) {
	const value = getValue()
	const values = table.getGroupedRowModel().rows.reduce(
		(acc, { getValue }) => { 
			const value = getValue(column.id) 
			return value > 0 ? [...acc, value] : acc
		}, 
		[]
	)
	return value > 0 
		? value === Math[column.columnDef.sortDescFirst ? 'max' : 'min'](...values)
			? <b>{`${Math.floor(getValue() * 100)}%`}</b>
			: `${Math.floor(getValue() * 100)}%`
		: '-'
}

export const query = graphql`
	query StatsQuery($seriesId: Int) {
		classes: allMysqlSeasonClass(filter: {season: {series_id: {eq: $seriesId}}}) {
			nodes {
				seasonClassName: season_class_name
				seasonClassCars {
					carId: car_id
					carName: car_name
				}
			}
		}
		participants: allMysqlParticipant {
			nodes {
				driverId: driver_id
				driver {
					driverName: driver_name
					member {
						driverNickName: nick_name
						carNumber: car_number
						carNumberArt: driverNumberArt {
							gatsbyImageData	
							file {
								url
							}
						}						
					}
				}
				driverNumber: driver_number
				startPos: qualify_pos
				finishPos: finish_pos	
				incidents
				lapsLed: laps_led
				lapsCompleted: num_laps
				qualifyTime: qualify_time
				car {
					carId: car_iracing_id
					carName: car_name
				}
				loopstat {
					avgPos: avg_pos
					arp
					avgFastLap: avg_fast_lap
					numFastLap: num_fast_lap
					fastestRestart: fastest_restart
					passes
					qualityPasses: quality_passes
					closingPasses: closing_passes
					rating
				}
				provisional
				race {
					schedule {
						pointsCount: points_count
						chase
						trackConfig {
							trackId: track_config_iracing_id
							trackName: track_name
							trackConfigName: track_config_name
							trackTypeId: track_type_id
							trackType: type_name
							trackLength: track_length
						}
						season {
							series {
								seriesId: series_id
							}
						}
					}
				}
			}
		}
	}
`

export default StatsTemplate
import * as React from "react"
import { graphql } from 'gatsby'
import moment from 'moment'
import Select from 'react-select'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import { Carousel, Slide } from '../components/carousel'
import DriverChip from '../components/driverChip'
import Layout from '../components/layout'
import License from '../components/license'
import Meta from '../components/meta'
import Table from '../components/table'
import * as styles from './driver.module.scss'

const TYPE_ORDER = ['Overall', 'Short Track', '1 mile', 'Intermediate', '2+ mile', 'Superspeedway', 'Road Course', 'Dirt Oval', 'Rallycross']

const DriverTemplate = props => {
	const { driver } = props.data
	const data = React.useMemo(
		() => driver.participants.filter(
			(p) => p.finishPos > 0 
							&& p.provisional === 'N' 
							&& p.race.schedule.pointsCount === 'Y'
							&& p.race.schedule.chase === 'N' 
							&& p.race.schedule.season.series.seriesId === props.pageContext.seriesId
		),
		[driver.participants, props.pageContext.seriesId]
	)
	
	const [carId, setCarId] = React.useState([])
	const [seasonId, setSeasonId] = React.useState([])
	const [trackName, setTrackName] = React.useState([])
	const [trackType, setTrackType] = React.useState([])
	const [columnFilters, setColumnFilters] = React.useState([])
	
	React.useEffect(() => {
		setColumnFilters([
			{ id: 'make', value: carId },
			{ id: 'trackName', value: trackName },
			{ id: 'trackType', value: trackType },
			{ id: 'seasonName', value: seasonId }
		])
	}, [carId, seasonId, trackName, trackType])
	
	const { carOptions, seasonOptions, trackOptions, typeOptions } = React.useMemo(
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
					if (p.car)
						acc.carOptions[p.car.carName] = { value: p.car.carName, label: p.car.carName }
					if (p.race.schedule.season)
						acc.seasonOptions[p.race.schedule.season.seasonName] = { 
							value: p.race.schedule.season.seasonName, 
							label: p.race.schedule.season.seasonName
						}
					return acc
				},
				{ carOptions: [], seasonOptions: [], trackOptions: [], typeOptions: [] }
			)
			return {
				carOptions: Object.values(options.carOptions).sort(sortAlphaAsc),
				seasonOptions: Object.values(options.seasonOptions).sort(sortAlphaDesc),
				trackOptions: Object.values(options.trackOptions).sort(sortAlphaAsc),
				typeOptions: Object.values(options.typeOptions).sort(
					(a, b) => TYPE_ORDER.indexOf(a.value) - TYPE_ORDER.indexOf(b.value)
				),
			}
		},
		[data]
	)

	const trackColumns = React.useMemo(
		() => [
			{
				header: 'Track',
				id: 'trackName',
				accessorFn: (row) => 
					`${row.race.schedule.trackConfig.trackName.replace(/(\[Legacy\]\s)|( - 200[89])/g, '')}|${row.race.schedule.trackConfig.trackType}`,
				className: 'cell-trackName',
				cell: ({ getValue }) => getValue().replace(/\|.*$/, ''),
				groupingEnabled: true,
				sortingFn: 'trackNameSorting',
			},
			{
				header: 'Type',
				id: 'trackType',
				accessorFn: (row) => getTrackTypeName(row.race.schedule.trackConfig),
				className: 'cell-typeName',
				aggregationFn: 'unique',
				groupingEnabled: true,
				sortingFn: 'trackTypeSorting',
				footer: (props) => 'Overall',
			},
			{
				header: 'Starts',
				id: 'starts',
				accessorKey: 'startPos',
				aggregationFn: 'count',
				aggregatedCell: ({ getValue }) => getValue() > 0 ? getValue() : '-',
				footer: ({ table }) => {
					const { rows } = table.getRowModel()
					return rows.reduce((acc, row) => acc + row.getValue('starts'), 0)
				},
			},
			{
				header: 'Avg Start',
				id: 'avgStart',
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
				aggregatedCell: ({ getValue }) => getValue() > 0 ? Math.floor(getValue() * 10) / 10 : '-',
				footer: ({ table }) => {
					const { rows } = table.getPreGroupedRowModel()
					const { sum, count } = rows.reduce(
						(acc, { original: row }) => row.qualifyTime > 0 
							? { 
									sum: acc.sum + row.startPos, 
									count: acc.count + 1 
								} 
							: acc,
						{ sum: 0, count: 0 }
					)
					const value = sum / count
					return value > 0 ? Math.floor(value * 10) / 10 : '-'
				},
			},
			{
				header: 'Avg Finish',
				id: 'avgFinish',
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
				aggregatedCell: ({ getValue }) => getValue() > 0 ? Math.floor(getValue() * 10) / 10 : '-',
				footer: ({ table }) => {
					const { rows } = table.getPreGroupedRowModel()
					const { sum, count } = rows.reduce(
						(acc, { original: row }) => ({ 
							sum: acc.sum + row.finishPos, 
							count: acc.count + 1 
						}),
						{ sum: 0, count: 0 }
					)
					const value = sum / count
					return value > 0 ? Math.floor(value * 10) / 10 : '-'
				},
			},
			{
				header: 'Avg Rating',
				id: 'avgRating',
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
				aggregatedCell: ({ getValue }) => getValue() > 0 ? Math.floor(getValue() * 10) / 10 : '-',
				footer: ({ table }) => {
					const { rows } = table.getPreGroupedRowModel()
					const { sum, count } = rows.reduce(
						(acc, { original: row }) => row.loopstat?.rating > 0
						? { 
								sum: acc.sum + row.loopstat.rating, 
								count: acc.count + 1 
							} 
						: acc,
						{ sum: 0, count: 0 }
					)
					const value = sum / count
					return value > 0 ? Math.floor(value * 10) / 10 : '-'
				},
			},
			{
				header: 'Laps',
				accessorKey: 'lapsCompleted',
				aggregationFn: 'sum',
				aggregatedCell: ({ getValue }) => getValue() > 0 ? getValue() : '-',
				footer: ({ table }) => {
					const { rows } = table.getRowModel()
					return rows.reduce((acc, row) => acc + row.getValue('lapsCompleted'), 0)
				},
			},
			{
				header: 'Led',
				accessorKey: 'lapsLed',
				aggregationFn: 'sum',
				aggregatedCell: ({ getValue }) => getValue() > 0 ? getValue() : '-',
				footer: ({ table }) => {
					const { rows } = table.getRowModel()
					return rows.reduce((acc, row) => acc + row.getValue('lapsLed'), 0)
				},
			},
			{
				header: 'Led%',
				id: 'pctLed',
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
				aggregatedCell: ({ getValue }) => getValue() > 0 ? `${Math.floor(getValue() * 100)}%` : '-',
				footer: ({ table }) => {
					const { rows } = table.getPreGroupedRowModel()
					const { sum, count } = rows.reduce(
						(acc, { original: row }) => ({
							sum: acc.sum + row.lapsLed,
							count: acc.count + row.lapsCompleted
						}),
						{ sum: 0, count: 0 }
					)
					const value = sum / count
					return value > 0 ? `${Math.floor(value * 100)}%` : '-'
				},
			},
			{
				header: 'Inc',
				id: 'incidents',
				accessorKey: 'incidents',
				aggregationFn: 'sum',
				aggregatedCell: ({ getValue }) => getValue() > 0 ? getValue() : '-',
				footer: ({ table }) => {
					const { rows } = table.getRowModel()
					return rows.reduce((acc, row) => acc + row.getValue('incidents'), 0)
				},
			},
			{
				header: 'Inc/Race',
				id: 'incRace',
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
				aggregatedCell: ({ getValue }) => getValue() > 0 ? Math.floor(getValue() * 100) / 100 : '-',
				footer: ({ table }) => {
					const { rows } = table.getPreGroupedRowModel()
					const { sum, count } = rows.reduce(
						(acc, { original: row }) => ({ 
							sum: acc.sum + row.incidents, 
							count: acc.count + 1 
						}),
						{ sum: 0, count: 0 }
					)
					const value = sum / count
					return value > 0 ? Math.floor(value * 10) / 10 : '-'
				},
			},
			{
				header: 'Inc/Lap',
				id: 'incLap',
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
				aggregatedCell: ({ getValue }) => getValue() > 0 ? Math.floor(getValue() * 100) / 100 : '-',
				footer: ({ table }) => {
					const { rows } = table.getPreGroupedRowModel()
					const { sum, count } = rows.reduce(
						(acc, { original: row }) => ({ 
							sum: acc.sum + row.incidents, 
							count: acc.count + row.lapsCompleted
						}),
						{ sum: 0, count: 0 }
					)
					const value = sum / count
					return value > 0 ? Math.floor(value * 10) / 10 : '-'
				},
			},
			{
				header: 'Wins',
				id: 'wins',
				accessorFn: (row) => row.finishPos === 1 ? 1 : 0,
				aggregationFn: 'sum',
				aggregatedCell: ({ getValue }) => getValue() > 0 ? getValue() : '-',
				footer: ({ table }) => {
					const { rows } = table.getRowModel()
					return rows.reduce((acc, row) => acc + row.getValue('wins'), 0)
				},
			},
			{
				header: 'W%',
				id: 'pctW',
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
				aggregatedCell: ({ getValue }) => getValue() > 0 ? `${Math.floor(getValue() * 100)}%` : '-',
				footer: ({ table }) => {
					const { rows } = table.getPreGroupedRowModel()
					const { sum, count } = rows.reduce(
						(acc, { original: row }) => ({ 
							sum: acc.sum + (row.finishPos === 1 ? 1 : 0), 
							count: acc.count + 1
						}),
						{ sum: 0, count: 0 }
					)
					const value = sum / count
					return value > 0 ? `${Math.floor(value * 100)}%` : '-'
				},
			},
			{
				header: 'T5',
				id: 't5s',
				accessorFn: (row) => row.finishPos <= 5 ? 1 : 0,
				aggregationFn: 'sum',
				aggregatedCell: ({ getValue }) => getValue() > 0 ? getValue() : '-',
				footer: ({ table }) => {
					const { rows } = table.getRowModel()
					return rows.reduce((acc, row) => acc + row.getValue('t5s'), 0)
				},
			},
			{
				header: 'T5%',
				id: 'pctT5',
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
				aggregatedCell: ({ getValue }) => getValue() > 0 ? `${Math.floor(getValue() * 100)}%` : '-',
				footer: ({ table }) => {
					const { rows } = table.getPreGroupedRowModel()
					const { sum, count } = rows.reduce(
						(acc, { original: row }) => ({ 
							sum: acc.sum + (row.finishPos <= 5 ? 1 : 0), 
							count: acc.count + 1
						}),
						{ sum: 0, count: 0 }
					)
					const value = sum / count
					return value > 0 ? `${Math.floor(value * 100)}%` : '-'
				},
			},
			{
				header: 'T10',
				id: 't10s',
				accessorFn: (row) => row.finishPos <= 10 ? 1 : 0,
				aggregationFn: 'sum',
				aggregatedCell: ({ getValue }) => getValue() > 0 ? getValue() : '-',
				footer: ({ table }) => {
					const { rows } = table.getRowModel()
					return rows.reduce((acc, row) => acc + row.getValue('t10s'), 0)
				},
			},
			{
				header: 'T10%',
				id: 'pctT10',
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
				aggregatedCell: ({ getValue }) => getValue() > 0 ? `${Math.floor(getValue() * 100)}%` : '-',
				footer: ({ table }) => {
					const { rows } = table.getPreGroupedRowModel()
					const { sum, count } = rows.reduce(
						(acc, { original: row }) => ({ 
							sum: acc.sum + (row.finishPos <= 10 ? 1 : 0), 
							count: acc.count + 1
						}),
						{ sum: 0, count: 0 }
					)
					const value = sum / count
					return value > 0 ? `${Math.floor(value * 100)}%` : '-'
				},
			},
			{
				header: 'Poles',
				id: 'poles',
				accessorFn: (row) => row.startPos === 1 ? 1 : 0,
				aggregationFn: 'sum',
				aggregatedCell: ({ getValue }) => getValue() > 0 ? getValue() : '-',
				footer: ({ table }) => {
					const { rows } = table.getRowModel()
					return rows.reduce((acc, row) => acc + row.getValue('poles'), 0)
				},
			},
			{
				header: `Pole%`,
				id: 'pctPole',
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
				aggregatedCell: ({ getValue }) => getValue() > 0 ? `${Math.floor(getValue() * 100)}%` : '-',
				footer: ({ table }) => {
					const { rows } = table.getPreGroupedRowModel()
					const { sum, count } = rows.reduce(
						(acc, { original: row }) => ({ 
							sum: acc.sum + (row.startPos === 1 ? 1 : 0), 
							count: acc.count + 1
						}),
						{ sum: 0, count: 0 }
					)
					const value = sum / count
					return value > 0 ? `${Math.floor(value * 100)}%` : '-'
				},
			},
		],
		[]
	)
	
	const resultColumns = React.useMemo(
		() => [
			{
				header: 'Date',
				id: 'raceDate',
				accessorFn: (row) => row.race.schedule.raceDate,
				cell: ({ getValue }) => moment.parseZone(getValue()).format('DD MMM YYYY')
			},
			{
				header: 'Finish',
				accessorKey: 'finishPos',
				className: 'cell-finishPos',
				cell: ({ row, getValue }) => {
					const value = getValue()
					const change = row.original.startPos - value
					const className = change > 0
						? 'positive'
						: change < 0
							? 'negative'
							: 'neutral'
					return (
						<div>
							<b>{value}</b>
							<span className={className}>
								{Math.abs(change) || '\u00a0'}
							</span>
						</div>	
					)
				}
			},
			{
				header: 'Rating',
				accessorFn: (row) => row.loopstat?.rating,
				className: 'hide-sm',
				cell: ({ getValue }) => getValue()?.toFixed(1) ?? '-'
			},
			{
				header: 'Laps',
				accessorKey: 'lapsCompleted',
				className: 'hide-sm'
			},
			{
				header: 'Led',
				accessorKey: 'lapsLed',
				className: 'hide-sm',
				cell: ({ getValue }) => getValue() || '-'
			},
			{
				header: 'Average Position',
				accessorFn: (row) => row.loopstat?.avgPos,
				className: 'hide-sm',
				cell: ({ getValue }) => getValue()?.toFixed(1) ?? '-'
			},
			{
				header: 'Total Passes',
				accessorFn: (row) => row.loopstat?.passes,
				className: 'hide-sm',
				cell: ({ getValue }) => getValue() || '-'
			},
			{
				header: 'Quality Passes',
				accessorFn: (row) => row.loopstat?.qualityPasses,
				className: 'hide-sm',
				cell: ({ getValue }) => getValue() || '-'
			},
			{
				header: 'Closing Passes',
				accessorFn: (row) => row.loopstat?.closingPasses,
				className: 'hide-sm',
				cell: ({ getValue }) => getValue() || '-'
			},
			{
				header: 'Inc',
				accessorKey: 'incidents',
				className: 'hide-sm',
				cell: ({ getValue }) => getValue() || '-'
			},
			{
				header: 'Fast Laps',
				accessorFn: (row) => row.loopstat?.numFastLap,
				className: 'hide-sm',
				cell: ({ getValue }) => getValue() || '-'
			},
			{
				header: 'Fast Lap',
				accessorKey: 'fastestLapTime',
				className: 'hide-sm',
				cell: ({ getValue }) => getValue() || '-'
			},
			{
				header: 'Qual Lap',
				accessorKey: 'qualifyTime',
				className: 'hide-sm',
				cell: ({ getValue, table }) => getValue() > 0 ? getTimeFromMilliseconds(getValue() * 10000) : '-'
			},
			{
				header: 'Status',
				accessorKey: 'status',
				className: 'hide-sm',
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
				header: 'Car',
				id: 'make',
				accessorFn: (row) => row.car?.carName,
				className: 'text-left',
				filterFn: 'arrIncludesSome',
			},
			{
				header: 'Season',
				id: 'seasonName',
				className: 'text-left',
				accessorFn: (row) => row.race.schedule.season.seasonName,
				filterFn: 'arrIncludesSome',
			},
		],
		[]
	)
	
	const media = React.useMemo(() => {
		if (!driver.driverMedia) 
			return null
		const slides = driver.driverMedia.reduce(
			(a, m) => {
				if ((props.pageContext.seriesId !== 8100 && m.metadata.tags[0]?.name === 'Series: Night Owl Series') || (props.pageContext.seriesId === 8100 && m.metadata.tags[0]?.name !== 'Series: Night Owl Series'))
					return a
				else 
					return (
						[...a, (
							<Slide key={`slide-${m.id}`}>
								<GatsbyImage 
									alt="car screenshot"
									className={ styles.driverImage }
									image={ getImage(m) } 
								/>
							</Slide>	
						)]
					)
			},
			[]
		)
		return slides.length > 1 
			? (
					<Carousel options={{ type: "carousel", showNav: true }}>
						{ slides }
					</Carousel>
				) 
			: slides
	}, [driver.driverMedia, props.pageContext.seriesId])
	
	return (
		<Layout {...props}>
			
			{ media }

			<main className="container">
				
				<div className="columns">   
					<div className="column col-8 col-xl-10 col-lg-12 col-mx-auto content">
					
						<hgroup className={`page-header ${styles.pageHeader}`}>
							<DriverChip
								active={true}
								driverName={driver.driverNickName ?? driver.driverName}
								carNumber={driver.carNumber}
								driverNumberArt={driver.carNumberArt}
							/>
							<div className="hide-sm">
								{ driver.licenses.filter(
										({ category }) => category === 'oval' || category === 'road'
									).map(
										(license) => (
											<License 
												key={`license-${license.category}`}
												license={license.class}
												ir={license.irating}
												sr={license.sr}
											/>
										)
									)
								}
							</div>
						</hgroup>

						<Table 
							columns={trackColumns} 
							data={data}
							initialState={{
								grouping: ['trackType'],
								sorting: [{ id: 'trackType', desc: false }],
								columnVisibility: { trackName: false }
							}}
							scrolling={true}
							showFooter={true}
						/>							

						<br/>

						<Table 
							columns={trackColumns} 
							data={data}
							initialState={{
								grouping: ['trackName'],
								sorting: [{ id: 'trackName', desc: false }]
							}}
							scrolling={true}
						/>							

						<br/>
						
						<div className="columns">
							<div className="column col-6 col-lg-12">
								<Select 
									className={styles.selectContainer}
									styles={{
										container: (baseStyles, state) => ({
											...baseStyles,
											zIndex: 7,
										})
									}}
									isMulti={true}
									onChange={selected => setSeasonId(
										selected.map(({ value }) => value)
									)}
									options={seasonOptions} 
									placeholder="Filter results by season..."
								/>
								<Select 
									className={styles.selectContainer}
									styles={{
										container: (baseStyles, state) => ({
											...baseStyles,
											zIndex: 5,
										})
									}}
									isMulti={true}
									onChange={selected => setCarId(
										selected.flatMap(({ value }) => value)
									)}
									options={carOptions} 
									placeholder="Filter results by car..."
								/>
							</div>
							<div className="column col-6 col-lg-12">
								<Select 
									className={styles.selectContainer}
									styles={{
										container: (baseStyles, state) => ({
											...baseStyles,
											zIndex: 4,
										})
									}}
									isMulti={true}
									onChange={selected => setTrackName(
										selected.map(({ value }) => value)
									)}
									options={trackOptions} 
									placeholder="Filter results by track..."
								/>
								<Select 
									className={styles.selectContainer}
									styles={{
										container: (baseStyles, state) => ({
											...baseStyles,
											zIndex: 3,
										})
									}}
									isMulti={true}
									onChange={selected => setTrackType(
										selected.map(({ value }) => value)
									)}
									options={typeOptions} 
									placeholder="Filter results by track type..."
								/>
							</div>
						</div>
						
						<Table 
							columns={resultColumns} 
							data={data}
							initialState={{
								sorting: [{ id: 'raceDate', desc: true }]
							}}
							filters={columnFilters}
							scrolling={true}
						/>							
						
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

const getTimeFromMilliseconds = (time) => {
	let hours = Math.floor(time / (3600 * 10000))
	time = time - hours * 3600 * 10000
	let min = Math.floor(time / (60 * 10000))
	time = time - min * 60 * 10000
	let secs = Math.floor(time / 10000)
	time = time - secs * 10000
	const tenths = Math.floor(time / 1000)
	time = time - tenths * 1000
	const hun = Math.floor(time / 100)
	time = time - hun * 100
	const thous = Math.floor(time / 10)
	if (hours) 
		hours += ":"
	else 
		hours = ""
	if (hours && min < 10)
		min = "0" + min
	if (min && secs < 10)
		secs = "0" + secs
	return `${hours}${min > 0 ? `${min}:` : ``}${secs}.${tenths}${hun}${thous}`
}

const sortAlphaAsc = (a, b) => {
	const va = a[a.hasOwnProperty('sort') ? 'sort' : 'label'].toUpperCase(),
				vb = b[b.hasOwnProperty('sort') ? 'sort' : 'label'].toUpperCase()
	if (va < vb)
		return -1
	else if (va > vb)
		return 1
	else return 0
}

const sortAlphaDesc = (a, b) => {
	const va = a[a.hasOwnProperty('sort') ? 'sort' : 'label'].toUpperCase(),
				vb = b[b.hasOwnProperty('sort') ? 'sort' : 'label'].toUpperCase()
	if (va < vb)
		return 1
	else if (va > vb)
		return -1
	else return 0
}

export const query = graphql`
	query DriverQuery($custId: Int) {
		driver: iracingMember(
			cust_id: {eq: $custId}
		) {
			driverName: display_name
			driverNickName: nick_name
			driverMedia {
				id: contentful_id
				gatsbyImageData	
				metadata {
					tags {
						name
					}
				}
				file {
					url
				}
			}
			carNumber: car_number
			carNumberArt: driverNumberArt {
				gatsbyImageData	
				file {
					url
				}
			}						
			licenses {
				category
				irating
				color
				class: group_name
				sr: safety_rating
			}
			participants {
				finishPos: finish_pos
				startPos: qualify_pos
				lapsCompleted: num_laps
				lapsLed: laps_led
				incidents
				fastestLapTime: fastest_lap_time
				qualifyTime: qualify_time
				status
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
				car {
					carId: car_id
					carName: car_name
				}
				race {
					schedule {
						raceDate: race_date
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
							seasonId: season_id
							seasonName: season_name
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

export default DriverTemplate

export const Head = (props) => (
	<Meta {...props}/>
)
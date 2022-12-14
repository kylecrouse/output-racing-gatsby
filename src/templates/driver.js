import * as React from "react"
import { graphql } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import { Carousel, Slide } from '../components/carousel'
import DriverChip from '../components/driverChip'
import Layout from '../components/layout'
import License from '../components/license'
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
	// const configStats = React.useMemo(
	// 	() => driver.driverConfigStats && driver.driverConfigStats.stats.length > 1
	// 		? [{ typeName: 'Overall', ...driver.driverCareerStats },
	// 			  ...driver.driverConfigStats.stats
	// 			].sort((a, b) => TYPE_ORDER.indexOf(a.typeName) - TYPE_ORDER.indexOf(b.typeName))
	// 		: [{ typeName: 'Overall', ...driver.driverCareerStats }],
	// 	[driver.driverCareerStats, driver.driverConfigStats]
	// )
	const typeColumns = React.useMemo(
		() => [
			{
				Header: '',
				accessor: 'typeName',
				className: 'cell-typeName'
			},
			{
				Header: 'Starts',
				accessor: 'starts'
			},
			{
				Header: 'Avg Start',
				accessor: 'avgStartPos',
				Cell: ({ value }) => parseFloat(value) > 0 ? value : '-'
			},
			{
				Header: 'Avg Finish',
				accessor: 'avgFinishPos'
			},
			{
				Header: 'Avg Rating',
				accessor: 'rating'
			},
			{
				Header: 'Laps',
				accessor: 'lapsCompleted'
			},
			{
				Header: 'Led',
				accessor: 'lapsLed',
			},
			{
				Header: '%Led',
				accessor: 'lapsLedPct',
			},
			{
				Header: 'Inc',
				accessor: 'incidents'
			},
			{
				Header: 'Inc/Race',
				accessor: 'incidentsPerRace'
			},
			{
				Header: 'Inc/Lap',
				accessor: 'incidentsPerLap'
			},
			{
				Header: 'Wins',
				accessor: 'wins'
			},
			{
				Header: '%W',
				accessor: 'winPct'
			},
			{
				Header: 'T5',
				accessor: 'top5s'
			},
			{
				Header: '%T5',
				accessor: 'top5Pct'
			},
			{
				Header: 'T10',
				accessor: 'top10s'
			},
			{
				Header: '%T10',
				accessor: 'top10Pct'
			},
			{
				Header: 'Poles',
				accessor: 'poles'
			},
			{
				Header: `%Pole`,
				accessor: 'polePct'
			},
		],
		[]
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
				sortingFn: 'trackTypeSorting',
			},
			{
				header: 'Type',
				id: 'trackType',
				accessorFn: (row) => getTrackTypeName(row.race.schedule.trackConfig),
				className: 'cell-typeName',
				aggregationFn: 'unique'
			},
			{
				header: 'Starts',
				id: 'starts',
				accessorKey: 'startPos',
				aggregationFn: 'count'
			},
			{
				header: 'Avg Start',
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
				aggregatedCell: ({ getValue }) => getValue() > 0 ? Math.floor(getValue() * 10) / 10 : '-'
			},
			{
				header: 'Avg Finish',
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
				aggregatedCell: ({ getValue }) => getValue() > 0 ? Math.floor(getValue() * 10) / 10 : '-'
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
				aggregatedCell: ({ getValue }) => getValue() > 0 ? Math.floor(getValue() * 10) / 10 : '-'
			},
			{
				header: 'Laps',
				accessorKey: 'lapsCompleted',
				aggregationFn: 'sum',
			},
			{
				header: 'Led',
				accessorKey: 'lapsLed',
				aggregationFn: 'sum',
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
				aggregatedCell: ({ getValue }) => getValue() > 0 ? `${Math.floor(getValue() * 100)}%` : '-'
			},
			{
				header: 'Inc',
				accessorKey: 'incidents',
				aggregationFn: 'sum',
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
				aggregatedCell: ({ getValue }) => getValue() > 0 ? Math.floor(getValue() * 100) / 100 : '-'
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
				aggregatedCell: ({ getValue }) => getValue() > 0 ? Math.floor(getValue() * 100) / 100 : '-'
			},
			{
				header: 'Wins',
				id: 'wins',
				accessorFn: (row) => row.finishPos === 1 ? 1 : 0,
				aggregationFn: 'sum',
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
				aggregatedCell: ({ getValue }) => getValue() > 0 ? `${Math.floor(getValue() * 100)}%` : '-'
			},
			{
				header: 'T5',
				id: 't5s',
				accessorFn: (row) => row.finishPos <= 5 ? 1 : 0,
				aggregationFn: 'sum',
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
				aggregatedCell: ({ getValue }) => getValue() > 0 ? `${Math.floor(getValue() * 100)}%` : '-'
			},
			{
				header: 'T10',
				id: 't10s',
				accessorFn: (row) => row.finishPos <= 10 ? 1 : 0,
				aggregationFn: 'sum',
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
				aggregatedCell: ({ getValue }) => getValue() > 0 ? `${Math.floor(getValue() * 100)}%` : '-'
			},
			{
				header: 'Poles',
				id: 'poles',
				accessorFn: (row) => row.startPos === 1 ? 1 : 0,
				aggregationFn: 'sum',
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
				aggregatedCell: ({ getValue }) => getValue() > 0 ? `${Math.floor(getValue() * 100)}%` : '-'
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
							<Slide>
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

						{/* { configStats && 
							<Table 
								columns={typeColumns} 
								data={configStats}
								disableSortBy={true} 
								scrolling={true}
							/>							
						} */}
						
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

export const query = graphql`
	query DriverQuery($custId: Int) {
		driver: iracingMember(
			cust_id: {eq: $custId}
		) {
			driverName: display_name
			driverNickName: nick_name
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
				qualifyTime: qualify_time
				loopstat {
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

export default DriverTemplate
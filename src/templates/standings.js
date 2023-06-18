import * as React from 'react'
import { graphql, navigate } from 'gatsby'
import Select, { components } from 'react-select'
import Layout from '../components/layout'
import Meta from '../components/meta'
import { renderDriverChip as renderChipHelper } from '../components/driverChip'
import Table from '../components/table'
import * as styles from './standings.module.scss'

const pathify = (string) => string.replace(/[:-]/g, '').replace(/\s+/g, '-').toLowerCase()

const StandingsTemplate = (props) => {
	
	const renderDriverChip = (p, c) => renderChipHelper({ ...p, location: props.location }, c)
	
	const seasonOptions = React.useMemo(
		() => props.data.seasons.nodes.map(
			(node) => ({
				label: node.seasonName,
				value: node.seasonId,
			})
		), 
		[props.data.seasons]
	)
	
  const defaultValueIndex = React.useMemo(
    () => {
      const index = seasonOptions.findIndex(({ label }) => props.location.hash === `#${pathify(label)}`)
      return (index >= 0) 
        ? index 
        : seasonOptions.findIndex(({ value }) => value === props.data.series.currSeasonId)
    },
    [seasonOptions, props.data.series.currSeasonId]
  )
	
	const [seasonId, setSeasonId] = React.useState(seasonOptions[defaultValueIndex].value)
	const [totalRounds, setTotalRounds] = React.useState()
	const [selectedRound, setSelectedRound] = React.useState()
		
	const season = React.useMemo(
		() => props.data.seasons.nodes.find(
			(season) => season.seasonId === seasonId
		),
		[seasonId, props.data.seasons.nodes]
	)

	const rounds = React.useMemo(
		() => {
			let totalRounds = 0, 
					roundsCompleted = 0
			const rounds = season.schedules.reduce(
				(a, round) => {
					const { pointsCount, chase, offWeek, race } = round
					if (pointsCount === 'Y' && offWeek === 'N') {
						a.push(round)
						if (chase === 'N') totalRounds++
						if (race) roundsCompleted++
					}
					return a
				},
				[]
			)
			setTotalRounds(totalRounds)
			setSelectedRound(roundsCompleted)
			return rounds
		},
		[season]
	)
	
	const roundOptions = React.useMemo(
		() => {
			let raceNo = 0
			return Array.from(
				rounds.filter(({ chase, race }) => race), 
				(el, i) => {
					if (el.chase === 'N') raceNo++
					return { 
						label: el.chase === 'Y'
							? `-- ${el.eventName ?? `Chase: Top ${el.chaseConfig.chaseNumDrivers} Drivers`} --`
							: `Round ${raceNo}: ${el.trackConfig?.trackName.replace(/\[.*\]\s/, '').replace(/ - \d*$/, '')}`,
						chipLabel: el.chase === 'Y'
							? el.eventName
							: raceNo === totalRounds
								? 'Final'
								: `Round ${raceNo} of ${totalRounds}`,
						value: i + 1
					}
				}
			).sort((a, b) => b.value - a.value)
		}, 
		[rounds, totalRounds]
	)
	
	const filteredRounds = React.useMemo(
		() => {
			let i = 0
			return rounds.reduce(
				(acc, r) => {
					if (i >= selectedRound) return acc
					if (r.pointsCount === 'Y') {
						acc.push(r)
						i++						
					}
					return acc		
				}, 
				[]
			)
		}, [rounds, selectedRound]
	)
	
	const data = React.useMemo(
		() => filteredRounds.reduce(
			(p, e) => e.race ? [...p, ...e.race.participants] : p, 
			[]
		),
		[filteredRounds]
	)
	
	const priorWeek = React.useMemo(
		() => {
			let participants = new Map()
			filteredRounds
				.filter(({ race }) => !!race)
				.slice(0, -1)
				.forEach(
					({ race }) => {
						race?.participants.forEach((p) => {
							const bonusPoints = p.bonuses?.reduce(
								(points, { bonusPoints }) => points += bonusPoints, 
								0
							) ?? 0
							const penaltyPoints = p.penalties?.reduce(
								(points, { penaltyPoints }) => points += penaltyPoints,
								0
							) ?? 0
							const totalPoints = p.racePoints + bonusPoints - penaltyPoints
						
							participants.set(
								p.driverId, 
								(participants.get(p.driverId) ?? 0) + totalPoints
							)
						})
					} 
				)
			return Array.from(participants.entries()).map(
				([driverId, totalPoints]) => ({ driverId, totalPoints })
			).sort(
				(a, b) => b.totalPoints - a.totalPoints
			)
		},
		[filteredRounds]
	)
	
	const columns = React.useMemo(
		() => [
			{
				id: 'position',
				className: 'cell-position',
				aggregatedCell: ({ table, row }) => {
					const { rows: sortedRows } = table.getSortedRowModel()
					let position = 0,
							index = sortedRows.findIndex(({ id }) => row.id === id)
					while (index--) {
						if (sortedRows[index]._groupingValuesCache.points > row._groupingValuesCache.points) {
							position = index + 1
							break
						}
					}
					return position + 1
				},
			},
			{
				id: 'change',
				className: 'cell-change',
				aggregatedCell: ({ table, row }) => {
					const { rows: sortedRows } = table.getSortedRowModel()
					const pos = sortedRows.findIndex(
												({ id }) => row.id === id
											),
								prior = priorWeek.findIndex(
									({ driverId }) => driverId === Math.floor(row.groupingValue)
								)
					const change = (prior === -1 ? pos : prior) - pos
					return (
						<span className={ 
							change > 0 
								? 'positive' 
								: change < 0 
									? 'negative' 
									: 'neutral'
							}>
							{ change !== null && change !== 0 
									? Math.abs(change) 
									: '\u00a0' 
							}
						</span>
					)
				}
			},
			{
				accessorKey: 'driverId',
				header: 'Driver',
				className: 'cell-driver',
				cell: ({ row }) => renderDriverChip(row.original),
				enableGrouping: true,
			},
			{
				id: 'points',
				header: 'Points',
				accessorFn: (row) => {
					const bonusPoints = row.bonuses?.reduce(
						(points, { bonusPoints }) => points += bonusPoints, 
						0
					) ?? 0
					const penaltyPoints = row.penalties?.reduce(
						(points, { penaltyPoints }) => points += penaltyPoints,
						0
					) ?? 0
					return row.racePoints + bonusPoints - penaltyPoints
				},
				aggregationFn: 'sum',
				enableSorting: true,
				className: 'cell-totalPoints',
			},
			{
				id: 'behindNext',
				header: 'Behind Next',
				className: 'hide-sm',
				aggregatedCell: ({ table, row }) => {
					const { rows: sortedRows } = table.getSortedRowModel()
					let points = row._groupingValuesCache.points,
							index = sortedRows.findIndex(({ id }) => row.id === id)
					if (index === 0)
						return '-'
					else
						return points - sortedRows[index - 1]._groupingValuesCache.points
				},
			},
			{
				id: 'behindLeader',
				header: 'Behind Leader',
				className: 'hide-sm',
				aggregatedCell: ({ table, row }) => {
					const { rows: sortedRows } = table.getSortedRowModel()
					let points = row._groupingValuesCache.points,
							index = sortedRows.findIndex(({ id }) => row.id === id)
					if (index === 0)
						return '-'
					else
						return points - sortedRows[0]._groupingValuesCache.points
				},
			},
			{
				id: 'starts',
				header: 'Starts',
				accessorFn: (row, index) => row.finishPos !== null ? 1 : 0,
				aggregationFn: 'sum',
				className: 'hide-sm',
			},
			{
				id: 'wins',
				header: 'Wins',
				accessorFn: (row) => row.finishPos === 1 ? 1 : 0,
				aggregationFn: 'sum',
				className: 'hide-sm',
			},
			{
				id: 'top5s',
				header: 'Top 5',
				accessorFn: (row) => row.finishPos !== null && row.finishPos <= 5 ? 1 : 0,
				aggregationFn: 'sum',
				className: 'hide-sm',
			},
			{
				id: 'top10s',
				header: 'Top 10',
				accessorFn: (row) => row.finishPos !== null && row.finishPos <= 10 ? 1 : 0,
				aggregationFn: 'sum',
				className: 'hide-sm',
			},
			{
				header: 'Laps',
				accessorKey: 'lapsCompleted',
				aggregationFn: 'sum',
				className: 'hide-sm',
			},
			{
				id: 'rating',
				header: 'Avg Rating',
				accessorFn: (row) => row.loopstat?.rating ?? 0,
				aggregationFn: (id, rows) => {
					rows = rows.filter((row) => row.getValue(id) > 0)
					return rows.reduce((sum, row) => sum + row.getValue(id), 0) / rows.length
				},
				className: 'hide-sm',
				aggregatedCell: ({ getValue }) => getValue()?.toFixed(1) ?? 0
			},
			// {
			// 	id: 'incPerRace',
			// 	Header: 'Incidents per Race',
			// 	accessor: ({ incidents, starts }) => (incidents / starts).toFixed(2),
			// },
			// {
			// 	id: 'incPerLap',
			// 	Header: 'Incidents per Lap',
			// 	accessor: ({ incidents, laps }) => (incidents / parseInt(laps.replace(/,/g, ''), 10)).toFixed(2),
			// },
		],
		[priorWeek]
	)
	
	return (
		<Layout {...props}>
			<main className="container">
	
				<div className="columns">
					<div className="column col-8 col-xl-12 col-mx-auto content">
				
						<hgroup className="page-header columns">
							<div className="column col-7 col-lg-12">
								<h2 className="page-title">Standings</h2>
								<h3 className="page-subtitle columns" style={{ alignItems: "baseline" }}>
									<div className="col-7 col-lg-12" style={{ width: "calc(50% - 1rem)", marginRight: "1rem"}}>
									<Select 
										className={styles.selectContainer}
										styles={{
											menu: (baseStyles, state) => ({
												...baseStyles,
												whiteSpace: "nowrap",
												width: "auto !important"
											})
										}}
										onChange={
											(selected) => {
												setSeasonId(selected.value)
												navigate(`standings#${pathify(selected.label)}`)
											}
										}
										options={seasonOptions} 
										defaultValue={seasonOptions[defaultValueIndex]}
									/>
									</div>
									<div className="col-5 col-lg-12" style={{ borderLeft: "1px solid #ccc", padding: "0 0 0 1rem" }}>
										<Select 
											components={{ SingleValue }}
											className={styles.selectContainer}
											styles={{
												container: (baseStyles, state) => ({
													...baseStyles,
													margin: "0 !important",
												}),
												menu: (baseStyles, state) => ({
													...baseStyles,
													whiteSpace: "nowrap",
													width: "auto !important"
												})
											}}
											onChange={
												(selected) => setSeasonId(selected.value)
											}
											options={roundOptions}
											value={roundOptions[roundOptions.length - selectedRound]}
										/>
									</div>
								</h3>
							</div>
						</hgroup>
						
						<Table 
							columns={columns} 
							data={data}
							initialState={{
								grouping: ['driverId'],
								sorting: [{ id: 'points', desc: true }],
								hiddenColumns: columns
									.map(({ id, accessor }) => id || accessor)
									.filter(column => ['laps'].includes(column))
							}}
						/>

					</div>
				</div>
					
			</main>
	
		</Layout>
	)
}

const SingleValue = props => (
	<components.SingleValue {...props}>
		{props.data.chipLabel}
	</components.SingleValue>
)

export const query = graphql`
	query StandingsQuery(
		$seriesId: Int
	) {
		series: mysqlSeries(
			series_id: {eq: $seriesId}
		) {
			currSeasonId: curr_season_id
		}
		seasons: allMysqlSeason(
			filter: {series_id: {eq: $seriesId}}
			sort: {schedules: {race_date: DESC}}
		) {
			nodes {
				seasonId: season_id
				seasonName: season_name
				schedules {							
					scheduleId: schedule_id
					eventName: event_name
					pointsCount: points_count
					chase
					chaseConfig {
						chaseNumDrivers: chase_num_drivers
					}
					offWeek: off_week
					raceDate: race_date
					trackConfig {
						trackName: track_name
					}
					race {
						raceId: race_id
						participants {
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
							racePoints: race_points
							startPos: qualify_pos
							finishPos: finish_pos	
							incidents
							lapsLed: laps_led
							lapsCompleted: num_laps
							bonuses {
								bonusPoints: bonus_points
							}
							penalties {
								penaltyPoints: penalty_points
							}
							loopstat {
								rating
							}
						}
					}
				}
			}
		}			
	}
`

export default StandingsTemplate

export const Head = (props) => (
	<Meta {...props}/>
)
import * as React from 'react'
import { graphql } from 'gatsby'
import Cars from '../components/cars'
import Layout from '../components/layout'
import StandingsTable from '../components/standingsTable'
import Select, { components } from 'react-select'
import * as styles from './stats.module.scss'

const StandingsTemplate = (props) => {
	const [seasonId, setSeasonId] = React.useState(props.pageContext.seasonId)
	const [totalRounds, setTotalRounds] = React.useState()
	const [selectedRound, setSelectedRound] = React.useState()
	
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
		() => seasonOptions.findIndex(
			({ value }) => value === props.data.series.currSeasonId
		),
		[seasonOptions, props.data.series]
	)
	
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
						if (!chase) totalRounds++
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
					if (!el.chase) raceNo++
					return { 
						label: el.chase 
							? `-- ${el.eventName ?? `Chase: Top ${el.chase.chaseNumDrivers} Drivers`} --`
							: `Round ${raceNo}: ${el.trackConfig?.trackName.replace(/\[.*\]\s/, '').replace(/ - \d*$/, '')}`,
						chipLabel: el.chase
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
	
	return (
		<Layout {...props}>
			<main className="container">
	
				<div className="columns">
					<div className="column col-8 col-xl-12 col-mx-auto content">
				
						<hgroup className="page-header columns">
							<div className="column col-7">
								<h2 className="page-title">Standings</h2>
								<h3 className="page-subtitle columns" style={{ alignItems: "baseline" }}>
									<div className="col-7" style={{ width: "calc(50% - 1rem)", marginRight: "1rem"}}>
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
											(selected) => setSeasonId(selected.value)
										}
										options={seasonOptions} 
										defaultValue={seasonOptions[defaultValueIndex]}
									/>
									</div>
									<div className="col-5" style={{ borderLeft: "1px solid #ccc", padding: "0 0 0 1rem" }}>
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
												(selected) => setSelectedRound(selected.value)
											}
											options={roundOptions}
											value={roundOptions[roundOptions.length - selectedRound]}
										/>
									</div>
								</h3>
							</div>
							{ season.seasonClass?.length > 0 &&
								<div className="column col-6">
									<Cars cars={season.seasonClass[0]?.seasonClassCars} />
								</div>
							}
						</hgroup>
						
						<StandingsTable
							data={ filteredRounds }
							fields={ column => ['laps'].includes(column) }
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
					chase {
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
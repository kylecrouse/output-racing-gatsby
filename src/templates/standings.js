import * as React from 'react'
import { graphql } from 'gatsby'
import Cars from '../components/cars'
import Layout from '../components/layout'
import StandingsTable from '../components/standingsTable'
import Select from 'react-select'
import * as styles from './stats.module.scss'

const StandingsTemplate = (props) => {
	const [seasonId, setSeasonId] = React.useState(props.pageContext.seasonId)
	
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
		() => props.data.seasons.nodes.find((season) => season.seasonId === seasonId),
		[seasonId, props.data.seasons.nodes]
	)

	const { rounds, totalRounds, roundsCompleted } = React.useMemo(
		() => season.schedules.reduce(
			(a, round) => {
				const { pointsCount, chase, offWeek, race } = round
				if (pointsCount === 'Y' && offWeek === 'N') {
					a.rounds.push(round)
					if (!chase) {
						a.totalRounds++
						if (race) a.roundsCompleted++
					}
				}
				return a
			},
			{ rounds: [], totalRounds: 0, roundsCompleted: 0 }
		),
		[season]
	)
	
	return (
		<Layout {...props}>
			<main className="container">
	
				<div className="columns">
					<div className="column col-8 col-xl-12 col-mx-auto content">
				
						<hgroup className="page-header columns">
							<div className="column col-8">
								<h2 className="page-title">Standings</h2>
								<h3 className="page-subtitle columns" style={{ alignItems: "baseline" }}>
									<div className="col-6" style={{ width: "calc(50% - 1rem)", marginRight: "1rem"}}>
									<Select 
										className={styles.selectContainer}
										onChange={
											(selected) => setSeasonId(selected.value)
										}
										options={seasonOptions} 
										defaultValue={seasonOptions[defaultValueIndex]}
									/>
									</div>
									<div className="col-6" style={{ borderLeft: "1px solid #ccc", padding: "2px 0 2px 0.8rem" }}>{	roundsCompleted < totalRounds
											? `Round ${roundsCompleted} of ${totalRounds}`
											: 'Final'
									}</div>
								</h3>
							</div>
							{ season.seasonClass?.length > 0 &&
								<div className="column col-6">
									<Cars cars={season.seasonClass[0]?.seasonClassCars} />
								</div>
							}
						</hgroup>
						
						<StandingsTable
							data={ rounds }
							fields={ column => ['laps'].includes(column) }
						/>
							
					</div>
				</div>
					
			</main>
	
			{/*<div className="columns seasons-container">
				<div className="column col-8 col-xl-12 col-mx-auto">
					<Seasons path={`${props.pageContext.seriesName}/standings`} seasons={seasons} />
				</div>
			</div>*/}
			
		</Layout>
	)
}

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
					pointsCount: points_count
					chase {
						chaseId: chase_id
					}
					offWeek: off_week
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
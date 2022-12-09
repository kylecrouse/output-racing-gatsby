import * as React from 'react'
import { graphql } from 'gatsby'
import Cars from '../components/cars'
import Layout from '../components/layout'
import Seasons from '../components/seasons'
import StandingsTable from '../components/standingsTable'

const StandingsTemplate = (props) => {
	const { season, events } = props.data
	
	// const seasons = React.useMemo(
	// 	() => props.data.seasons.edges.map(
	// 		({ node }) => node
	// 	), 
	// 	[props.data.seasons]
	// )

	const { totalRounds, roundsCompleted } = React.useMemo(
		() => events.nodes.reduce(
			(a, { pointsCount, chase, offWeek, race }) => {
				if (pointsCount === 'Y' && !chase && offWeek === 'N') {
					a.totalRounds++
					if (race) a.roundsCompleted++
				}
				return a
			},
			{ totalRounds: 0, roundsCompleted: 0 }
		),
		[events]
	)
	
	return (
		<Layout {...props}>
			<main className="container">
	
				<div className="columns">
					<div className="column col-8 col-xl-12 col-mx-auto content">
				
						<hgroup className="page-header columns">
							<div className="column col-6">
								<h2 className="page-title">Standings</h2>
								<h3 className="page-subtitle">
									<span>{ season.seasonName }</span>
									<span>{	roundsCompleted < totalRounds
											? `Round ${roundsCompleted} of ${totalRounds}`
											: 'Final'
									}</span>
								</h3>
							</div>
							{ season.seasonClass?.length > 0 &&
								<div className="column col-6">
									<Cars cars={season.seasonClass[0]?.seasonClassCars} />
								</div>
							}
						</hgroup>
						
						<StandingsTable
							data={ events.nodes }
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
		$seasonId: Int, 
		$race_date: SortOrderEnum = ASC
	) {
		events: allMysqlSchedule(
			filter: {season_id: {eq: $seasonId}, points_count: {eq: "Y"}}
			sort: {race_date: $race_date}
		) {
			nodes {							
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
		season: mysqlSeason(
			season_id: {eq: $seasonId}
		) {
			seasonId: season_id
			seasonName: season_name
		}
	}
`

export default StandingsTemplate
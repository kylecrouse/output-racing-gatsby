import * as React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import Schedule from '../components/schedule'
import Select from 'react-select'
import * as styles from './stats.module.scss'

const ScheduleTemplate = props => {
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
		() => props.data.seasons.nodes.find(
			(season) => season.seasonId === seasonId
		),
		[seasonId, props.data.seasons.nodes]
	)

	return (
		<Layout {...props}>
			<main className="container">
	
				<div className="columns">
					<div className="column col-8 col-xl-10 col-lg-11 col-sm-12 col-mx-auto content">
					
						<hgroup className="page-header columns">
							<div className="column col-6">
								<h2 className="page-title">Schedule</h2>
								<h3 className="page-subtitle">
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
								</h3>
							</div>
						</hgroup>
	
						<Schedule events={season.schedules} {...props} />
	
					</div>
				</div>
			
			</main>
					
		</Layout>
	)
}

export const query = graphql`
	query ScheduleQuery(
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
					plannedLaps: planned_laps
					trackConfig {
						trackName: track_name
						trackConfigIracingId: track_config_iracing_id
						trackConfigName: track_config_name
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
							finishPos: finish_pos	
							bonuses {
								bonusPoints: bonus_points
							}
							penalties {
								penaltyPoints: penalty_points
							}
						}
					}
				}
			}
		}			
	}
`

export default ScheduleTemplate
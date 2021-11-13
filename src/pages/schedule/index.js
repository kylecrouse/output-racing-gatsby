import * as React from 'react'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'
import Schedule from '../../components/schedule'
import Seasons from '../../components/seasons'

const SchedulePage = ({ data }) => {
	const name = data.league.activeSeason.name.match(/Output Racing (\d+) (Season \d)?(.*)/)	
	return (
		<>
			<main className="container">
	
				<Helmet>
					<title>Output Racing League | Schedule | { `${name[2]} ${name[3]}` }</title>
				</Helmet>
	
				<div className="columns">
					<div className="column col-8 col-xl-12 col-mx-auto content">
					
						<hgroup className="page-header columns">
							<div>
								<h2 className="page-title">Schedule</h2>
								<h3 className="page-subtitle">
									{ `${name[2]} ${name[3]}` }
								</h3>
							</div>
						</hgroup>
	
						<Schedule 
							schedule={
								data.league.activeSeason.schedule.map(item => ({
									...item,
									track: {
										...data.league.tracks.find(
											({ name }) => item.track.includes(name)
										),
										config: item.track
									},
									results: data.league.activeSeason.results.find(
										({ raceId }) => parseInt(raceId) === parseInt(item.raceId)
									)
								}))
							}
							drivers={ data.drivers.nodes }
							cars={ data.league.cars.filter(
								({ name }) => data.league.activeSeason.cars.includes(name)
							)}
						/>
	
					</div>
				</div>
			
			</main>
					
			<div className="columns seasons-container">
				<div className="column col-8 col-xl-12 col-mx-auto">
				
					<Seasons 
						path="schedule" 
						seasons={data.league.seasons.filter(({ id }) => id !== data.league.activeSeason.id)} 
						cars={data.league.cars}
						drivers={data.drivers.nodes}
					/>
					
				</div>
			</div>
		</>
	)
}

export const query = graphql`
	query ScheduleQuery {
		league: contentfulLeague(leagueId: {eq: 2732}) {
			activeSeason {
				name
				id: contentful_id
				cars
				schedule {
					counts
					name
					raceNo
					raceId
					offWeek
					track
					time
					laps
					date
					chase
				}
				results {
					raceId
					results {
						finish
						name
						points
						bonus
						penalty
					}
				}
			}
			cars {
				name
				image
			}
			tracks {
				name
				logo
			}
			seasons {
				name
				cars
				id: contentful_id
				standings {
					driver
					points
				}
			}
		}
		drivers: allContentfulDriver {
			nodes {
				name
				nickname
				active
				number
				numberArt {
					file {
						url
					}
				}
			}
		}
	}
`

export default SchedulePage
import * as React from 'react'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'
import Schedule from '../../components/schedule'
import Seasons from '../../components/seasons'
import Cars from '../../components/cars'

const SchedulePage = ({ data }) => {
	return (
		<main>
			<Helmet>
				<meta charSet="utf-8" />
				<title>Output Racing League | Schedule | {data.league.activeSeason.name.replace('Output Racing ', '')}</title>
			</Helmet>

			<h2 className="text-center">
				{data.league.activeSeason.name.replace('Output Racing ', '')} Schedule
			</h2>
			{ data.league.activeSeason.cars &&
				<Cars cars={
					data.league.cars.filter(
						({ name }) => data.league.activeSeason.cars.includes(name)
					)
				}/>
			}
			<Schedule {...data.league.activeSeason}/>
			
			<Seasons 
				path="schedule" 
				seasons={data.league.seasons.filter(({ id }) => id !== data.league.activeSeason.id)} 
				drivers={data.drivers.nodes}
			/>
	
		</main>
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
				}
			}
			cars {
				name
				image
			}
			seasons {
				name
				id: contentful_id
				standings {
					driver
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
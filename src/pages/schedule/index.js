import * as React from 'react'
import { graphql } from 'gatsby'
import Schedule from '../../components/schedule'
import Seasons from '../../components/seasons'
import Cars from '../../components/cars'

const SchedulePage = ({ data }) => {
	return (
		<main>
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
				seasons={data.league.seasons} 
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
				image {
					childImageSharp {
						gatsbyImageData(height: 150)
					}					
				}
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
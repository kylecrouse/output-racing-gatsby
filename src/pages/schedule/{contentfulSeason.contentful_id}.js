import * as React from 'react'
import { graphql } from 'gatsby'
import Schedule from '../../components/schedule'
import Seasons from '../../components/seasons'
import Cars from '../../components/cars'

const ScheduleArchivePage = ({ data }) => {
	return (
		<main>
			<h2 className="text-center">
				{data.season.name.replace('Output Racing ', '')} Schedule
			</h2>
			{ data.season.cars &&
				<Cars cars={
					data.league.cars.filter(
						({ name }) => data.season.cars.includes(name)
					)
				}/>
			}
			<Schedule {...data.season}/>
			
			<h3 className="text-center" style={{ margin: "3rem 0 2rem" }}>Other Seasons</h3>
			<Seasons seasons={data.league.seasons} drivers={data.drivers.nodes}/>
	
		</main>
	)
}

export const query = graphql`
	query ScheduleArchivePage($contentful_id: String) {
		season: contentfulSeason(contentful_id: {eq: $contentful_id}) {
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
		league: contentfulLeague(leagueId: {eq: 2732}) {
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

export default ScheduleArchivePage
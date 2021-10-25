import * as React from 'react'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'
import Schedule from '../../components/schedule'
import Seasons from '../../components/seasons'
import Cars from '../../components/cars'

const ScheduleArchivePage = ({ data }) => {
	return (
		<main>

			<Helmet>
				<meta charSet="utf-8" />
				<title>Output Racing League | Schedule | {data.season.name.replace('Output Racing ', '')}</title>
			</Helmet>

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
			
			<Seasons 
				path="schedule" 
				seasons={data.league.seasons.filter(({ id }) => id !== data.season.id)} 
				drivers={data.drivers.nodes}
			/>
	
		</main>
	)
}

export const query = graphql`
	query ScheduleArchivePage($contentful_id: String) {
		season: contentfulSeason(contentful_id: {eq: $contentful_id}) {
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
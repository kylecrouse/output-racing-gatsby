import * as React from 'react'
import { graphql } from 'gatsby'
import Schedule from '../../templates/schedule'

const ArchiveSchedulePage = ({ data }) => {
	const season = {
		...data.season,
		schedule: data.season.schedule.map(item => ({
			...item,
			track: {
				...data.league.tracks.find(
					({ name }) => item.track.includes(name)
				),
				config: item.track
			},
			results: data.season.results.find(
				({ raceId }) => parseInt(raceId) === parseInt(item.raceId)
			)
		}))
	}
	
	return (
		<Schedule 
			season={season}
			cars={data.league.cars}
			seasons={data.league.seasons}
			drivers={data.drivers.nodes}
		/>
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
		league: contentfulLeague(leagueId: {eq: 2732}) {
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

export default ArchiveSchedulePage
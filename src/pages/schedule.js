import * as React from 'react'
import { graphql } from 'gatsby'
import Schedule from '../templates/schedule'

const CurrentSchedulePage = ({ data }) => {
	const season = {
		...data.league.activeSeason,
		schedule: data.league.activeSeason.schedule.map(item => ({
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
	
	return (
		<Schedule 
			pageContext={{
				season,
				cars: data.league.cars,
				seasons: data.league.seasons,
				drivers: data.drivers.nodes
			}}
		/>
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

export default CurrentSchedulePage
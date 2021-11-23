import * as React from 'react'
import { graphql } from 'gatsby'
import Results from '../templates/results'

const LatestResultsPage = ({ data, location }) => {
	return (
		<Results 
			pageContext={{
				...data.race.nodes[0],
				track: data.league.tracks.find(
					({ name }) => data.race.nodes[0].track.includes(name)
				),
				results: data.race.nodes[0].results.map(
					(item) => ({
						...item,
						driver: data.drivers.nodes.find(({ name }) => name === item.name)
					})
				)
			}}
			location={location}
		/>
	)
}

export const query = graphql`
	query LatestQuery {
		race: allContentfulRace(
			filter: { uploaded: { eq: true }}
			sort: { fields: date, order: DESC }
			limit: 1
		) {
			nodes {
				raceId
				broadcast
				cautionLaps
				cautions
				counts
				date
				duration
				name
				laps
				leadChanges
				leaders
				logo {
					file {
						url
					}
				}
				media {
					gatsbyImageData(
						layout: FULL_WIDTH
						placeholder: BLURRED
					)
					file {
						url
					}
				}
				track
				time
				results {
					average
					bonus
					completed
					fastest
					finish
					incidents
					interval
					led
					name
					penalty
					points
					start
					status
				}				
			}
		}
		league: contentfulLeague(leagueId: {eq: 2732}) {
			tracks {
				name
				logo
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

export default LatestResultsPage
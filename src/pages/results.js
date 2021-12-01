import * as React from 'react'
import { graphql } from 'gatsby'
import Results from '../templates/results'

const LatestResultsPage = ({ data, location }) => {
	const race = data.race.nodes[0]
	return (
		<Results 
			pageContext={{
				...race,
				track: data.league.tracks.find(
					({ name }) => race.track.includes(name)
				),
				results: race.results.map(
					(item) => {
						const driver = data.drivers.nodes.find(({ name }) => name === item.name)
						const { rating = 0 } = race.fields
							? race.fields.ratings.find(({ custid }) => custid === driver.custId)
							: {}
						return { ...item, driver, rating }
					}
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
				subsessionId
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
				fields {
					ratings {
						custid
						rating
					}
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
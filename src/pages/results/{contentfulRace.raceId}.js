import * as React from 'react'
import { graphql } from 'gatsby'
import Results from '../../templates/results'

const ResultsPage = ({ data }) => {
	return (
		<Results 
			{ ...data.race }
			track={
				data.league.tracks.find(({ name }) => data.race.track.includes(name))
			}
			results={
				data.race.results.map(item => ({
					...item,
					driver: data.drivers.nodes.find(({ name }) => name === item.name)
				}))
			}
		/>
	)
}

export const query = graphql`
	query ResultsQuery($raceId: Int) {
		race: contentfulRace(raceId: {eq: $raceId}) {
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

export default ResultsPage
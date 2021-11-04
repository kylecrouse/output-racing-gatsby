import * as React from 'react'
import { graphql } from 'gatsby'
import StandingsPage from '../../components/standingsPage'

const ArchiveStandingsPage = ({ data }) => {
	return (
		<StandingsPage 
			season={data.season}
			cars={data.league.cars}
			seasons={data.league.seasons}
			drivers={data.drivers.nodes}
		/>
	)
}

export const query = graphql`
	query StandingsArchivePage($contentful_id: String) {
		season: contentfulSeason(contentful_id: {eq: $contentful_id}) {
			name
			cars
			id: contentful_id
			schedule {
				counts
				uploaded
			}
			results {
				raceId
			}
			standings {
				position
				driver
				change
				starts
				points
				behindNext
				behindLeader
				wins
				t5s
				t10s
				laps
				incidents
			}
		}
		league: contentfulLeague(leagueId: {eq: 2732}) {
			seasons {
				name
				cars
				id: contentful_id
				standings {
					driver
					points
				}
			}
			cars {
				name
				image
				transform
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

export default ArchiveStandingsPage
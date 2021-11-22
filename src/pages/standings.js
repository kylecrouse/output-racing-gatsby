import * as React from 'react'
import { graphql } from 'gatsby'
import Standings from '../templates/standings'

const CurrentStandingsPage = ({ data }) => {
	return (
		<Standings 
			pageContext={{
				season: data.league.activeSeason,
				cars: data.league.cars,
				seasons: data.league.seasons,
				drivers: data.drivers.nodes
			}}
		/>
	)
}

export const query = graphql`
	query StandingsQuery {
		league: contentfulLeague(leagueId: {eq: 2732}) {
			activeSeason {
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

export default CurrentStandingsPage
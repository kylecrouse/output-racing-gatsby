import * as React from 'react'
import { graphql } from 'gatsby'
import Standings from '../templates/standings'

const CurrentStandingsPage = ({ data, location }) => {
	const season = data.league.activeSeason
// console.log({ season })
	return (
		<Standings 
			pageContext={{
				season: {
					...season,
					standings: season.standings.map(item => {
						const driver = data.drivers.nodes.find(({ name }) => name === item.driver)
						const rating = season.results.reduce((total, { raceId, fields }) => {
							if (!fields || !fields.ratings) return total 
							return total + fields.ratings
								.filter(({ custid }) => custid === driver.custId)
								.reduce((total, { rating }) => total + rating, 0)
						}, 0) / item.starts
						return { ...item, driver, rating }
					})
				}, 
				cars: data.league.cars,
				seasons: data.league.seasons,
				drivers: data.drivers.nodes
			}}
			location={location}
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
					fields {
						ratings {
							custid
							rating
						}
					}
					counts
					uploaded
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
				custId
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
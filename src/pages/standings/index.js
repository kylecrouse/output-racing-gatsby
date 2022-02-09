import * as React from 'react'
import { graphql } from 'gatsby'
import Standings from '../../templates/standings'

const CurrentStandingsPage = ({ data, location }) => {
	data.season.standings = React.useMemo(
		() => data.season.standings.map(item => {
			const rating = data.season.events.reduce((total, { race }) => {
				const { rating = 0 } = race?.participants.find(({ driverId }) => driverId === item.driverId) ?? {}
				return total + rating
			}, 0) / item.starts
			return { ...item, rating }
		}),
		[data.season]	
	)
	return (
		<Standings 
			pageContext={data}
			location={location}
		/>
	)
}

export const query = graphql`
	query CurrentStandingsQuery {
		season: simRacerHubSeason(active: { eq: true }) {
			leagueName
			seriesName
			seasonName
			seasonClass {
				seasonClassCars {
					carId
					carName
				}
			}
			events {
				pointsCount
				chase
				offWeek
				race {
					participants {
						driverId
						rating
					}
				}
			}
			standings {
				...standingsData
			}	
		}
		seasons: allSimRacerHubSeason(
			sort: {fields: events___raceDate, order: DESC}
			filter: {active: {eq: false}}
		) {
			edges {
				node {
					seasonName
					seasonId
					seriesName
					seasonClass {
						seasonClassCars {
							carId
							carName
						}
					}
					standings {
						driverId
						driverName
						member {
							active
							driverName
							driverNickname
							driverNumber
							driverNumberArt {
								gatsbyImageData	
								file {
									url
								}
							}
						}
						position
						totalPoints
					}	
				}
			}
		}
	}
`

export default CurrentStandingsPage
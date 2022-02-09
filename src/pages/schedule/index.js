import * as React from 'react'
import { graphql } from 'gatsby'
import Schedule from '../../templates/schedule'

const ScheduleIndexPage = props => <Schedule {...props}/>

export const query = graphql`
	query ScheduleIndexQuery {
		season: simRacerHubSeason(
			active: {eq: true}
		) {
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
				...eventData
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

export default ScheduleIndexPage
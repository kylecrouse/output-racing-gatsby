import * as React from 'react'
import { graphql } from 'gatsby'
import Cars from '../components/cars'
import Layout from '../components/layout'
import Meta from '../components/meta'
import Seasons from '../components/seasons'
import StandingsTable from '../components/standingsTable'

const StandingsTemplate = (props) => {
	const { season } = props.data
	
	const seasons = React.useMemo(
		() => props.data.seasons.edges.map(
			({ node }) => node
		), 
		[props.data.seasons]
	)

	const { totalRounds, roundsCompleted } = React.useMemo(
		() => season.events.reduce(
			(a, { pointsCount, chase, offWeek, race }) => {
				if (pointsCount && !chase && !offWeek) {
					a.totalRounds++
					if (race) a.roundsCompleted++
				}
				return a
			},
			{ totalRounds: 0, roundsCompleted: 0 }
		),
		[season.events]
	)

	return (
		<Layout {...props}>
			<Meta {...props}/>
			<main className="container">
	
				<div className="columns">
					<div className="column col-8 col-xl-12 col-mx-auto content">
				
						<hgroup className="page-header columns">
							<div>
								<h2 className="page-title">Standings</h2>
								<h3 className="page-subtitle">
									<span>{ season.seasonName }</span>
									<span>{	roundsCompleted < totalRounds
											? `Round ${roundsCompleted} of ${totalRounds}`
											: 'Final'
									}</span>
								</h3>
							</div>
							{ season.seasonClass?.length > 0 &&
								<Cars cars={season.seasonClass[0]?.seasonClassCars} />
							}
						</hgroup>
	
						<StandingsTable
							standings={ season.standings }
							fields={ column => ['laps'].includes(column) }
						/>
							
					</div>
				</div>
					
			</main>
	
			<div className="columns seasons-container">
				<div className="column col-8 col-xl-12 col-mx-auto">
					<Seasons path={`${props.pageContext.seriesName}/standings`} seasons={seasons} />
				</div>
			</div>
			
		</Layout>
	)
}

export const query = graphql`
	query StandingsQuery($seriesId: Int, $seasonId: Int) {
		season: simRacerHubSeason(seasonId: {eq: $seasonId}) {
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
					raceId
				}
			}
			standings {
				...standingsData
			}	
		}
		seasons: allSimRacerHubSeason(
			sort: {fields: events___raceDate, order: DESC}
			filter: {seriesId: {eq: $seriesId}, seasonId: {ne: $seasonId}}
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
							...driverChipData
						}
						position
						totalPoints
					}	
				}
			}
		}
	}
`

export default StandingsTemplate
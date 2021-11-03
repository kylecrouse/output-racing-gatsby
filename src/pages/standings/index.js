import * as React from 'react'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'
import Cars from '../../components/cars'
import Seasons from '../../components/seasons'
import Standings from '../../components/standings'

const StandingsPage = ({ data }) => {
	const season = data.league.activeSeason;
	return (
		<main>

			<Helmet>
				<meta charSet="utf-8" />
				<title>Output Racing League | Standings | {season.name.replace('Output Racing ', '')}</title>
				<link rel="stylesheet" href="https://use.typekit.net/ovc0kir.css"/>
			</Helmet>
			
			<div className="content container">

				<hgroup className="page-header columns">
					<div className="column col-8 col-xl-12 col-mx-auto">
						<h2 className="page-title">Standings</h2>
						{ data.league.activeSeason.cars &&
							<Cars 
								cars={
									data.league.cars.filter(
										({ name }) => data.league.activeSeason.cars.includes(name)
									)
								} 
							/>
						}
					</div>
				</hgroup>

				<div className="columns">
					<div className="column col-8 col-xl-12 col-mx-auto">
			
						<Standings 
							standings={
								season.standings.map(row => ({
									...row, 
									driver: data.drivers.nodes.find(({ name }) => name === row.driver)
								}))
							}
						/>
						
					</div>
				</div>
				
				<div className="columns seasons-container">
					<div className="column col-8 col-xl-12 col-mx-auto">
				
						<Seasons 
							path="standings" 
							seasons={data.league.seasons.filter(({ id }) => id !== season.id)} 
							cars={data.league.cars}
							drivers={data.drivers.nodes}
						/>
					
					</div>
				</div>

			</div>			

		</main>
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

export default StandingsPage
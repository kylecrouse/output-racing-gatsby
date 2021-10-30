import * as React from "react"
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import License from '../../components/license'
import './driver.css'

const DriverPage = ({ data }) => {
	const driver = data.driver
	const stats = data.stats
	return (
		<main>
			
			<Helmet>
				<meta charSet="utf-8" />
				<title>Output Racing League | Drivers | { driver.nickname || driver.name }</title>
			</Helmet>

			{ driver.media && 
				driver.media
					.slice(0, 1)
					.map(image => (
						<GatsbyImage 
							alt="car screenshot"
							className="driver-image"
							image={ getImage(image) } 
						/>
					)) 
			}
			
			<div className="container content">

				<div className="columns">   
					<div className="column col-8 col-xl-12 col-mx-auto">
					
						<div className="columns" style={{ display: "flex", alignItems: "center" }}>
							<div className="column col-6 col-sm-4">
								{ driver.numberArt &&
										<img 
											alt={ driver.number }
											src={ driver.numberArt.file.url } 
											style={{ 
												display: "block", 
												width: "100%", 
												margin: "0 20px 0 auto", 
												maxWidth: "200px" 
											}}
										/>
								}
							</div>
							<div className="column col-6 col-sm-8 col-mx-auto">
								<h2>{driver.nickname || driver.name}</h2>
								{ driver.license && 
									<License {...driver.license}/>
								}
							</div>
						</div>
						
						{ Object.keys(stats).length > 0 &&
							<>
								<h4 className="text-center" style={{ margin: "2rem 0 1rem" }}>Output Racing League Career Stats</h4>
								<table>
									<thead>
										<tr>
											<th>Starts</th>
											<th>Wins</th>
											<th>Top 5s</th>
											<th>Poles</th>
											<th>Avg Start</th>
											<th>Avg Finish</th>
											<th>Total Laps</th>
											<th>Laps Led</th>
											<th>Inc/Race</th>
											<th>Win %</th>
											<th>Top 5 %</th>
											<th>Led %</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>{stats.starts}</td>
											<td>{stats.wins}</td>
											<td>{stats.top5s}</td>
											<td>{stats.poles}</td>
											<td>{stats.avgStart}</td>
											<td>{stats.avgFinish}</td>
											<td>{stats.laps}</td>
											<td>{stats.lapsLed}</td>
											<td>{stats.incidentsRace}</td>
											<td>{stats.winPercentage}</td>
											<td>{stats.top5Percentage}</td>
											<td>{((parseInt(stats.lapsLed.replace(',','')) / parseInt((stats.laps || '0').replace(',',''))) * 100).toFixed(0)}%</td>
										</tr>
									</tbody>
								</table>
							</>
						}
		
						{ driver.careerStats &&
							<>
								<h4 className="text-center" style={{ margin: "2rem 0 1rem" }}>iRacing Career Stats</h4>
								<table>
									<thead>
										<tr>
											<th>Starts</th>
											<th>Wins</th>
											<th>Top 5s</th>
											<th>Poles</th>
											<th>Avg Start</th>
											<th>Avg Finish</th>
											<th>Total Laps</th>
											<th>Laps Led</th>
											<th>Inc/Race</th>
											<th>Win %</th>
											<th>Top 5 %</th>
											<th>Led %</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>{driver.careerStats.starts}</td>
											<td>{driver.careerStats.wins}</td>
											<td>{driver.careerStats.top5}</td>
											<td>{driver.careerStats.poles}</td>
											<td>{driver.careerStats.avgStart}</td>
											<td>{driver.careerStats.avgFinish}</td>
											<td>{driver.careerStats.totalLaps}</td>
											<td>{driver.careerStats.lapsLed}</td>
											<td>{driver.careerStats.avgIncPerRace.toFixed(2)}</td>
											<td>{driver.careerStats.winPerc.toFixed(0)}%</td>
											<td>{driver.careerStats.top5Perc.toFixed(0)}%</td>
											<td>{driver.careerStats.lapsLedPerc.toFixed(0)}%</td>
										</tr>
									</tbody>
								</table>
							</>
						}
					
					</div>
				</div>
				
			</div>

		</main>
	)
}

export const query = graphql`
	query DriverQuery($name: String) {
		driver: contentfulDriver(name: {eq: $name}) {
			name
			nickname
			number
			numberArt {
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
			license {
				iRating
				licColor
				licGroup
				licGroupDisplayName
				licLevel
				licLevelDisplayName
				srPrime
				srSub
			}
			careerStats {
				avgFinish
				avgIncPerRace
				avgPtsPerRace
				avgStart
				lapsLed
				lapsLedPerc
				poles
				starts
				top5
				top5Perc
				totalLaps
				totalclubpoints
				winPerc
				wins
			}
		}
		stats: contentfulLeagueStatsJsonNode(driver: {eq: $name}) {
			avgFinish
			avgStart
			incidents
			incidentsLap
			incidentsRace
			laps
			lapsLed
			miles
			polePercentage
			poles
			provisionals
			races
			starts
			top10Percentage
			top10s
			top5Percentage
			top5s
			winPercentage
			wins
		}	
	}
`

export default DriverPage
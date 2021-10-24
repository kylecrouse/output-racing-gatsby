import * as React from 'react'
import { graphql } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import moment from 'moment'
import DriverChip from '../../components/driverChip'
import Video from '../../components/Video'

const LatestPage = ({ data }) => {
	const race = data.race.nodes[0];
	const track = data.league.tracks.find(({ name }) => race.track.includes(name))
	const logo = getImage(track.logo)
	return (
		<main>

			<div className="columns" style={{ marginBottom: "2rem", alignItems: "center" }}>
				<div className="column col-4 col-sm-12 text-center">
					{ race.logo
							? <img src={ race.logo.file.url } alt={`${race.name} logo`} style={{ display: "block", height: "100%", maxHeight: "150px", margin: "0 auto", maxWidth: "100%" }} />
							: <h3 style={{ marginBottom: "2rem" }}>{race.name}</h3>
					}
				</div>
				<div className="column col-4 col-sm-12 text-center">
					<ul className="text-center" style={{ listStyle: "none", marginBottom: "1rem" }}>
						<li><b>{track.name}</b></li>
						<li>{moment.parseZone(race.date).format('MMMM Do, YYYY')}</li>
						<li style={{ marginTop: "0.5rem", fontSize: "0.6rem" }}>{race.laps} laps ({race.duration})</li>
						<li style={{ fontSize: "0.6rem" }}>{race.cautions} cautions for {race.cautionLaps} laps</li>
						<li style={{ fontSize: "0.6rem" }}>{race.leadChanges} lead changes between {race.leaders} drivers</li>
					</ul>
				</div>
				<div className="column col-4 col-sm-12">
					<GatsbyImage image={logo} alt={`${track.name} logo`} style={{ display: "block", height: "100%", maxHeight: "150px", margin: "0 auto", maxWidth: "100%" }} />
				</div>
			</div>

			<table>
				<thead>
					<tr>
						<th width="2%">F</th>
						<th width="2%">S</th>
						<th>Driver</th>
						<th width="7%">Points</th>
						<th width="7%">Interval</th>
						<th width="7%">Laps</th>
						<th width="7%">Led</th>
						<th width="7%">Fastest</th>
						<th width="7%">Average</th>
						<th width="7%">Inc</th>
						<th width="7%">Status</th>
					</tr>
				</thead>
				<tbody>
					{ race.results
							.sort((a, b) => parseInt(a.finish, 10) > parseInt(b.finish, 10))
							.map(props => {
								const driver = data.drivers.nodes.find(({ name }) => name === props.name)
								return (
									<tr key={props.id} style={{ opacity: driver.active ? 1 : 0.3 }}>
										<td>{props.finish}</td>
										<td>{props.start}</td>
										<td><DriverChip {...driver}/></td>
										<td>{parseInt(props.points, 10) + parseInt(props.bonus, 10) + parseInt(props.penalty, 10)}</td>
										<td>{props.interval}</td>
										<td>{props.completed}</td>
										<td>{props.led}</td>
										<td>{props.fastest}</td>
										<td>{props.average}</td>
										<td>{props.incidents}</td>
										<td>{props.status}</td>
									</tr>
								)
							}) 
					}
				</tbody>
			</table>
			
			{ race.broadcast && 
				<Video src={race.broadcast} style={{ marginTop: "3rem" }}/> 
			}

			<div style={{ marginTop: "2rem" }}>
				{ race.media && race.media.map((image) => {
						return (
							<img src={ image.file.url } style={{ width: "100%", marginBottom: "2rem" }}  alt="screenshot"/>
						)
					}) 
				}
			</div>

		</main>
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
				broadcast
				cautionLaps
				cautions
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
			}
		}
		league: contentfulLeague(leagueId: {eq: 2732}) {
			tracks {
				name
				logo {
					childImageSharp {
						gatsbyImageData(height: 150)
					}					
				}
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

export default LatestPage
import * as React from 'react'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'
import moment from 'moment'
import Results from '../../components/results'
import Video from '../../components/video'

const ResultsPage = ({ data }) => {
	const race = data.race;
	const track = data.league.tracks.find(({ name }) => race.track.includes(name))
	return (
		<main>

			<Helmet>
				<meta charSet="utf-8" />
				<title>Output Racing League | Results | { race.name }</title>
			</Helmet>

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
					<img src={track.logo} alt={`${track.name} logo`} style={{ display: "block", height: "100%", maxHeight: "150px", margin: "0 auto", maxWidth: "100%" }} />
				</div>
			</div>

			<Results 
				results={
					race.results.map(item => ({
						...item,
						driver: data.drivers.nodes.find(({ name }) => name === item.name)
					}))
				}
			/>
			

			
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
	query ResultsQuery($raceId: Int) {
		race: contentfulRace(raceId: {eq: $raceId}) {
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
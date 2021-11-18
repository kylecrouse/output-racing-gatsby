import * as React from 'react'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import moment from 'moment'
import Results from '../../components/results'
import { Carousel, Slide } from '../../components/carousel'
import Video from '../../components/video'
import * as styles from './results.module.scss'

const ResultsPage = ({ data }) => {
	const race = data.race;
	const track = data.league.tracks.find(({ name }) => race.track.includes(name))
	return (
		<>
			<Helmet>
				<title>Output Racing League | Results | { race.name }</title>
			</Helmet>
			
			{ race.media && 
				(race.media.length > 1 
					? (
							<Carousel options={{ type: "carousel", showNav: true }}>
								{ race.media.map((image) => {
										return (
											<Slide>
												<GatsbyImage 
													alt="screenshot"
													className={ styles.media }
													image={ getImage(image) } 
												/>
											</Slide>
										)
									}) 
								}
							</Carousel>
						)
					: race.media.slice(0,1).map((image) => (
							<GatsbyImage 
								alt="screenshot"
								className={ styles.media }
								image={ getImage(image) } 
							/>						
						))
				)
			}

			<main className="container">
			
				<div className="columns">
					<div className="column col-8 col-xl-12 col-mx-auto content">

						<hgroup className={`columns page-header ${styles.header}`}>
							<div className="column col-8">
								<h4 className="page-title">Results</h4>
								<h5 className="page-subtitle">
									<span>{moment.parseZone(race.date).format('DD MMM YYYY')}</span>
									<span>{track.name}</span>
								</h5>
							</div>
							<div className="column col-2 col-ml-auto">
								{ race.logo
									? <img src={ race.logo.file.url } alt={`${race.name} logo`} className={ styles.logo }/>
									: <img src={ track.logo } alt={`${track.name} logo`} className={ styles.logo } />
								}
							</div>
						</hgroup>
			
						<Results 
							results={
								race.results.map(item => ({
									...item,
									driver: data.drivers.nodes.find(({ name }) => name === item.name)
								}))
							}
							duration={race.duration}
							counts={!!race.counts}
							fields={column => ['status', 'bonus', 'penalty', race.counts ? '' : 'points'].includes(column)}
						/>
						
<div className="columns">
<div className="column col-4 col-sm-12 text-center">
	<ul className="text-center" style={{ listStyle: "none", marginBottom: "1rem" }}>
		<li style={{ marginTop: "0.5rem", fontSize: "0.6rem" }}>{race.laps} laps ({race.duration})</li>
		<li style={{ fontSize: "0.6rem" }}>{race.cautions} cautions for {race.cautionLaps} laps</li>
		<li style={{ fontSize: "0.6rem" }}>{race.leadChanges} lead changes between {race.leaders} drivers</li>
	</ul>
</div>
</div>

						{ race.broadcast && 
							<Video src={race.broadcast} className={ styles.broadcast }/> 
						}
						
					</div>
				</div>

			</main>

		</>
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
				gatsbyImageData(
					layout: FULL_WIDTH
					placeholder: BLURRED
				)
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
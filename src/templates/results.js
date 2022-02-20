import * as React from 'react'
import { graphql } from "gatsby"
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import moment from 'moment'
import Layout from '../components/layout'
import Meta from '../components/meta'
import { Carousel, Slide } from '../components/carousel'
import DriverChip from '../components/driverChip'
import ResultsTable from '../components/results'
import Video from '../components/video'
import * as styles from './results.module.scss'

const ResultsTemplate = (props) => {
	const { race, trackLogos } = props.data
	const { node: logoNode = null } = trackLogos.edges.find(({ node }) => Math.floor(node.name) === race.trackConfigId) ?? {}
	return (
		<Layout {...props}>
			<Meta {...props} />
			
			{ race.eventMedia && 
				(race.eventMedia.length > 1 
					? (
							<Carousel options={{ type: "carousel", showNav: true }}>
								{ race.eventMedia.map((image) => {
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
					: race.eventMedia.slice(0,1).map((image) => (
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
					<div className="column col-8 col-xl-10 col-lg-12 col-mx-auto content">

						<hgroup className={`columns page-header ${styles.header}`}>
							<div className="column col-8 col-sm-12">
								<h4 className="page-title">Results</h4>
								<h5 className="page-subtitle">
									<span>{moment.parseZone(race.raceDate).format('DD MMM YYYY')}</span>
									<span>{race.trackName}</span>
								</h5>
							</div>
							{ logoNode?.publicURL &&
								<div className="column col-4 text-right hide-sm">
									<img className={ styles.logo } src={ logoNode.publicURL } alt="track logo"/>
								</div>
							}
						</hgroup>
			
						<ResultsTable 
							{...race}
							duration={race.raceAvgTime * race.raceLaps}
							fields={
								(column) => race.pointsCount !== true 
									&& ['racePoints', 'rating'].includes(column)
							}
						/>
						
						<div className="columns">
							<div className="column col-6 col-sm-12 col-mr-auto">
						
								<div className={ styles.stats }>
									<h3>Race Statistics</h3>
									<dl>
										<dt>Weather ({race.weatherType})</dt>
										<dd>
											{race.weatherSkies}<br/>
											Temperature: {race.weatherTemp}°{race.weatherTempUnit}<br/>
											Humidity: {race.weatherRh}%<br/>
											Fog: {race.weatherFog}%<br/>
											Wind: {race.weatherWindDir} @ {race.weatherWind}{race.weatherWindUnit?.toLowerCase()}
										</dd>
										<dt>Cautions</dt>
										<dd>
											{
												getCautionsText(race.raceCautions, race.raceCautionLaps)
											}
										</dd>
										<dt>Lead Changes</dt>
										<dd>
											{
												getLeadersText(
													race.raceLeadChanges, 
													race.participants.reduce(
														(a, { lapsLed }) => lapsLed > 0 ? ++a : a, 
														0
													)
												)
											}
										</dd>
										<dt>Best Average Position</dt>
										<dd>
											<DriverChip {...race.bestAvgPos.driver}>
												({ (race.bestAvgPos.value + 1).toFixed(1) })
											</DriverChip>
										</dd>
										<dt>Hard Charger</dt>
										<dd>
											<DriverChip {...race.hardCharger.driver}>
												({ race.hardCharger.value })
											</DriverChip>
										</dd>
										<dt>Most Passes</dt>
										<dd>
											<DriverChip {...race.bestPasses.driver}>
												({ race.bestPasses.value })
											</DriverChip>
										</dd>
										<dt>Most Quality Passes</dt>
										<dd>
											<DriverChip {...race.bestQualityPasses.driver}>
												({ race.bestQualityPasses.value })
											</DriverChip>
										</dd>
										<dt>Most Closing Passes</dt>
										<dd>
											<DriverChip {...race.bestClosingPasses.driver}>
												({ race.bestClosingPasses.value })
											</DriverChip>
										</dd>
										<dt>Fastest Lap</dt>
										<dd>
											<DriverChip {...race.bestFastLap.driver}>
												({ getTimeFromMilliseconds(race.bestFastLap.value) })
											</DriverChip>
										</dd>
										<dt>Fastest 3-lap Average</dt>
										<dd>
											<DriverChip {...race.bestAvgFastLap.driver}>
												({ getTimeFromMilliseconds(race.bestAvgFastLap.value) })
											</DriverChip>
										</dd>
										{	race.cautions > 0 &&
											<>
												<dt>Fastest Restarts</dt>
												<dd>
													<DriverChip {...race.bestRestarts.driver}>
														({ getTimeFromMilliseconds(race.bestRestarts.value) })
													</DriverChip>
												</dd>
											</>											
										}
										<dt>Most Fast Laps</dt>
										<dd>
											<DriverChip {...race.bestNumFastLap.driver}>
												({ race.bestNumFastLap.value })
											</DriverChip>
										</dd>
									</dl>
								</div>
							</div>
							<div className="column col-6 col-sm-12 col-ml-auto">
								{ race.eventBroadcast && 
									<Video href={race.eventBroadcast} className={ styles.broadcast }/> 
								}
							</div>
						</div>

						
					</div>
				</div>

			</main>

		</Layout>
	)
}

const getTimeFromMilliseconds = (time) => {
	let hours = Math.floor(time / (3600 * 10000))
	time = time - hours * 3600 * 10000
	let min = Math.floor(time / (60 * 10000))
	time = time - min * 60 * 10000
	let secs = Math.floor(time / 10000)
	time = time - secs * 10000
	const tenths = Math.floor(time / 1000)
	time = time - tenths * 1000
	const hun = Math.floor(time / 100)
	time = time - hun * 100
	const thous = Math.floor(time / 10)
	if (hours) 
		hours += ":"
	else 
		hours = ""
	if (min < 10)
		min = "0" + min
	if (secs < 10)
		secs = "0" + secs
	return hours + min + ":" + secs + "." + tenths + hun + thous
}

const getCautionsText = (raceCautions, raceCautionLaps) => {
	return raceCautions > 0 
		? `${pluralize(raceCautions, 'caution')} for ${pluralize(raceCautionLaps, 'lap')}`
		: 'none'
}

const getLeadersText = (raceLeadChanges, raceLeaders) => {
	return raceLeadChanges > 0
		? `${pluralize(raceLeadChanges, 'lead change')} among ${pluralize(raceLeaders, 'driver')}`
		: 'none'
}

const pluralize = (count, noun, suffix = 's') => {
	return `${count} ${noun}${count !== 1 ? suffix : ''}`
}

export const query = graphql`
	query RaceQuery($raceId: Int) {
		race: simRacerHubRace(
			raceId: {eq: $raceId}
		) {
			...raceData	
		}
		trackLogos: allFile(filter: { relativePath: { glob: "tracks/*.png" } }) {
			edges {
				node {
					name
					publicURL
				}
			}
		}
	}	
`

export default ResultsTemplate
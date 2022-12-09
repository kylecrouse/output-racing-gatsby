import * as React from 'react'
import { graphql } from "gatsby"
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import moment from 'moment'
import Layout from '../components/layout'
import { Carousel, Slide } from '../components/carousel'
import DriverChip from '../components/driverChip'
import ResultsTable from '../components/results'
import Video from '../components/video'
import * as styles from './results.module.scss'

const ResultsTemplate = (props) => {
	const { race, trackLogos } = props.data
	
	// Get track logo
	const { node: logoNode = null } = React.useMemo(
		() => trackLogos.edges.find(
						({ node }) => Math.floor(node.name) === race.schedule.trackConfigId
					) ?? {},
		[trackLogos, race.schedule.trackConfigId]
	)
	
	// Calculate race superlatives
	let bestAvgPos, bestPasses, bestRestarts, bestClosingPasses, bestFastLap, bestQualityPasses, bestAvgFastLap, bestNumFastLap, hardCharger
	
	race.participants.forEach(p => {
		if (p.avgPos > -1 && p.avgPos < (bestAvgPos?.avgPos ?? 999999))
			bestAvgPos = p
		if (p.fastestLapTime > 0 && p.fastestLapTime < (bestFastLap?.fastestLapTime ?? 999999))
			bestFastLap = p
		if (p.fastestRestart > 0 && p.fastestRestart < (bestRestarts?.fastestRestart ?? 999999))
			bestRestarts = p
		if (p.numFastLap > 0 && p.numFastLap > (bestNumFastLap?.numFastLap ?? 0))
			bestNumFastLap = p
		if (p.avgFastLap > 0 && p.avgFastLap > (bestAvgFastLap?.avgFastLap ?? 0))
			bestAvgFastLap = p
		if (p.passes > 0 && p.passes > (bestPasses?.passes ?? 0))
			bestPasses = p
		if (p.qualityPasses > 0 && p.qualityPasses > (bestQualityPasses?.qualityPasses ?? 0))
			bestQualityPasses = p
		if (p.closingPasses > 0 && p.closingPasses > (bestClosingPasses?.closingPasses ?? 0))
			bestClosingPasses = p
		if (p.qualifyTime > 0 && Math.min(p.qualifyPos, 11) - p.finishPos > Math.min(hardCharger?.qualifyPos ?? 0, 11) - (hardCharger?.finishPos ?? 0))
			hardCharger = p
	})		
	
	return (
		<Layout {...props}>
			
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
									<span>{moment.parseZone(race.schedule.raceDate).format('DD MMM YYYY')}</span>
									<span>{race.schedule.trackName}</span>
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
								(column) => race.schedule.pointsCount !== true 
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
										{ bestAvgPos && 
											<>
												<dt>Best Average Position</dt>
												<dd>
													{ 
														renderDriverChip(
															bestAvgPos, 
															`(${ (bestAvgPos.avgPos + 1).toFixed(1) })`
														) 
													}
												</dd>
											</>
										}
										{ hardCharger &&
											<>
												<dt>Hard Charger</dt>
												<dd>
													{ 
														renderDriverChip(
															hardCharger, 
															`(${ Math.min(hardCharger.qualifyPos, 11) - hardCharger.finishPos })`
														) 
													}
												</dd>
											</>
										}
										{ bestPasses && bestPasses.passes > 0 &&
											<>
												<dt>Most Passes</dt>
												<dd>
													{ 
														renderDriverChip(
															bestPasses, 
															`(${ bestPasses.passes })`
														) 
													}
												</dd>
											</>
										}
										{ bestQualityPasses && bestQualityPasses.qualityPasses > 0 &&
												<>
													<dt>Most Quality Passes</dt>
													<dd>
														{ 
															renderDriverChip(
																bestQualityPasses, 
																`(${ bestQualityPasses.qualityPasses })`
															) 
														}
													</dd>											
												</>
										}
										{ bestClosingPasses && bestClosingPasses.closingPasses > 0 &&
												<>
													<dt>Most Closing Passes</dt>
													<dd>
														{ 
															renderDriverChip(
																bestClosingPasses, 
																`(${ bestClosingPasses.closingPasses })`
															) 
														}
													</dd>											
												</>
										}
										{ bestFastLap &&
											<>
												<dt>Fastest Lap</dt>
												<dd>
													{ 
														renderDriverChip(
															bestFastLap, 
															`(${ getTimeFromMilliseconds(bestFastLap.fastestLapTime) })`
														) 
													}
												</dd>
											</>
										}
										{ bestAvgFastLap && 
											<>
												<dt>Fastest 3-lap Average</dt>
												<dd>
													{ 
														renderDriverChip(
															bestAvgFastLap, 
															`(${ getTimeFromMilliseconds(bestAvgFastLap.avgFastLap) })`
														) 
													}
												</dd>
											</>
										}
										{	race.raceCautions > 0 && bestRestarts &&
											<>
												<dt>Fastest Restarts</dt>
												<dd>
													{ 
														renderDriverChip(
															bestRestarts, 
															`(${ getTimeFromMilliseconds(bestRestarts.fastestRestart) })`
														) 
													}
												</dd>
											</>											
										}
										{ bestNumFastLap && 
											<>
												<dt>Most Fast Laps</dt>
												<dd>
													{ 
														renderDriverChip(
															bestNumFastLap, 
															`(${ bestNumFastLap.numFastLap })`
														) 
													}
												</dd>
											</>
										}
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

const renderDriverChip = (d, children = null) => {
	return (
		<DriverChip
			active={!!d.member}
			driverName={d.member?.nickName ?? d.member?.displayName ?? d.driverName}
			carNumber={d.member?.carNumber ?? d.carNumber}
			driverNumberArt={d.member?.driverNumberArt}
			link={false}
		>
			{ children }
		</DriverChip>
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
	if (hours && min < 10)
		min = "0" + min
	if (min && secs < 10)
		secs = "0" + secs
	return `${hours}${min > 0 ? `${min}:` : ``}${secs}.${tenths}${hun}${thous}`
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

// export const query = graphql`
// 	query RaceQuery($raceId: Int) {
// 		race: mysqlRace(race_id: {eq: $raceId}) {
// 			raceId: race_id
// 			eventBroadcast
// 			eventLogo {
// 				gatsbyImageData	
// 			}
// 			eventMedia {
// 				gatsbyImageData(
// 					layout: FULL_WIDTH
// 					placeholder: BLURRED
// 				)
// 			}
// 			weatherFog: weather_fog
// 			weatherRh: weather_rh
// 			weatherSkies: weather_skies
// 			weatherTemp: weather_temp
// 			weatherTempUnit: weather_tempunit
// 			weatherType: weather_type
// 			weatherWind: weather_wind
// 			weatherWindDir: weather_winddir
// 			weatherWindUnit: weather_windunit
// 			raceAvgTime: race_avg_time
// 			raceCautions: race_cautions
// 			raceCautionLaps: race_caution_laps
// 			raceLaps: race_laps
// 			raceLeadChanges: race_lead_changes
// 			participants {
// 				driverId: driver_id
// 				driverName: driver_name
// 				member {
// 					displayName: display_name
// 					nickName: nick_name
// 					carNumber: car_number
// 					driverNumberArt {
// 						gatsbyImageData	
// 						file {
// 							url
// 						}
// 					}
// 				}
// 				carId: car_iracing_id
// 				carName: car_name
// 				carImage {
// 					publicURL
// 				}
// 				finishPos: finish_pos
// 				incidents
// 				interval: intv
// 				lapsLed: laps_led
// 				lapsCompleted: num_laps
// 				qualifyPos: qualify_pos
// 				qualifyTime: qualify_time
// 				fastestLapTime: fastest_lap_time
// 				racePoints: race_points
// 				avgLap: avg_lap
// 				status
// 				avgPos: avg_pos
// 				arp
// 				avgFastLap: avg_fast_lap
// 				numFastLap: num_fast_lap
// 				fastestRestart: fastest_restart
// 				passes
// 				qualityPasses: quality_passes
// 				closingPasses: closing_passes
// 				rating
// 				bonuses {
// 					bonusDesc: bonus_descr
// 					bonusPoints: bonus_points
// 				}
// 				penalties {
// 					penaltyDesc: penalty_descr
// 					penaltyPoints: penalty_points
// 				}
// 			}
// 			schedule {
// 				eventName: event_name
// 				pointsCount: points_count
// 				trackName: track_name
// 				trackConfigId: track_config_iracing_id
// 				trackConfigName: track_config_name
// 				trackTypeId: track_type_id
// 				raceDate: race_date
// 				raceTime: race_time
// 			}
// 		}
// 		trackLogos: allFile(filter: { relativePath: { glob: "tracks/*.png" } }) {
// 			edges {
// 				node {
// 					name
// 					publicURL
// 				}
// 			}
// 		}
// 	}	
// `

export default ResultsTemplate
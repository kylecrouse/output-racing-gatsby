import * as React from 'react'
import { Helmet } from 'react-helmet'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import moment from 'moment'
import useSiteMetadata from '../hooks/use-site-metadata'
import { Carousel, Slide } from '../components/carousel'
import DriverChip from '../components/driverChip'
import ResultsTable from '../components/results'
import Video from '../components/video'
import * as styles from './results.module.scss'

const ResultsTemplate = ({ pageContext, location }) => {
	const { title, siteUrl } = useSiteMetadata()
	return (
		<>
			<Helmet>
				<title>{ title } | Results | { pageContext.eventName }</title>
				{ pageContext.logo
					? <meta property="og:image" content={`http:${pageContext.eventLogo.file.url}`} />
					: pageContext.media
						? <meta property="og:image" content={`http:${pageContext.media[0].file.url}`} />
						: <meta property="og:image" content={`http:${pageContext.trackLogo}`} />
				}
				<meta property="og:description" content={`Race results from ${pageContext.trackName}.`} />
				<meta property="og:title" content={ `${title} | ${pageContext.eventName}` } />
				<meta property="og:type" content="website"/>
				<meta property="og:url" content={ `${siteUrl}${location.pathname}` } />
				<meta name="twitter:card" content="summary_large_image"/>
				<meta name="twitter:title" content={ `${title} | ${pageContext.eventName}` } />
				<meta name="twitter:description" content={`Race results from ${pageContext.trackName}.`} />
				{ pageContext.logo
					? <meta name="twitter:image" content={`http:${pageContext.eventLogo.file.url}`} />
					: pageContext.media
						? <meta name="twitter:image" content={`http:${pageContext.media[0].file.url}`} />
						: <meta name="twitter:image" content={`http:${pageContext.trackLogo}`} />
				}
				<meta name="theme-color" content="#000000"/>
			</Helmet>
			
			{ pageContext.eventMedia && 
				(pageContext.eventMedia.length > 1 
					? (
							<Carousel options={{ type: "carousel", showNav: true }}>
								{ pageContext.eventMedia.map((image) => {
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
					: pageContext.eventMedia.slice(0,1).map((image) => (
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
									<span>{moment.parseZone(pageContext.raceDate).format('DD MMM YYYY')}</span>
									<span>{pageContext.trackName}</span>
								</h5>
							</div>
							<div className="column col-4 text-right hide-sm">
								<img 
									alt={`${pageContext.trackName} logo`} 
									className={ styles.logo } 
									src={ `https://images-static.iracing.com${pageContext.trackLogo}` } 
								/>
							</div>
						</hgroup>
			
						<ResultsTable 
							{...pageContext}
							duration={pageContext.raceAvgTime * pageContext.raceLaps}
							fields={
								(column) => pageContext.pointsCount !== true 
									&& ['racePoints', 'rating'].includes(column)
							}
						/>
						
						<div className="columns">
							<div className="column col-6 col-sm-12 col-mr-auto">
						
								<div className={ styles.stats }>
									<h3>Race Statistics</h3>
									<dl>
										<dt>Weather ({pageContext.weatherType})</dt>
										<dd>
											{pageContext.weatherSkies}<br/>
											Temperature: {pageContext.weatherTemp}°{pageContext.weatherTempunit}<br/>
											Humidity: {pageContext.weatherRh}%<br/>
											Fog: {pageContext.weatherFog}%<br/>
											Wind: {pageContext.weatherWinddir} @ {pageContext.weatherWind}{pageContext.weatherWindunit.toLowerCase()}
										</dd>
										<dt>Cautions</dt>
										<dd>
											{
												getCautionsText(pageContext.raceCautions, pageContext.raceCautionLaps)
											}
										</dd>
										<dt>Lead Changes</dt>
										<dd>
											{
												getLeadersText(
													pageContext.raceLeadChanges, 
													pageContext.participants.reduce(
														(a, { lapsLed }) => lapsLed > 0 ? ++a : a, 
														0
													)
												)
											}
										</dd>
										<dt>Best Average Position</dt>
										<dd>
											<DriverChip {...pageContext.bestAvgPos.driver}>
												({ (pageContext.bestAvgPos.avgPos + 1).toFixed(1) })
											</DriverChip>
										</dd>
										<dt>Hard Charger</dt>
										<dd>
											<DriverChip {...pageContext.hardCharger.driver}>
												({ pageContext.hardCharger.gain })
											</DriverChip>
										</dd>
										<dt>Most Passes</dt>
										<dd>
											<DriverChip {...pageContext.bestPasses.driver}>
												({ pageContext.bestPasses.passes })
											</DriverChip>
										</dd>
										<dt>Most Quality Passes</dt>
										<dd>
											<DriverChip {...pageContext.bestQualityPasses.driver}>
												({ pageContext.bestQualityPasses.qualityPasses })
											</DriverChip>
										</dd>
										<dt>Most Closing Passes</dt>
										<dd>
											<DriverChip {...pageContext.bestClosingPasses.driver}>
												({ pageContext.bestClosingPasses.closingPasses })
											</DriverChip>
										</dd>
										<dt>Fastest Lap</dt>
										<dd>
											<DriverChip {...pageContext.bestFastLap.driver}>
												({ getTimeFromMilliseconds(pageContext.bestFastLap.fastestLapTime * 10000) })
											</DriverChip>
										</dd>
										<dt>Fastest 3-lap Average</dt>
										<dd>
											<DriverChip {...pageContext.bestAvgFastLap.driver}>
												({ getTimeFromMilliseconds(pageContext.bestAvgFastLap.avgFastLap) })
											</DriverChip>
										</dd>
										{	pageContext.cautions > 0 &&
											<>
												<dt>Fastest Restarts</dt>
												<dd>
													<DriverChip {...pageContext.bestRestarts.driver}>
														({ getTimeFromMilliseconds(pageContext.bestRestarts.time) })
													</DriverChip>
												</dd>
											</>											
										}
										<dt>Most Fast Laps</dt>
										<dd>
											<DriverChip {...pageContext.bestNumFastLap.driver}>
												({ pageContext.bestNumFastLap.numFastLap })
											</DriverChip>
										</dd>
									</dl>
								</div>
							</div>
							<div className="column col-6 col-sm-12 col-ml-auto">
								{ pageContext.eventBroadcast && 
									<Video href={pageContext.eventBroadcast} className={ styles.broadcast }/> 
								}
							</div>
						</div>

						
					</div>
				</div>

			</main>

		</>
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

export default ResultsTemplate
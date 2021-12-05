import * as React from 'react'
import { Helmet } from 'react-helmet'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import moment from 'moment'
import useSiteMetadata from '../hooks/use-site-metadata'
import { Carousel, Slide } from '../components/carousel'
import DriverChip from '../components/driverChip'
import Results from '../components/results'
import Video from '../components/video'
import * as styles from './results.module.scss'

const ResultsTemplate = ({ pageContext, location }) => {
	const { title, siteUrl } = useSiteMetadata()
	return (
		<>
			<Helmet>
				<title>{ title } | Results | { pageContext.name }</title>
				{ pageContext.logo
					? <meta property="og:image" content={`http:${pageContext.logo.file.url}`} />
					: pageContext.media
						? <meta property="og:image" content={`http:${pageContext.media[0].file.url}`} />
						: <meta property="og:image" content={`http:${pageContext.track.logo}`} />
				}
				<meta property="og:description" content={`Race results from ${pageContext.track.name}.`} />
				<meta property="og:title" content={ `${title} | ${pageContext.name}` } />
				<meta property="og:type" content="website"/>
				<meta property="og:url" content={ `${siteUrl}${location.pathname}` } />
				<meta name="twitter:card" content="summary_large_image"/>
				<meta name="twitter:title" content={ `${title} | ${pageContext.name}` } />
				<meta name="twitter:description" content={`Race results from ${pageContext.track.name}.`} />
				{ pageContext.logo
					? <meta name="twitter:image" content={`http:${pageContext.logo.file.url}`} />
					: pageContext.media
						? <meta name="twitter:image" content={`http:${pageContext.media[0].file.url}`} />
						: <meta name="twitter:image" content={`http:${pageContext.track.logo}`} />
				}
				<meta name="theme-color" content="#F4A913"/>
			</Helmet>
			
			{ pageContext.media && 
				(pageContext.media.length > 1 
					? (
							<Carousel options={{ type: "carousel", showNav: true }}>
								{ pageContext.media.map((image) => {
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
					: pageContext.media.slice(0,1).map((image) => (
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
									<span>{moment.parseZone(pageContext.date).format('DD MMM YYYY')}</span>
									<span>{pageContext.track.name}</span>
								</h5>
							</div>
							<div className="column col-2 col-ml-auto hide-sm">
								{ pageContext.logo
									? <img src={ pageContext.logo.file.url } alt={`${pageContext.name} logo`} className={ styles.logo }/>
									: <img src={ pageContext.track.logo } alt={`${pageContext.track.name} logo`} className={ styles.logo } />
								}
							</div>
						</hgroup>
			
						<Results 
							results={pageContext.results}
							duration={pageContext.duration}
							counts={!!pageContext.counts}
							fields={column => ['status', 'bonus', 'penalty', pageContext.counts !== true && 'points', (pageContext.counts !== true || !pageContext.subsessionId) && 'rating'].includes(column)}
						/>
						
						<div className="columns">
							<div className="column col-6 col-sm-12 col-mr-auto">
						
								<div className={ styles.stats }>
									<h3>Race Statistics</h3>
									<dl>
										<dt>Cautions</dt>
										<dd>{pageContext.cautions > 0 ? pageContext.cautions : 'none'} { pageContext.cautions > 0 && `${pageContext.cautions > 1 ? 'cautions' : 'caution'} for ${pageContext.cautionLaps} laps`}</dd>
										<dt>Lead Changes</dt>
										<dd>{pageContext.leadChanges > 0 ? pageContext.leadChanges : 'none'} { pageContext.leadChanges > 0 && `lead changes between ${pageContext.leaders} drivers`}</dd>
										{	Object.keys(pageContext.stats).length > 0 &&
											<>
												<dt>Best Average Position</dt>
												<dd>
													<DriverChip {...pageContext.stats.bestAvgPos.driver}>
														({ (pageContext.stats.bestAvgPos.avgPos + 1).toFixed(1) })
													</DriverChip>
												</dd>
												<dt>Hard Charger</dt>
												<dd>
													<DriverChip {...pageContext.stats.hardCharger.driver}>
														({ pageContext.stats.hardCharger.gain })
													</DriverChip>
												</dd>
												<dt>Most Passes</dt>
												<dd>
													<DriverChip {...pageContext.stats.bestPasses.driver}>
														({ pageContext.stats.bestPasses.passes })
													</DriverChip>
												</dd>
												<dt>Most Quality Passes</dt>
												<dd>
													<DriverChip {...pageContext.stats.bestQualityPasses.driver}>
														({ pageContext.stats.bestQualityPasses.qualityPasses })
													</DriverChip>
												</dd>
												<dt>Most Closing Passes</dt>
												<dd>
													<DriverChip {...pageContext.stats.bestClosingPasses.driver}>
														({ pageContext.stats.bestClosingPasses.closingPasses })
													</DriverChip>
												</dd>
												<dt>Fastest Lap</dt>
												<dd>
													<DriverChip {...pageContext.stats.bestFastLap.driver}>
														({ getTimeFromMilliseconds(pageContext.stats.bestFastLap.time) })
													</DriverChip>
												</dd>
												<dt>Fastest 3-lap Average</dt>
												<dd>
													<DriverChip {...pageContext.stats.bestAvgFastLap.driver}>
														({ getTimeFromMilliseconds(pageContext.stats.bestAvgFastLap.avgFastLap) })
													</DriverChip>
												</dd>
												{	pageContext.cautions > 0 &&
													<>
														<dt>Fastest Restarts</dt>
														<dd>
															<DriverChip {...pageContext.stats.bestRestarts.driver}>
																({ getTimeFromMilliseconds(pageContext.stats.bestRestarts.time) })
															</DriverChip>
														</dd>
													</>											
												}
												<dt>Most Fast Laps</dt>
												<dd>
													<DriverChip {...pageContext.stats.bestNumFastLap.driver}>
														({ pageContext.stats.bestNumFastLap.numFastLap })
													</DriverChip>
												</dd>
											</>											
										}
									</dl>
								</div>
							</div>
							<div className="column col-6 col-sm-12 col-ml-auto">
								{ pageContext.broadcast && 
									<Video href={pageContext.broadcast} className={ styles.broadcast }/> 
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

export default ResultsTemplate
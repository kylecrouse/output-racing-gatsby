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
										<dd>{pageContext.cautions} cautions for {pageContext.cautionLaps} laps</dd>
										<dt>Lead Changes</dt>
										<dd>{pageContext.leadChanges} lead changes between {pageContext.leaders} drivers</dd>
										{/*
										<dt>Best Average Position</dt>
										<dd>
											<DriverChip {...data.drivers.nodes.find(({ name }) => name === "Christian Budd")}>(1.29)</DriverChip>
										</dd>
										<dt>Hard Charger</dt>
										<dd>
											<DriverChip {...data.drivers.nodes.find(({ name }) => name === "Thomas Harmon2")}>(8)</DriverChip>
										</dd>
										<dt>Most Passes</dt>
										<dd>
											<DriverChip {...data.drivers.nodes.find(({ name }) => name === "Thomas Harmon2")}>(10)</DriverChip>
										</dd>
										<dt>Most Quality Passes</dt>
										<dd>
											<DriverChip {...data.drivers.nodes.find(({ name }) => name === "Thomas Harmon2")}>(7)</DriverChip>
										</dd>
										<dt>Most Closing Passes</dt>
										<dd>
											<DriverChip {...data.drivers.nodes.find(({ name }) => name === "Thomas Harmon2")}>(3)</DriverChip>
										</dd>
										<dt>Fastest Lap</dt>
										<dd>
											<DriverChip {...data.drivers.nodes.find(({ name }) => name === "Brian Chambliss")}>(32.563)</DriverChip>
										</dd>
										<dt>Most Fast Laps</dt>
										<dd>
											<DriverChip {...data.drivers.nodes.find(({ name }) => name === "Brian Chambliss")}>(5)</DriverChip>
										</dd>
										<dt>Fastest 3 Laps Average</dt>
										<dd>
											<DriverChip {...data.drivers.nodes.find(({ name }) => name === "Christian Budd")}>(32.650)</DriverChip>
										</dd>
										<dt>Fastest on Restarts</dt>
										<dd>
											<DriverChip {...data.drivers.nodes.find(({ name }) => name === "Chris Champeau")}>(32.650)</DriverChip>
										</dd>
										*/}
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

export default ResultsTemplate
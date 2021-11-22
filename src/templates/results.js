import * as React from 'react'
import { Helmet } from 'react-helmet'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import moment from 'moment'
import { Carousel, Slide } from '../components/carousel'
import DriverChip from '../components/driverChip'
import Results from '../components/results'
import Video from '../components/video'
import * as styles from './results.module.scss'

const ResultsTemplate = ({ pageContext }) => {
	console.log(pageContext.raceId, JSON.stringify(pageContext).length)
	return (
		<>
			<Helmet>
				<title>Output Racing League | Results | { pageContext.name }</title>
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
					<div className="column col-8 col-xl-12 col-mx-auto content">

						<hgroup className={`columns page-header ${styles.header}`}>
							<div className="column col-8">
								<h4 className="page-title">Results</h4>
								<h5 className="page-subtitle">
									<span>{moment.parseZone(pageContext.date).format('DD MMM YYYY')}</span>
									<span>{pageContext.track.name}</span>
								</h5>
							</div>
							<div className="column col-2 col-ml-auto">
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
							fields={column => ['status', 'bonus', 'penalty', pageContext.counts !== true && 'points'].includes(column)}
						/>
						
						<div className="columns">
							<div className="column col-6 col-mr-auto">
						
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
							<div className="column col-6 col-ml-auto">
								{ pageContext.broadcast && 
									<Video src={pageContext.broadcast} className={ styles.broadcast }/> 
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
import * as React from 'react'
import { Helmet } from 'react-helmet'
import useSiteMetadata from '../hooks/use-site-metadata'
import Cars from '../components/cars'
import Seasons from '../components/seasons'
import Standings from '../components/standings'
import logo from '../images/logo.png'

const StandingsTemplate = ({ pageContext, location }) => {
	const { season, seasons, drivers, cars } = pageContext
	const { title, siteUrl } = useSiteMetadata()
	const name = season.name.match(/Output Racing (\d+) (Season \d)?(.*)/)	
	const roundsCompleted = season.schedule.filter(({ counts, uploaded }) => counts && uploaded).length || 0
	const totalRounds = season.schedule.filter(({ counts }) => counts).length
	return (
		<>
			<main className="container">
	
				<Helmet>
					<title>Output Racing League | Standings | {season.name.replace('Output Racing ', '')}</title>
					<meta property="og:image" content={`${siteUrl}${logo}`} />
					<meta property="og:description" content={`An asphalt oval league for the late-night racer.`} />
					<meta property="og:title" content={ `${title} | ${name[2]} ${name[3]} Standings` } />
					<meta property="og:type" content="website"/>
					<meta property="og:url" content={ `${siteUrl}${location.pathname}` } />
					<meta name="twitter:card" content="summary_large_image"/>
					<meta name="twitter:title" content={ `${title} | ${name[2]} ${name[3]} Standings` } />
					<meta name="twitter:description" content={`An asphalt oval league for the late-night racer.`} />
					<meta name="twitter:image" content={`${siteUrl}${logo}`} />
					<meta name="theme-color" content="#F4A913"/>
				</Helmet>
				
				<div className="columns">
					<div className="column col-8 col-xl-12 col-mx-auto content">
				
						<hgroup className="page-header columns">
							<div>
								<h2 className="page-title">Standings</h2>
								<h3 className="page-subtitle">
									<span>{ `${name[2]} ${name[3]}` }</span>
									<span>{	roundsCompleted < totalRounds
											? `Round ${roundsCompleted} of ${totalRounds}`
											: 'Final'
									}</span>
								</h3>
							</div>
							{ season.cars &&
								<Cars 
									cars={
										cars.filter(
											({ name }) => season.cars.includes(name)
										)
									} 
								/>
							}
						</hgroup>
	
						<Standings 
							standings={ season.standings }
							fields={ column => ['laps'].includes(column) }
						/>
							
					</div>
				</div>
					
			</main>
	
			<div className="columns seasons-container">
				<div className="column col-8 col-xl-12 col-mx-auto">
				
					<Seasons 
						path="standings" 
						seasons={seasons.filter(({ id }) => id !== season.id)} 
						cars={cars}
						drivers={drivers}
					/>
				
				</div>
			</div>
			
		</>
	)
}

export default StandingsTemplate
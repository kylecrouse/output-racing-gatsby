import * as React from 'react'
import { Helmet } from 'react-helmet'
import useSiteMetadata from '../hooks/use-site-metadata'
import Schedule from '../components/schedule'
import Seasons from '../components/seasons'
import logo from '../images/logo.png'

const ScheduleTemplate = ({ pageContext, location }) => {
	const { title, siteUrl } = useSiteMetadata()
	const { season, seasons, cars, drivers } = pageContext
	const name = season.name.match(/Output Racing (\d+) (Season \d)?(.*)/)	
	return (
		<>
			<main className="container">
	
				<Helmet>
					<title>Output Racing League | Schedule | { `${name[2]} ${name[3]}` }</title>
					<meta property="og:image" content={`${siteUrl}${logo}`} />
					<meta property="og:description" content={`An asphalt oval league for the late-night racer.`} />
					<meta property="og:title" content={ `${title} | ${name[2]} ${name[3]} Schedule` } />
					<meta property="og:type" content="website"/>
					<meta property="og:url" content={ `${siteUrl}${location.pathname}` } />
					<meta name="twitter:card" content="summary_large_image"/>
					<meta name="twitter:title" content={ `${title} | ${name[2]} ${name[3]} Schedule` } />
					<meta name="twitter:description" content={`An asphalt oval league for the late-night racer.`} />
					<meta name="twitter:image" content={`${siteUrl}${logo}`} />
					<meta name="theme-color" content="#F4A913"/>
				</Helmet>
	
				<div className="columns">
					<div className="column col-8 col-xl-10 col-lg-11 col-sm-12 col-mx-auto content">
					
						<hgroup className="page-header columns">
							<div>
								<h2 className="page-title">Schedule</h2>
								<h3 className="page-subtitle">
									{ `${name[2]} ${name[3]}` }
								</h3>
							</div>
						</hgroup>
	
						<Schedule 
							schedule={ season.schedule }
							drivers={ drivers }
							cars={cars.filter(
								({ name }) => season.cars.includes(name)
							)}
						/>
	
					</div>
				</div>
			
			</main>
					
			<div className="columns seasons-container">
				<div className="column col-8 col-xl-10 col-lg-11 col-mx-auto">
				
					<Seasons 
						path="schedule" 
						seasons={seasons.filter(({ id }) => id !== season.id)} 
						cars={cars}
						drivers={drivers}
					/>
					
				</div>
			</div>
		</>
	)
}

export default ScheduleTemplate
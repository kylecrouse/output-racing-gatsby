import * as React from 'react'
import { Helmet } from 'react-helmet'
import Schedule from './schedule'
import Seasons from './seasons'

const SchedulePage = ({ season, seasons, cars, drivers, tracks }) => {
	const name = season.name.match(/Output Racing (\d+) (Season \d)?(.*)/)	
	return (
		<>
			<main className="container">
	
				<Helmet>
					<title>Output Racing League | Schedule | { `${name[2]} ${name[3]}` }</title>
				</Helmet>
	
				<div className="columns">
					<div className="column col-8 col-xl-12 col-mx-auto content">
					
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
				<div className="column col-8 col-xl-12 col-mx-auto">
				
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

export default SchedulePage
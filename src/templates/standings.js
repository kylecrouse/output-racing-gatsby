import * as React from 'react'
import { Helmet } from 'react-helmet'
import Cars from '../components/cars'
import Seasons from '../components/seasons'
import Standings from '../components/standings'

const StandingsTemplate = ({ pageContext }) => {
	const { season, seasons, drivers, cars } = pageContext
	const name = season.name.match(/Output Racing (\d+) (Season \d)?(.*)/)	
	const roundsCompleted = season.schedule.filter(({ counts, uploaded }) => counts && uploaded).length || 0
	const totalRounds = season.schedule.filter(({ counts }) => counts).length
	return (
		<>
			<main className="container">
	
				<Helmet>
					<title>Output Racing League | Standings | {season.name.replace('Output Racing ', '')}</title>
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
							standings={
								season.standings.map(row => ({
									...row, 
									driver: drivers.find(({ name }) => name === row.driver)
								}))
							}
							fields={column => column === 'laps'}
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
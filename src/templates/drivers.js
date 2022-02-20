import * as React from "react"
import { graphql } from 'gatsby'
import Layout from "../components/layout"
import Meta from "../components/meta"
import DriverCard from '../components/driverCard'

const DriversPage = (props) => {
	const drivers = React.useMemo(
		() => props.data.drivers.edges
			.sort(({ node: a }, { node: b }) => (a.carNumber ? a.carNumber : 1000) - (b.carNumber ? b.carNumber: 1000))
			.map(({ node }, index) => (
				<DriverCard 
					key={`driver-${index}`} 
					{...node} 
					seriesName={props.pageContext.seriesName}
				/>
			)),
		[props.data.drivers, props.pageContext.seriesName]
	)
	return (
		<Layout {...props}>
			<Meta {...props}/>
		
			<main className="container">
							
				<div className="columns">
					<div className="column col-8 col-xl-10 col-lg-12 col-mx-auto content">
					
						<hgroup className="page-header columns">
							<h2 className="page-title">Drivers</h2>
						</hgroup>
				
						{ drivers }
						
					</div>
				</div>
					
			</main>
			
		</Layout>
	)
}

export const query = graphql`
	query DriversQuery {
		drivers: allSimRacerHubDriver(
			filter: {active: {eq: true}}
		) {
			edges {
				node {
					...driverData	
					driverCareerStats {
						starts
						avgStartPos
						avgFinishPos
						wins
						podiums
						top5s
						top10s
						lapsCompleted
						lapsLed
						poles
						incidents
						incidentsPerRace
						winPct
						podiumPct
						top5Pct
						top10Pct
						lapsLedPct
						polePct
						incidentsPerLap
						rating
					}
				}
			}
		}	
	}
`

export default DriversPage
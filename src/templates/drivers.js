import * as React from "react"
import { graphql } from 'gatsby'
import Layout from "../components/Layout"
import Meta from "../components/Meta"
import DriverCard from '../components/driverCard'

const DriversPage = (props) => {
	const drivers = React.useMemo(
		() => props.data.drivers.edges
			.sort(({ node: a }, { node: b }) => (a.carNumber ? a.carNumber : 1000) - (b.carNumber ? b.carNumber: 1000))
			.map(({ node }) => <DriverCard {...node} />),
		[props.data.drivers]
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
				}
			}
		}	
	}
`

export default DriversPage
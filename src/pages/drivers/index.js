import * as React from "react"
import { graphql } from 'gatsby'
import { Helmet } from "react-helmet"
import DriverCard from '../../components/driverCard'

const DriversPage = ({ data }) => {
	const drivers = React.useMemo(
		() => data.drivers.edges
			.sort(({ node: a }, { node: b }) => (a.driverNumber ? a.driverNumber : 1000) - (b.driverNumber ? b.driverNumber: 1000))
			.map(({ node }) => <DriverCard {...node} />),
		[data.drivers]
	)
	return (
		<main className="container">
						
			<Helmet>
				<title>Output Racing League | Drivers</title>
			</Helmet>

			<div className="columns">
				<div className="column col-8 col-xl-10 col-lg-12 col-mx-auto content">
				
					<hgroup className="page-header columns">
						<h2 className="page-title">Drivers</h2>
					</hgroup>
			
					{ drivers }
					
				</div>
			</div>
				
		</main>
	)
}

export const query = graphql`
	query DriversQuery {
		drivers: allSimRacerHubDriver {
			edges {
				node {
					...driverData	
				}
			}
		}	
	}
`

export default DriversPage
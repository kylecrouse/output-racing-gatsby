import * as React from "react"
import { graphql } from 'gatsby'
import { Helmet } from "react-helmet"
import DriverCard from '../components/driverCard'

const DriversPage = ({ data }) => {
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
			
					{ data.drivers.nodes
							.sort((a, b) => (a.number && typeof parseInt(a.number) === 'number' ? parseInt(a.number) : 1000) - (b.number && typeof parseInt(b.number) === 'number' ? parseInt(b.number): 1000))
							.map(props => {
								const stats = data.stats.nodes.find(({ driver }) => driver === props.name) ||
									{ starts: 0, wins: 0, top5s: 0 }
								return (
									<DriverCard 
										{ ...stats } 
										driver={props}
									/>
								)
							})
					}
					
				</div>
			</div>
				
		</main>
	)
}

export const query = graphql`
	query DriversQuery {
		drivers: allContentfulDriver(
			filter: {active: {eq: true}}
			sort: {fields: number, order: ASC}
		) {
			nodes {
				custId
				name
				nickname
				number
				numberArt {
					file {
						url
					}
				}
				active
				contentful_id
				media {
					gatsbyImageData(
						placeholder: BLURRED
					)
				}
			}
		}
		stats: allContentfulLeagueStatsJsonNode {
			nodes {
				wins
				top5s
				driver
				starts
			}
		}
	}
`

export default DriversPage
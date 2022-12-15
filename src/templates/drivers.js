import * as React from "react"
import { graphql } from 'gatsby'
import Layout from "../components/layout"
import DriverCard from '../components/driverCard'

const DriversPage = (props) => {
	const drivers = React.useMemo(
		() => props.data.drivers.nodes
			.sort((a, b) => (a.carNumber ? a.carNumber : 1000) - (b.carNumber ? b.carNumber: 1000))
			.map((node, index) => (
				<DriverCard 
					key={`driver-${index}`} 
					{...node} 
					seriesName={props.pageContext.seriesName}
					seriesId={props.pageContext.seriesId}
				/>
			)),
		[props.data.drivers, props.pageContext.seriesName, props.pageContext.seriesId]
	)
	return (
		<Layout {...props}>
		
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
		drivers: allIracingMember {
			nodes {
				driverName: display_name
				driverNickName: nick_name
				carNumber: car_number
				carNumberArt: driverNumberArt {
					gatsbyImageData	
					file {
						url
					}
				}						
				participants {
					finishPos: finish_pos
					loopstat {
						rating
					}
					provisional
					car {
						carId: car_iracing_id
						carName: car_name
					}
					race {
						schedule {
							raceDate: race_date
							pointsCount: points_count
							chase
							season {
								seasonId: season_id
								seasonName: season_name
								series {
									seriesId: series_id
									currSeasonId: curr_season_id
								}
							}
						}
					}
				}
			}
		}	
	}
`

export default DriversPage
import * as React from 'react'
import { graphql } from 'gatsby'
import Cars from '../components/cars'
import Layout from '../components/layout'
import Meta from '../components/meta'
import Schedule from '../components/schedule'
import Seasons from '../components/seasons'

const ScheduleTemplate = props => {
	const { season } = props.data
	const seasons = React.useMemo(
		() => props.data.seasons.edges.map(({ node }) => node), 
		[props.data.seasons]
	)
	return (
		<Layout {...props}>
			<main className="container">
	
				<Meta {...props}/>

				<div className="columns">
					<div className="column col-8 col-xl-10 col-lg-11 col-sm-12 col-mx-auto content">
					
						<hgroup className="page-header columns">
							<div>
								<h2 className="page-title">Schedule</h2>
								<h3 className="page-subtitle">
									{ season.seasonName }
								</h3>
							</div>
							{ season.seasonClass?.length > 0 &&
								<Cars cars={season.seasonClass[0]?.seasonClassCars} className="hide-sm" />
							}
						</hgroup>
	
						<Schedule events={season.events} />
	
					</div>
				</div>
			
			</main>
					
			<div className="columns seasons-container">
				<div className="column col-8 col-xl-10 col-lg-11 col-mx-auto">
					<Seasons path={`${props.pageContext.seriesName}/schedule`} seasons={seasons} />
				</div>
			</div>
		</Layout>
	)
}

export const query = graphql`
	query ScheduleQuery($seriesId: Int, $seasonId: Int) {
		season: simRacerHubSeason(seasonId: {eq: $seasonId}) {
			leagueName
			seriesName
			seasonName
			seasonClass {
				seasonClassCars {
					carId
					carName
				}
			}
			events {
				...eventData
			}	
		}
		seasons: allSimRacerHubSeason(
			sort: {fields: events___raceDate, order: DESC}
			filter: {seriesId: {eq: $seriesId}, seasonId: {ne: $seasonId}}
		) {
			edges {
				node {
					seasonName
					seasonId
					seriesName
					seasonClass {
						seasonClassCars {
							carId
							carName
						}
					}
					standings {
						driverId
						driverName
						member {
							...driverChipData
						}
						position
						totalPoints
					}	
				}
			}
		}
	}
`

export default ScheduleTemplate
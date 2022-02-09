import * as React from 'react'
import { graphql } from 'gatsby'
import Results from '../../templates/results'

const LatestResultsPage = ({ data, location }) => {
	return (
		<Results 
			pageContext={data.races.edges[0].node}
			location={location}
		/>
	)
}

export const query = graphql`
	query LatestRaceQuery {
		races: allSimRacerHubRace(
			sort: { fields: raceDate, order: DESC }
			limit: 1
		) {
			edges {
				node {
					...raceData	
				}
			}	
		}
	}	
`

export default LatestResultsPage
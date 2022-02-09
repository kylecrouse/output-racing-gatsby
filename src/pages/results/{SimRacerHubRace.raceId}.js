import * as React from 'react'
import { graphql } from 'gatsby'
import Results from '../../templates/results'

const ResultsPage = ({ data, location }) => {
	return (
		<Results 
			pageContext={data.race}
			location={location}
		/>
	)
}

export const query = graphql`
	query RaceQuery($raceId: Int) {
		race: simRacerHubRace(
			raceId: {eq: $raceId}
		) {
			...raceData	
		}
	}	
`

export default ResultsPage
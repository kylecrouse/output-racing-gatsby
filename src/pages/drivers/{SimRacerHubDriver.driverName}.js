import * as React from "react"
import { graphql } from 'gatsby'
import Driver from '../../templates/driver'

const DriverPage = ({ data, location }) => {
	return (
		<Driver 
			pageContext={data.driver}
			location={location}
		/>
	)
}

export const query = graphql`
	query DriverQuery($driverName: String) {
		driver: simRacerHubDriver(driverName: {eq: $driverName}) {
			...driverData	
		}	
	}
`

export default DriverPage
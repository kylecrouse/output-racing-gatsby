import * as React from 'react'
import { graphql } from 'gatsby'
import Seasons from '../../components/seasons'
import Standings from '../../components/standings'

const ScheduleArchivePage = ({ data }) => {
	return (
		<main>
			<h2 className="text-center">
				{data.season.name.replace('Output Racing ', '')} Standings
			</h2>
			
			<h6 className="text-center" style={{ margin: "1rem 0 2rem" }}>
				After {data.season.results ? data.season.schedule.filter(({ counts, uploaded }) => counts && uploaded).length : 0} of {data.season.schedule.filter(({ counts }) => counts).length} Races
			</h6>
			
			<Standings 
				standings={
					data.season.standings.map(row => ({
						...row, 
						driver: data.drivers.nodes.find(({ name }) => name === row.driver)
					}))
				}
			/>

			<Seasons 
				path="standings" 
				seasons={data.league.seasons} 
				drivers={data.drivers.nodes}
			/>
	
		</main>
	)
}

export const query = graphql`
	query StandingsArchivePage($contentful_id: String) {
		season: contentfulSeason(contentful_id: {eq: $contentful_id}) {
			name
			schedule {
				counts
				uploaded
			}
			results {
				raceId
			}
			standings {
				driver
				change
				starts
				points
				behindNext
				behindLeader
				wins
				t5s
				t10s
				laps
				incidents
			}
		}
		league: contentfulLeague(leagueId: {eq: 2732}) {
			seasons {
				name
				id: contentful_id
				standings {
					driver
				}
			}
		}
		drivers: allContentfulDriver {
			nodes {
				name
				nickname
				active
				number
				numberArt {
					file {
						url
					}
				}
			}
		}
	}
`

export default ScheduleArchivePage
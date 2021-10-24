import * as React from "react"
import { graphql } from 'gatsby'
import './drivers.css'

const DriversPage = ({ data }) => {
	return (
		<main>
						
			<h2 className="text-center">Drivers</h2>
			
			<table>
				<thead>
					<tr>
						<th colSpan="2">&nbsp;</th>
						<th className="hide-sm" width="10%">Starts</th>
						<th className="hide-sm" width="10%">Wins</th>
						<th className="hide-sm" width="10%">Top 5s</th>
						<th className="hide-sm" width="10%">Poles</th>
					</tr>
				</thead>
				<tbody>
					{ data.drivers.nodes
							.sort((a, b) => !a.number ? 1 : parseInt(a.number) - parseInt(b.number))
							.map(props => {
								const stats = data.stats.nodes.find(({ driver }) => driver === props.name) ||
									{ starts: 0, wins: 0, winPercentage: "0%", top5s: 0, top5Percentage: "0%", poles: 0, polePercentage: "0%" }
								return (
									<tr key={props.custId}>
										<td className="number">
											{ props.numberArt
													? <img src={ props.numberArt.file.url } className="art" alt={props.number}/>
													: props.number
											}
										</td>
										<td className="name">
											<a href={`/driver/${props.name.replace(/\s/g, '-').toLowerCase()}/`}>
												{props.nickname || props.name}
											</a>
										</td>
										<td className="hide-sm">
											{stats.starts}
										</td>
										<td className="hide-sm">
											{stats.wins}&nbsp;<span>({stats.winPercentage})</span>
										</td>
										<td className="hide-sm">
											{stats.top5}&nbsp;<span>({stats.top5Percentage})</span>
										</td>
										<td className="hide-sm">
											{stats.poles}&nbsp;<span>({stats.polePercentage})</span>
										</td>
									</tr>
								)								
							}) 
					}
				</tbody>
			</table>

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
				contentful_id
			}
		}
		stats: allContentfulLeagueStatsJsonNode {
			nodes {
				wins
				winPercentage
				top5s
				top5Percentage
				poles
				polePercentage
				driver
				starts
			}
		}
	}
`

export default DriversPage
import * as React from 'react'
import DriverChip from './driverChip'

const Standings = (props) => {
	return (
		<table className="standings">
			<thead>
				<tr>
					<th width="2%">&nbsp;</th>
					<th width="2%">&nbsp;</th>
					<th>Driver</th>
					<th width="7%">Starts</th>
					<th width="7%">Points</th>
					<th width="7%">Behind Next</th>
					<th width="7%">Behind Leader</th>
					<th width="7%">Wins</th>
					<th width="7%">Top 5s</th>
					<th width="7%">Top 10s</th>
					<th width="7%">Total Laps</th>
					<th width="7%">Incidents per&nbsp;Race</th>
				</tr>
			</thead>
			<tbody>
				{ Array.isArray(props.standings) && props.standings.length > 0 
					? props.standings.map((row, index) => ( row.driver &&
							<tr key={index} style={{opacity: row.driver.active ? 1 : 0.3}}>
								<td><b>{index + 1}</b></td>
								<td>
								{ parseInt(row.change, 10) > 0
										? <span style={{color:"green"}}>&#9650;&nbsp;{row.change.substr(1)}</span>
										: parseInt(row.change, 10) < 0
											? <span style={{color:"red"}}>&#9660;&nbsp;{row.change.substr(1)}</span>
											: '\u00a0'
								}
								</td>
								<td><DriverChip {...row.driver}/></td>
								<td>{row.starts}</td>
								<td>{row.points}</td>
								<td>{row.behindNext}</td>
								<td>{row.behindLeader}</td>
								<td>{row.wins}</td>
								<td>{row.t5s}</td>
								<td>{row.t10s}</td>
								<td>{row.laps}</td>
								<td>{(row.incidents / row.starts).toFixed(2)}</td>
							</tr>
						))
					: props.drivers
							.filter(driver => driver.active)
							.sort((a, b) => parseInt(a.number || 1000, 10) - parseInt(b.number || 1000, 10))
							.map((driver, index) => ( driver &&
							<tr key={index} style={{opacity: driver.active ? 1 : 0.3}}>
								<td><b>{index + 1}</b></td>
								<td></td>
								<td><DriverChip {...driver}/></td>
								<td>0</td>
								<td>0</td>
								<td>-</td>
								<td>-</td>
								<td>0</td>
								<td>0</td>
								<td>0</td>
								<td>0</td>
								<td>0.00</td>
							</tr>
						))
				}
			</tbody>
		</table> 
	)
}

export default Standings
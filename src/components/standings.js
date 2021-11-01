import * as React from 'react'
import DriverChip from './driverChip'

const Standings = (props) => {
	const fields = props.fields || ['pos', 'gain', 'driver', 'starts', 'points', 'next', 'leader', 'wins', 't5s', 't10s', 'laps', 'inc'];
	const headers = props.headers !== undefined ? props.headers : true;
	return (
		<table className="standings">
			<thead className={ !headers ? 'd-hide' : '' }>
				<tr>
					{ fields.includes('pos') && <th width="2%">&nbsp;</th> }
					{ fields.includes('gain') && <th width="2%">&nbsp;</th> }
					{ fields.includes('driver') && <th>Driver</th> }
					{ fields.includes('starts') && <th width="7%">Starts</th> }
					{ fields.includes('points') && <th width="7%">Points</th> }
					{ fields.includes('next') && <th width="7%">Behind Next</th> }
					{ fields.includes('leader') && <th width="7%">Behind Leader</th> }
					{ fields.includes('wins') && <th width="7%">Wins</th> }
					{ fields.includes('t5s') && <th width="7%">Top 5s</th> }
					{ fields.includes('t10s') && <th width="7%">Top 10s</th> }
					{ fields.includes('laps') && <th width="7%">Total Laps</th> }
					{ fields.includes('inc') && <th width="7%">Incidents per&nbsp;Race</th> }
				</tr>
			</thead>
			<tbody>
				{ Array.isArray(props.standings) && props.standings.length > 0 
					? props.standings.map((row, index) => ( row.driver &&
							<tr key={index} style={{opacity: row.driver.active ? 1 : 0.3}}>
								{ fields.includes('pos') && <td><b>{index + 1}</b></td>}
								{ fields.includes('gain') && 
									<td>
										{ parseInt(row.change, 10) > 0
												? <span style={{color:"green"}}>&#9650;&nbsp;{row.change.substr(1)}</span>
												: parseInt(row.change, 10) < 0
													? <span style={{color:"red"}}>&#9660;&nbsp;{row.change.substr(1)}</span>
													: '\u00a0'
										}
									</td>
								}
								{ fields.includes('driver') && <td><DriverChip {...row.driver}/></td> }
								{ fields.includes('starts') && <td>{row.starts}</td> }
								{ fields.includes('points') && <td>{row.points}</td> }
								{ fields.includes('next') && <td>{row.behindNext}</td> }
								{ fields.includes('leader') && <td>{row.behindLeader}</td> }
								{ fields.includes('wins') && <td>{row.wins}</td> }
								{ fields.includes('t5s') && <td>{row.t5s}</td> }
								{ fields.includes('t10s') && <td>{row.t10s}</td> }
								{ fields.includes('laps') && <td>{row.laps}</td> }
								{ fields.includes('inc') && <td>{(row.incidents / row.starts).toFixed(2)}</td> }
							</tr>
						))
					: props.drivers
							.filter(driver => driver.active)
							.sort((a, b) => parseInt(a.number || 1000, 10) - parseInt(b.number || 1000, 10))
							.map((driver, index) => ( driver &&
							<tr key={index} style={{opacity: driver.active ? 1 : 0.3}}>
								{ fields.includes('pos') && <td><b>{index + 1}</b></td> }
								{ fields.includes('gain') && <td></td> }
								{ fields.includes('driver') && <td><DriverChip {...driver}/></td> }
								{ fields.includes('starts') && <td>0</td> }
								{ fields.includes('points') && <td>0</td> }
								{ fields.includes('next') && <td>-</td> }
								{ fields.includes('leader') && <td>-</td> }
								{ fields.includes('wins') && <td>0</td> }
								{ fields.includes('t5s') && <td>0</td> }
								{ fields.includes('t10s') && <td>0</td> }
								{ fields.includes('laps') && <td>0</td> }
								{ fields.includes('inc') && <td>0.00</td> }
							</tr>
						))
				}
			</tbody>
		</table> 
	)
}

export default Standings
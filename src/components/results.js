import * as React from 'react'
import DriverChip from './driverChip'

const Results = (props) => {
	const fields = props.fields || ['finish', 'start', 'driver', 'points', 'interval', 'laps', 'led', 'fastest', 'average', 'incidents', 'status'];
	const headers = props.headers !== undefined ? props.headers : true;
	return (
		<table>
			<thead className={ !headers ? 'd-hide' : '' }>
				<tr>
					{ fields.includes('finish') && <th width="2%">F</th> }
					{ fields.includes('start') && <th width="2%">S</th> }
					{ fields.includes('driver') && <th>Driver</th> }
					{ fields.includes('points') && <th width="7%">Points</th> }
					{ fields.includes('interval') && <th width="7%">Interval</th> }
					{ fields.includes('laps') && <th width="7%">Laps</th> }
					{ fields.includes('led') && <th width="7%">Led</th> }
					{ fields.includes('fastest') && <th width="7%">Fastest</th> }
					{ fields.includes('average') && <th width="7%">Average</th> }
					{ fields.includes('incidents') && <th width="7%">Inc</th> }
					{ fields.includes('status') && <th width="7%">Status</th> }
				</tr>
			</thead>
			<tbody>
				{ props.results
						.sort((a, b) => parseInt(a.finish, 10) > parseInt(b.finish, 10))
						.map(props => {
							return (
								<tr key={props.id} style={{ opacity: props.driver.active ? 1 : 0.3 }}>
									{ fields.includes('finish') && <td>{props.finish}</td> }
									{ fields.includes('start') && <td>{props.start}</td> }
									{ fields.includes('driver') && <td><DriverChip {...props.driver}/></td> }
									{ fields.includes('points') && 	
										<td>
											{parseInt(props.points, 10) + parseInt(props.bonus, 10) + parseInt(props.penalty, 10)}
										</td> 
									}
									{ fields.includes('interval') && <td>{props.interval}</td> }
									{ fields.includes('laps') && <td>{props.completed}</td> }
									{ fields.includes('led') && <td>{props.led}</td> }
									{ fields.includes('fastest') && <td>{props.fastest}</td> }
									{ fields.includes('average') && <td>{props.average}</td> }
									{ fields.includes('incidents') && <td>{props.incidents}</td> }
									{ fields.includes('status') && <td>{props.status}</td> }
								</tr>
							)
						}) 
				}
			</tbody>
		</table>		
	)
}

export default Results

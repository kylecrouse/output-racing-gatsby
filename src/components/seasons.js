import * as React from 'react'
import DriverChip from './driverChip'


const Seasons = (props) => {
	return (
		<table>
			<thead>
				<tr>
					<th>&nbsp;</th>
					<th className="hide-sm" width="20%">1st</th>
					<th className="hide-sm" width="20%">2nd</th>
					<th className="hide-sm" width="20%">3rd</th>
				</tr>
			</thead>
			<tbody>
				{ props.seasons.map(season => {
						const drivers = season.standings
							.slice(0, 3)
							.map(
								({ driver }) => props.drivers.find(
									({ name }) => name === driver
								)
							)
						return (
							<tr key={season.id}>
								<td>
									<a href={`/schedule/${season.id}/`}>{season.name.replace('Output Racing ', '')}</a>
								</td>
								<td className="hide-sm">
									{ drivers.length > 0 && 
										<DriverChip {...drivers[0]}/> 
									}
								</td>
								<td className="hide-sm">
									{ drivers.length > 0 && 
										<DriverChip {...drivers[1]}/> 
									}
								</td>
								<td className="hide-sm">
									{ drivers.length > 0 && 
										<DriverChip {...drivers[2]}/> 
									}
								</td>
							</tr>
						)
					})
				}
			</tbody>
		</table>
	)
}

export default Seasons
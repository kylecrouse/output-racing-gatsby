import * as React from 'react'
import DriverChip from './driverChip'
import Table from './table'

const Standings = (props) => {
	const columns = React.useMemo(
		() => [
			{
				Header: () => null,
				accessor: 'position',
				className: 'cell-position'
			},
			{
				Header: () => null,
				accessor: 'change',
				className: 'cell-change',
				Cell: ({ value }) => {
					const change = parseInt(value, 10)
					return (
						<span className={ 
							change > 0 
								? 'positive' 
								: change < 0 
									? 'negative' 
									: 'neutral'
							}>
							{ value.substr(1) || '\u00a0' }
						</span>
					)
				}
			},
			{
				Header: 'Driver',
				accessor: 'driver',
				className: 'cell-driver',
				Cell: ({ value }) => (
					<DriverChip { ...value } />
				)
			},
			{
				Header: 'Points',
				accessor: 'points',
			},
			{
				Header: 'Behind Next',
				accessor: 'behindNext',
			},
			{
				Header: 'Behind Leader',
				accessor: 'behindLeader',
			},
			{
				Header: 'Starts',
				accessor: 'starts',
			},
			{
				Header: 'Wins',
				accessor: 'wins',
			},
			{
				Header: 'Top 5',
				accessor: 't5s',
			},
			{
				Header: 'Top 10',
				accessor: 't10s',
			},
			{
				Header: 'Laps',
				accessor: 'laps',
			},
			// {
			// 	id: 'incPerRace',
			// 	Header: 'Incidents per Race',
			// 	accessor: ({ incidents, starts }) => (incidents / starts).toFixed(2),
			// },
			// {
			// 	id: 'incPerLap',
			// 	Header: 'Incidents per Lap',
			// 	accessor: ({ incidents, laps }) => (incidents / parseInt(laps.replace(/,/g, ''), 10)).toFixed(2),
			// },
		],
		[]
	)
	
	return (
		<Table 
			columns={columns} 
			data={props.standings}
			disableSortBy={true} 
			getRowProps={row => ({
				className: row.values.driver.active ? '' : 'inactive'
			})}
			initialState={{
				hiddenColumns: columns
					.map(({ id, accessor }) => id || accessor)
					.filter(
						typeof props.fields === 'function'
							? props.fields
							: (column) => props.fields && !props.fields.includes(column)
					)
			}}
		/>
	)
}

export default Standings
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
				className: 'hide-sm',
			},
			{
				Header: 'Behind Leader',
				accessor: 'behindLeader',
				className: 'hide-sm',
			},
			{
				Header: 'Starts',
				accessor: 'starts',
				className: 'hide-sm',
			},
			{
				Header: 'Wins',
				accessor: 'wins',
				className: 'hide-sm',
			},
			{
				Header: 'Top 5',
				accessor: 't5s',
				className: 'hide-sm',
			},
			{
				Header: 'Top 10',
				accessor: 't10s',
				className: 'hide-sm',
			},
			{
				Header: 'Laps',
				accessor: 'laps',
				className: 'hide-sm',
			},
			{
				Header: 'Avg Rating',
				accessor: 'rating',
				className: 'hide-sm',
				Cell: ({ value }) => value.toFixed(1)
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
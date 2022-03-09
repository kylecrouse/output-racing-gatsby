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
					return (
						<span className={ 
							value > 0 
								? 'positive' 
								: value < 0 
									? 'negative' 
									: 'neutral'
							}>
							{ value !== null && value !== 0 
									? Math.abs(value) 
									: '\u00a0' 
							}
						</span>
					)
				}
			},
			{
				Header: 'Driver',
				accessor: 'driverName',
				className: 'cell-driver',
				Cell: ({ value, row }) => row.original.member
					? <DriverChip { ...row.original.member } link={false} />
					: <DriverChip 
							active={false}
							driverName={ value }
							link={false}
						/>
			},
			{
				Header: 'Points',
				accessor: 'totalPoints',
				className: 'cell-totalPoints',
			},
			{
				Header: 'Behind Next',
				accessor: 'behindNext',
				className: 'hide-sm',
				Cell: ({ value }) => value ?? '–',
			},
			{
				Header: 'Behind Leader',
				accessor: 'behindLeader',
				className: 'hide-sm',
				Cell: ({ value }) => value ?? '–',
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
				accessor: 'top5s',
				className: 'hide-sm',
			},
			{
				Header: 'Top 10',
				accessor: 'top10s',
				className: 'hide-sm',
			},
			{
				Header: 'Laps',
				accessor: 'lapsCompleted',
				className: 'hide-sm',
			},
			{
				Header: 'Avg Rating',
				accessor: 'rating',
				className: 'hide-sm',
				Cell: ({ value }) => value ? value.toFixed(1) : 0
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
				className: row.original.member?.active ? '' : 'inactive'
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
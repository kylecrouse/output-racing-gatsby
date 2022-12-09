import * as React from 'react'
import { renderDriverChip } from './driverChip'
import Table from './table'

const Standings = (props) => {
	console.log(props)
	
	const data = React.useMemo(
		() => props.data.reduce(
			(p, e) => e.race ? [...p, ...e.race.participants] : p, 
			[]
		),
		[props.data]
	)
	
	const priorWeek = React.useMemo(
		() => {
			let participants = new Map()
			props.data
				.filter(({ race }) => !!race)
				.slice(0, -1)
				.forEach(
					({ race }) => {
						race?.participants.forEach((p) => {
							const bonusPoints = p.bonuses?.reduce(
								(points, { bonusPoints }) => points += bonusPoints, 
								0
							) ?? 0
							const penaltyPoints = p.penalties?.reduce(
								(points, { penaltyPoints }) => points += penaltyPoints,
								0
							) ?? 0
							const totalPoints = p.racePoints + bonusPoints - penaltyPoints
						
							participants.set(
								p.driverId, 
								(participants.get(p.driverId) ?? 0) + totalPoints
							)
						})
					} 
				)
			return Array.from(participants.entries()).map(
				([driverId, totalPoints]) => ({ driverId, totalPoints })
			).sort(
				(a, b) => b.totalPoints - a.totalPoints
			)
		},
		[props.data]
	)
	
	const columns = React.useMemo(
		() => [
			{
				id: 'position',
				className: 'cell-position',
				aggregatedCell: ({ table, row }) => {
					const { rows: sortedRows } = table.getSortedRowModel()
					let position = 0,
							index = sortedRows.findIndex(({ id }) => row.id === id)
					while (index--) {
						if (sortedRows[index]._groupingValuesCache.points > row._groupingValuesCache.points) {
							position = index + 1
							break
						}
					}
					return position + 1
				},
			},
			{
				id: 'change',
				className: 'cell-change',
				aggregatedCell: ({ table, row }) => {
					const { rows: sortedRows } = table.getSortedRowModel()
					const pos = sortedRows.findIndex(
												({ id }) => row.id === id
											),
								prior = priorWeek.findIndex(
									({ driverId }) => driverId === Math.floor(row.groupingValue)
								)
					const change = prior - pos
					return (
						<span className={ 
							change > 0 
								? 'positive' 
								: change < 0 
									? 'negative' 
									: 'neutral'
							}>
							{ change !== null && change !== 0 
									? Math.abs(change) 
									: '\u00a0' 
							}
						</span>
					)
				}
			},
			{
				accessorKey: 'driverId',
				header: 'Driver',
				className: 'cell-driver',
				cell: ({ row }) => renderDriverChip(row.original),
				enableGrouping: true,
			},
			{
				id: 'points',
				header: 'Points',
				accessorFn: (row) => {
					const bonusPoints = row.bonuses?.reduce(
						(points, { bonusPoints }) => points += bonusPoints, 
						0
					) ?? 0
					const penaltyPoints = row.penalties?.reduce(
						(points, { penaltyPoints }) => points += penaltyPoints,
						0
					) ?? 0
					return row.racePoints + bonusPoints - penaltyPoints
				},
				aggregationFn: 'sum',
				enableSorting: true,
				className: 'cell-totalPoints',
			},
			{
				id: 'behindNext',
				header: 'Behind Next',
				className: 'hide-sm',
				aggregatedCell: ({ table, row }) => {
					const { rows: sortedRows } = table.getSortedRowModel()
					let points = row._groupingValuesCache.points,
							index = sortedRows.findIndex(({ id }) => row.id === id)
					if (index === 0)
						return '-'
					else
						return points - sortedRows[index - 1]._groupingValuesCache.points
				},
			},
			{
				id: 'behindLeader',
				header: 'Behind Leader',
				className: 'hide-sm',
				aggregatedCell: ({ table, row }) => {
					const { rows: sortedRows } = table.getSortedRowModel()
					let points = row._groupingValuesCache.points,
							index = sortedRows.findIndex(({ id }) => row.id === id)
					if (index === 0)
						return '-'
					else
						return points - sortedRows[0]._groupingValuesCache.points
				},
			},
			{
				id: 'starts',
				header: 'Starts',
				accessorFn: (row, index) => row.finishPos !== null ? 1 : 0,
				aggregationFn: 'sum',
				className: 'hide-sm',
			},
			{
				id: 'wins',
				header: 'Wins',
				accessorFn: (row) => row.finishPos === 1 ? 1 : 0,
				aggregationFn: 'sum',
				className: 'hide-sm',
			},
			{
				id: 'top5s',
				header: 'Top 5',
				accessorFn: (row) => row.finishPos !== null && row.finishPos < 5 ? 1 : 0,
				aggregationFn: 'sum',
				className: 'hide-sm',
			},
			{
				id: 'top10s',
				header: 'Top 10',
				accessorFn: (row) => row.finishPos !== null && row.finishPos < 10 ? 1 : 0,
				aggregationFn: 'sum',
				className: 'hide-sm',
			},
			{
				header: 'Laps',
				accessorKey: 'lapsCompleted',
				aggregationFn: 'sum',
				className: 'hide-sm',
			},
			{
				id: 'rating',
				header: 'Avg Rating',
				accessorFn: (row) => row.loopstat?.rating ?? 0,
				aggregationFn: 'mean',
				className: 'hide-sm',
				aggregatedCell: ({ getValue }) => getValue()?.toFixed(1) ?? 0
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
		[priorWeek]
	)
	return (
		<Table 
			columns={columns} 
			data={data}
			getRowProps={row => ({
				className: row.original.driver?.member ? '' : 'inactive'
			})}
			initialState={{
				grouping: ['driverId'],
				sorting: [{ id: 'points', desc: true }],
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
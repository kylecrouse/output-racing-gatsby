import * as React from 'react'
import moment from 'moment'
import DriverChip from './driverChip'
import Table from './table'

const Results = (props) => {
	const columns = React.useMemo(
		() => [
			{
				Header: () => null,
				accessor: 'finish',
				className: 'cell-position'
			},
			{
				Header: () => null,
				accessor: 'start',
				className: 'cell-change',
				Cell: ({ row, value }) => {
					const change = value - row.values.finish
					return (
						<span className={ 
							change > 0 
								? 'positive' 
								: change < 0 
									? 'negative' 
									: 'neutral'
							}>
							{ Math.abs(change) || '\u00a0' }
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
				className: 'cell-totalPoints',
				Cell: ({ value, row }) => {
					const { bonus, penalty } = row.values
					return (
						<div>
							<span>
								{ parseInt(value, 10) + parseInt(bonus, 10) + parseInt(penalty, 10) }
							</span>
							<span className="adjustments">
								{ bonus > 0 && <span className="positive">{ `+${bonus}` }</span> }
								{ penalty > 0 && <span className="negative">{ `-${penalty}` }</span> }
							</span>
						</div>
					)
				},
			},
			{
				Header: 'Bonus',
				accessor: 'bonus',
				className: 'cell-bonus hide-sm',
				Cell: ({ value }) => value > 0 ? `+${value}` : ''
			},
			{
				Header: 'Penalty',
				accessor: 'penalty',
				className: 'cell-penalty hide-sm',
				Cell: ({ value }) => value > 0 ? `-${value}` : ''
			},
			{
				Header: 'Laps',
				accessor: 'completed',
				className: 'hide-sm'
			},
			{
				Header: 'Time',
				accessor: 'interval',
				className: 'hide-sm',
				Cell: ({ value, row }) => {
					const { finish, status } = row.values
					return parseInt(finish) === 1
						? props.duration.replace(/\s(\d[ms])/g, ' 0$1') // add 0 to m and s < 10
								.replace(/[hms]/g,'') // remove m, h, s
								.replace(/\s/g,':') // replace space with :
						: (status.toLowerCase() === 'running')
							? value.replace('-', '+')
									.replace('L', parseInt(value) < -1 ? ' laps': ' lap')
							: 'DNF'
				}
			},
			{
				Header: 'Led',
				accessor: 'led',
				className: 'hide-sm',
				Cell: ({ value, data }) => {
					return parseInt(value) === Math.max(
						...data.map(({ led }) => parseInt(led))
					)
						? <b className={ props.counts ? 'positive' : '' }>{ value }</b>
						: parseInt(value) >= 1 
							? <span className={ props.counts ? 'positive' : '' }>{value}</span>
							: value
				}
			},
			{
				Header: 'Inc',
				accessor: 'incidents',
				className: 'hide-sm',
				Cell: ({ value, data }) => {
					return parseInt(value) === Math.max(
						...data.map(({ incidents }) => parseInt(incidents))
					)
						? parseInt(value) >= 8 
							? <b className={ props.counts ? 'negative' : '' }>{ value }</b>
							: <b>{ value }</b>
						: parseInt(value) >= 8 
							? <span className={ props.counts ? 'negative' : '' }>{value}</span>
							: value
				}
			},
			{
				Header: 'Fast Lap',
				accessor: 'fastest',
				className: 'hide-sm',
				Cell: ({ value, data }) => {
					return moment(value, ['m:s.S', 's.S']).isSame(
						moment.min(
							...data
								.filter(({ fastest }) => parseFloat(fastest) > 0)
								.map(({ fastest }) => moment(fastest, ['m:s.S', 's.S']))
						)
					)
						? <b>{ value }</b>
						: parseFloat(value) > 0 ? value : '-'
				}
			},
			{
				Header: 'Rating',
				accessor: 'rating',
				Cell: ({ value, data }) => {
					if (!value) return 0
					return value === Math.max(...data.map(({ rating }) => rating))
						? <b>{ value.toFixed(1) }</b>
						: value.toFixed(1)
				}
			},
			{
				Header: 'Status',
				accessor: 'status',
				className: 'hide-sm'
			}
		],
		[props.duration, props.counts]
	)
	
	return (
		<Table 
			columns={columns} 
			data={props.results}
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

export default Results

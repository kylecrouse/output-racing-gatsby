import * as React from 'react'
import moment from 'moment'
import DriverChip from './driverChip'
import Table from './table'

const Results = (props) => {
	const columns = React.useMemo(
		() => [
			{
				Header: () => null,
				accessor: 'finishPos',
				className: 'cell-position'
			},
			{
				Header: () => null,
				accessor: 'qualifyPos',
				className: 'cell-change',
				Cell: ({ row, value }) => {
					const change = value - row.original.finishPos
					const className = change > 0
						? 'positive'
						: change < 0
							? 'negative'
							: 'neutral'
					return props.hardCharger?.driverId && props.hardCharger.driverId === row.original.driverId
						? <b className={className}>
								{Math.abs(change) || '\u00a0'}
							</b>
						: <span className={className}>
								{Math.abs(change) || '\u00a0'}
							</span>
				}
			},
			{
				Header: 'Driver',
				accessor: 'driverName',
				className: 'cell-driver',
				Cell: ({ row, value }) => (
					row.original.member
						? <DriverChip { ...row.original.member } link={false} />
						: <DriverChip 
								active={false}
								driverName={ row.original.driverName }
								link={false}
							/>
				)
			},
			{
				Header: '',
				accessor: 'carImage',
				className: 'cell-carLogo',
				Cell: ({ value, row }) => (
					<img 
						src={ value?.publicURL }
						alt={ row.original.carName }
					/>
				)
			},
			{
				Header: 'Points',
				accessor: 'totalPoints',
				className: 'cell-totalPoints',
				Cell: ({ value, row }) => {
					const { bonusPoints, penaltyPoints } = row.original
					return (
						<div>
							<span>
								{ value }
							</span>
							<span className="adjustments">
								{ bonusPoints > 0 && <span className="positive">{ `+${bonusPoints}` }</span> }
								{ penaltyPoints > 0 && <span className="negative">{ `-${penaltyPoints}` }</span> }
							</span>
						</div>
					)
				},
			},
			{
				Header: 'Rating',
				accessor: 'rating',
				className: 'hide-sm',
				Cell: ({ value, data }) => {
					if (!value) return 0
					return value === Math.max(...data.map(({ rating }) => rating))
						? <b>{ value.toFixed(1) }</b>
						: value.toFixed(1)
				}
			},
			{
				Header: 'Time',
				accessor: 'interval',
				className: 'hide-sm',
				Cell: ({ value, row }) => {
					const { finishPos, lapsCompleted, status } = row.original
					return (value > 0)
						? `+${getTimeFromMilliseconds(value*10000)}`
						: (finishPos === 1)
							? moment.utc(moment.duration(props.duration, 's').as('milliseconds'))
									.format('HH:mm:ss')
							: (status.toLowerCase() === 'running')
								? `+${props.raceLaps - lapsCompleted} lap${props.raceLaps - lapsCompleted > 1 ? 's' : ''}`
								: 'DNF'
				}
			},
			{
				Header: 'Laps',
				accessor: 'lapsCompleted',
				className: 'hide-sm'
			},
			{
				Header: 'Led',
				accessor: 'lapsLed',
				className: 'hide-sm',
				Cell: ({ value, data }) => {
					return value === Math.max(
						...data.map(({ lapsLed }) => lapsLed)
					)
						? <b className={ props.pointsCount ? 'positive' : '' }>{ value }</b>
						: value >= 1 
							? <span className={ props.pointsCount ? 'positive' : '' }>{value}</span>
							: value
				}
			},
			{
				Header: 'Average Position',
				accessor: 'avgPos',
				className: 'hide-sm',
				Cell: ({ value, data }) => {
					return value === Math.min(
						...data.reduce((a, { avgPos }) => avgPos !== -1 ? [...a, avgPos] : a, [])
					)
						? <b>{ (value + 1).toFixed(1) }</b>
						: value !== -1 ? (value + 1).toFixed(1) : '-'
				}
			},
			{
				Header: 'Total Passes',
				accessor: 'passes',
				className: 'hide-sm',
				Cell: ({ value, data }) => {
					return value !== 0 && value === Math.max(
						...data.map(({ passes }) => passes)
					)
						? <b>{ value }</b>
						: value
				}
			},
			{
				Header: 'Quality Passes',
				accessor: 'qualityPasses',
				className: 'hide-sm',
				Cell: ({ value, data }) => {
					return value !== 0 && value === Math.max(
						...data.map(({ qualityPasses }) => qualityPasses)
					)
						? <b>{ value }</b>
						: value
				}
			},
			{
				Header: 'Closing Passes',
				accessor: 'closingPasses',
				className: 'hide-sm',
				Cell: ({ value, data }) => {
					return value !== 0 && value === Math.max(
						...data.map(({ closingPasses }) => closingPasses)
					)
						? <b>{ value }</b>
						: value
				}
			},
			{
				Header: 'Inc',
				accessor: 'incidents',
				className: 'hide-sm',
				Cell: ({ value, data, row }) => {
					const { numLaps } = row.original
					return value === Math.max(
						...data.map(({ incidents }) => incidents)
					)
						? value >= 8 
							? <b className={ props.pointsCount ? 'negative' : '' }>{ value }</b>
							: value === 0 && numLaps === props.raceLaps && props.pointsCount 
								? <b className="positive">{ value }</b>
								: <b>{ value }</b>
						: value >= 8 
							? <span className={ props.pointsCount ? 'negative' : '' }>{value}</span>
							: value === 0 && numLaps === props.raceLaps && props.pointsCount
								? <span className="positive">{ value }</span>
								: value
				}
			},
			{
				Header: 'Fast Laps',
				accessor: 'numFastLap',
				className: 'hide-sm',
				Cell: ({ value, data }) => {
					return value === Math.max(
						...data.map(({ numFastLap }) => numFastLap)
					)
						? <b>{ value }</b>
						: value
				}
			},
			{
				Header: 'Fast Lap',
				accessor: 'fastestLapTime',
				className: 'hide-sm',
				Cell: ({ value, data }) => {
					return value === data.reduce(
						(a, { fastestLapTime }) => fastestLapTime > 0 
							? Math.min(fastestLapTime, a) 
							: a,
							9999999999999
					)
						? <b>{ value }</b>
						: value > 0 ? value : '-'
				}
			},
			{
				Header: 'Qual Lap',
				accessor: 'qualifyTime',
				className: 'hide-sm',
				Cell: ({ value, data }) => {
					return moment(value, ['m:s.S', 's.S']).isSame(
						moment.min(
							...data
								.filter(({ qualifyTime }) => qualifyTime > 0)
								.map(({ qualifyTime }) => moment(qualifyTime, ['m:s.S', 's.S']))
						)
					)
						? <b>{ getTimeFromMilliseconds(value * 10000) }</b>
						: value > 0 ? getTimeFromMilliseconds(value * 10000) : '-'
				}
			},
		],
		[props.duration, props.pointsCount, props.raceLaps, props.hardCharger?.driverId]
	)
	
	return (
		<Table 
			columns={columns} 
			data={props.participants}
			disableSortBy={true} 
			scrolling={true}
			getRowProps={row => ({
				className: row.original.member && row.original.member.active 
					? '' 
					: 'inactive'
			})}
			initialState={{
				sortBy: [{ id: 'finishPos', desc: false }],
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

const getTimeFromMilliseconds = (time) => {
	let hours = Math.floor(time / (3600 * 10000))
	time = time - hours * 3600 * 10000
	let min = Math.floor(time / (60 * 10000))
	time = time - min * 60 * 10000
	let secs = Math.floor(time / 10000)
	time = time - secs * 10000
	const tenths = Math.floor(time / 1000)
	time = time - tenths * 1000
	const hun = Math.floor(time / 100)
	time = time - hun * 100
	const thous = Math.floor(time / 10)
	if (hours) 
		hours += ":"
	else 
		hours = ""
	if (hours && min < 10)
		min = "0" + min
	if (min && secs < 10)
		secs = "0" + secs
	return `${hours}${min > 0 ? `${min}:` : ``}${secs}.${tenths}${hun}${thous}`
}
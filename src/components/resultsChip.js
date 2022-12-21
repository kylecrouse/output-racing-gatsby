import * as React from 'react'
import { renderDriverChip } from '../components/driverChip'
import * as styles from './resultsChip.module.scss'

const ResultsChip = (props) => {

	return (
		<div className={ `${styles.container} ${props.hideSm && 'hide-sm'}` }>
			{ props.results
					.map((item, index) => (
						<ResultItem
							key={`result-${index}`}
							counts={props.counts}
							link={props.link ?? true}
							{...item}
							index={index}
						/>
					))
			}
		</div>
	)
}

const ResultItem = (props) => {
	const bonusPoints = props.bonuses?.reduce(
		(points, { bonusPoints }) => points += bonusPoints, 
		0
	) ?? 0
	const penaltyPoints = props.penalties?.reduce(
		(points, { penaltyPoints }) => points += penaltyPoints,
		0
	) ?? 0
	const totalPoints = props.racePoints + bonusPoints - penaltyPoints

	return (
		<div className={ styles.item }>
			<div className="columns">
				<div className="col-8">
					{	renderDriverChip(props) }
				</div>
				<div className="col-4">
					{
						props.counts
							? <><b>{ totalPoints }</b> pts</>
							: <b>{`P${props.index+1}`}</b>
					}
				</div>
			</div>
		</div>
	)
}

export default ResultsChip
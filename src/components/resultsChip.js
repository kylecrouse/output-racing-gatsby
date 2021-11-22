import * as React from 'react'
import DriverChip from '../components/driverChip'
import * as styles from './resultsChip.module.scss'

const ResultsChip = (props) => {
	return (
		<div className={ styles.container }>
			{ props.results
					.map((item, index) => {
						return (
							<ResultItem
								driver={item.driver}
								result={
									props.counts
										? <><b>{ parseInt(item.points) + parseInt(item.bonus) + parseInt(item.penalty) }</b> pts</>
										: <b>{`P${index+1}`}</b>
								}
							/>
						)
					})
			}
		</div>
	)
}

const ResultItem = (props) => {
	return (
		<div className={ styles.item }>
			<div className="columns">
				<div className="col-8">
					<DriverChip { ...props.driver } link={false}/>
				</div>
				<div className="col-4">
					{ props.result }
				</div>
			</div>
		</div>
	)
}

export default ResultsChip
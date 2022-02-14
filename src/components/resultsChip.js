import * as React from 'react'
import DriverChip from '../components/driverChip'
import * as styles from './resultsChip.module.scss'

const ResultsChip = (props) => {
	return (
		<div className={ `${styles.container} ${props.hideSm && 'hide-sm'}` }>
			{ props.results
					.map((item, index) => (
						<ResultItem
							key={`result-${index}`}
							driver={item.member ? item.member : item.driverName}
							result={
								props.counts
									? <><b>{ item.totalPoints }</b> pts</>
									: <b>{`P${index+1}`}</b>
							}
						/>
					))
			}
		</div>
	)
}

const ResultItem = (props) => {
	return (
		<div className={ styles.item }>
			<div className="columns">
				<div className="col-8">
					{	props.driver.hasOwnProperty('driverName')
							? <DriverChip { ...props.driver } link={false} />
							: <DriverChip 
									active={false}
									driverName={ props.driver }
									link={false}
								/>
					}
				</div>
				<div className="col-4">
					{ props.result }
				</div>
			</div>
		</div>
	)
}

export default ResultsChip
import * as React from 'react'
import DriverChip from './driverChip'
import * as styles from './standingsCard.module.scss'

const StandingsCard = (props) => {
	return (
		<div className={ styles.container }>
			<div className={ styles.position }>
				<span>{props.position}</span>
			</div>
			<DriverChip {...props.driver} link={false} showNumberArt={false} />
			<div className={ styles.totalPoints }>
				<b>{props.totalPoints}</b> pts
			</div>
		</div>		
	)
}

export default StandingsCard
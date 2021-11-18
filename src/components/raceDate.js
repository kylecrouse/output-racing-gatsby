import * as React from 'react'
import moment from 'moment'
import * as styles from './raceDate.module.css'

const RaceDate = (props) => {
	const date = moment(props.date)
	return (
		<div className={ styles.date }>
			<span className={ styles.day }>
				{ date.format('DD') }
			</span> 
			<span className={ styles.month }>
				{ date.format('MMM').toUpperCase() }
			</span>
		</div>
	)
}

export default RaceDate
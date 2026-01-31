import * as React from 'react'
import RaceDate from '../components/raceDate'
import * as styles from './raceChip.module.scss'

const RaceChip = (props) => {
	return (
		<div className={ styles.container }>
			{ props.trackConfig?.trackIracingId &&
					<div className={ styles.logo }>
						<img
							src={`https://images-static.iracing.com/img/logos/tracks/${props.trackConfig.trackIracingId}__light.png`}
							alt={ `${props.trackConfig?.trackName} logo` }
						/>
					</div>
			}
			<RaceDate date={ props.raceDate }/>
			<div className={ styles.track }>
				{ props.trackConfig?.trackName &&
					<h4>{ props.trackConfig.trackName }</h4>
				}
				<h5>{ props.eventName?.replace(/&#?(\w+);/g, ($0, $1) => String.fromCharCode($1)) }</h5>
			</div>
		</div>
	)
}

export default RaceChip
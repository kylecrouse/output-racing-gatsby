import * as React from 'react'
import RaceDate from '../components/raceDate'
import * as styles from './raceChip.module.scss'

const RaceChip = (props) => {
	return (
		<div className={ styles.container }>
			{ props.trackLogo &&
					<div className={ styles.logo }>
						<img 
							src={`https://images-static.iracing.com${props.trackLogo}`}
							alt={ `${props.trackName} logo` }
						/>
					</div>
			}
			<RaceDate date={ props.raceDate }/>
			<div className={ styles.track }>
				{ props.trackName &&
					<h4>{ props.trackName }</h4>
				}
				<h5>{ props.eventName }</h5>
			</div>
		</div>
	)
}

export default RaceChip
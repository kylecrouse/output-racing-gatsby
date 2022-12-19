import * as React from 'react'
import RaceDate from '../components/raceDate'
import * as styles from './raceChip.module.scss'

const RaceChip = (props) => {
	return (
		<div className={ styles.container }>
			{ props.trackAsset &&
					<div className={ styles.logo }>
						<img 
							src={`https://images-static.iracing.com${props.trackAsset.logo}`}
							alt={ `${props.trackConfig?.trackName} logo` }
						/>
					</div>
			}
			<RaceDate date={ props.raceDate }/>
			<div className={ styles.track }>
				{ props.trackConfig?.trackName &&
					<h4>{ props.trackConfig.trackName }</h4>
				}
				<h5>{ props.eventName }</h5>
			</div>
		</div>
	)
}

export default RaceChip
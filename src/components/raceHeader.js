import * as React from 'react'
import RaceDate from '../components/raceDate'
import * as styles from './raceHeader.module.scss'

const RaceHeader = (props) => {
	return (
		<>
			{ props.track && props.track.logo &&
					<div className={ styles.logo }>
						<img 
							src={ props.track.logo }
							alt={ `${props.track.name} logo` }
						/>
					</div>
			}
			<RaceDate date={ props.date }/>
			<div className={ styles.track }>
				{ props.track && props.track.name &&
					<h4>{ props.track.name }</h4>
				}
				<h5>{ props.name }</h5>
			</div>
		</>
	)
}

export default RaceHeader
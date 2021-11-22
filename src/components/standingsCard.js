import * as React from 'react'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import DriverChip from './driverChip'
import * as styles from './standingsCard.module.scss'

const StandingsCard = (props) => {
	return (
		<div className={ styles.container }>
			<h5 className={ styles.header }>P <b>{props.position}</b></h5>
			{ props.driver.media && 
				props.driver.media
					.slice(0, 1)
					.map(image => (
						<GatsbyImage 
							alt="car screenshot"
							className={ styles.image }
							image={ getImage(image) } 
						/>
					)) 
			}
			<div className={ styles.details }>
				<DriverChip {...props.driver} />
				<dl>
					<dt>Wins</dt>
					<dd>{ props.wins }</dd>
					<dt>Top 5</dt>
					<dd>{ props.t5s }</dd>
					<dt>Points</dt>
					<dd>{ props.points } </dd>
				</dl>
			</div>
		</div>		
	)
}

export default StandingsCard
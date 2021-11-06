import * as React from 'react'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import DriverChip from './driverChip'
import * as styles from './driverCard.module.css'

const DriverCard = (props) => {
	return (
		<div className={ styles.container }>
			{ props.driver.media 
				? props.driver.media
						.slice(0, 1)
						.map(image => (
							<GatsbyImage 
								alt="car screenshot"
								className={ styles.image }
								image={ getImage(image) } 
							/>
						)) 
				: <div className={`${styles.image}  ${styles.placeholder}`}/>
			}
			<div className={ styles.stats }>
				<div className={ styles.driver }>
					{ !props.driver.numberArt &&
						<div className={ styles.numberText }>
							{ props.driver.number || '-' }
						</div>	
					}
					<DriverChip {...props.driver} />
				</div>
				<dl>
					<dt>Starts</dt>
					<dd>{ props.starts } </dd>
					<dt>Wins</dt>
					<dd>{ props.wins }</dd>
					<dt>Top 5s</dt>
					<dd>{ props.top5s }</dd>
				</dl>
			</div>
		</div>		
	)
}

export default DriverCard
import * as React from 'react'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import DriverChip from './driverChip'
import * as styles from './standingsCard.module.scss'

const StandingsCard = (props) => {
	return (
		<div className={ styles.container }>
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
				{ props.fields && 
					<dl>
						{ props.fields.map(field => (
								<>
									<dt>{ field.name }</dt>
									<dd>{ field.value }</dd>
								</>
							))
						}
					</dl>
				}
			</div>
		</div>		
	)
}

export default StandingsCard
import * as React from 'react'
import DriverChip from './driverChip'
import * as styles from './driverCard.module.css'

const DriverCard = (props) => {
	return (
		<a 
			className={ styles.container } 
			href={`drivers/${props.driverName.replace(/\s/g,'-').toLowerCase()}`}
		>
			<div className={ styles.stats }>
				<div className={ styles.driver }>
					{ !props.driverNumberArt &&
						<div className={ styles.numberText }>
							{ props.carNumber || '-' }
						</div>	
					}
					<DriverChip {...props} link={false} />
				</div>
				<dl className="hide-sm">
					<dt>Starts</dt>
					<dd>{ props.stats?.starts ?? 0 } </dd>
					<dt>Wins</dt>
					<dd>{ props.stats?.wins ?? 0 }</dd>
					<dt>Top 5</dt>
					<dd>{ props.stats?.top5s ?? 0 }</dd>
					<dt>Rating</dt>
					<dd>{ props.stats?.rating ?? 0 }</dd>
				</dl>
			</div>
		</a>		
	)
}

export default DriverCard
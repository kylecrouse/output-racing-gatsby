import * as React from 'react'
import { Link } from 'gatsby'
import DriverChip from './driverChip'
import * as styles from './driverCard.module.scss'

const DriverCard = (props) => {
	const showNumberArt = props.seriesName !== 'night-owl-series'
	return (
		<Link 
			className={ styles.container } 
			to={`${props.driverName.replace(/\s/g,'-').toLowerCase()}`}
		>
			<div className={ styles.stats }>
				<div className={ styles.driver }>
					{ (!showNumberArt || (showNumberArt && !props.driverNumberArt)) &&
						<div className={ `${styles.numberText} number-plate-${props.seriesName}` }>
							{ props.carNumber || '-' }
						</div>	
					}
					{ props.driverCarLogo &&
						<div className={styles.carLogo}>
							<img src={props.driverCarLogo.publicURL} alt="manufacturer logo"/>
						</div>
					}
					<DriverChip {...props} showNumberArt={showNumberArt} link={false} />
				</div>
				<dl className="hide-sm">
					<dt>Starts</dt>
					<dd>{ props.driverCareerStats?.starts ?? '-' } </dd>
					<dt>Wins</dt>
					<dd>{ props.driverCareerStats?.wins ?? '-' }</dd>
					<dt>Top 5</dt>
					<dd>{ props.driverCareerStats?.top5s ?? '-' }</dd>
					<dt>Rating</dt>
					<dd>{ props.driverCareerStats?.rating?.toFixed(0) ?? '-' }</dd>
				</dl>
			</div>
		</Link>		
	)
}

export default DriverCard
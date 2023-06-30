import * as React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import DriverChip from './driverChip'
import * as styles from './driverCard.module.scss'

const DriverCard = (props) => {
	const data = useStaticQuery(graphql`
		{
			logos: allFile(filter: { relativePath: { glob: "cars/*.svg" } }) {
				nodes {
					name
					publicURL
				}
			}
		}
	`)
	
	const showNumberArt = props.seriesId !== 8100
	
	const { starts, wins, top5s, rating, car } = React.useMemo(
		() => {
			const stats = props.participants.reduce(
				(acc, p) => {
					if (!p.race 
						|| p.race.provisional === 'Y'
						|| p.race.schedule.pointsCount === 'N' 
						|| p.race.schedule.chase === 'Y'
						|| p.finishPos === null
						|| p.race.schedule.season.series.seriesId !== props.seriesId
					) 
						return acc
					acc.starts += 1
					if (p.finishPos === 1) 
						acc.wins += 1
					if (p.finishPos <= 5)
						acc.top5s += 1
					acc.rating += p.loopstat?.rating ?? 0
					if (p.race.schedule.season.series.currSeasonId === p.race.schedule.season.seasonId
							&& (!acc.recent || p.race.schedule.raceDate > acc.recent.race.schedule.raceDate)
					) 
						acc.recent = p
					return acc
				},
				{ starts: 0, wins: 0, top5s: 0, rating: 0, recent: null }
			)
			stats.rating = stats.rating / stats.starts
			stats.car = stats.recent?.car
			return stats
		}, 
		[props.participants, props.seriesId]
	)
	
	const logo = React.useMemo(
		() => data.logos.nodes.find(
			(node) => Math.floor(node.name) === car?.carId	
		),
		[data, car]
	)
	
	return (
		<Link 
			className={ styles.container } 
			to={`${(props.driverNickName ?? props.driverName).replace(/\s/g,'-').toLowerCase()}`}
		>
			<div className={ styles.stats }>
				<div className={ styles.driver }>
					{ (!showNumberArt || (showNumberArt && !props.carNumberArt)) &&
						<div className={ `${styles.numberText} number-plate-${props.seriesName}` }>
							{ props.carNumber?.length <= 2 ? props.carNumber : '-' }
						</div>	
					}
					{ logo &&
						<div className={styles.carLogo}>
							<img src={logo.publicURL} alt={`${car.carName} logo`}/>
						</div>
					}
					<DriverChip 
						active={true}
						driverName={props.driverNickName ?? props.driverName}
						carNumber={props.carNumber ?? props.driverNumber}
						showNumberArt={showNumberArt} 
						driverNumberArt={props.carNumberArt}
						link={false} 
					/>
				</div>
				<dl className="hide-sm">
					<dt>Starts</dt>
					<dd>{ starts > 0 ? starts : '-' } </dd>
					<dt>Wins</dt>
					<dd>{ wins > 0 ? wins : '-' }</dd>
					<dt>Top 5</dt>
					<dd>{ top5s > 0 ? top5s : '-' }</dd>
					<dt>Rating</dt>
					<dd>{ rating > 0 ? rating.toFixed(0) : '-' }</dd>
				</dl>
			</div>
		</Link>		
	)
}

export default DriverCard
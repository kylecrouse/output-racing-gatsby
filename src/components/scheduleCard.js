import * as React from 'react'
import moment from 'moment-timezone'
import Cars from '../components/cars'
import RaceChip from '../components/raceChip'
import ResultsChip from '../components/resultsChip'
import outputLogo from '../images/output-logo.svg'
import nightowlLogo from '../images/reverb-logo.svg'
import * as styles from './scheduleCard.module.scss'

const ScheduleCard = (props) => {
	const date = moment(`${props.raceDate.split('T')[0]}T${props.raceTime ?? '21:00:00'}`).tz("America/Los_Angeles")
	const getDuration = () => {
		return moment.duration(date.diff(moment().tz("America/Los_Angeles")))
	}
	const [duration, setDuration] = React.useState(getDuration)
	React.useEffect(() => {
		if (!(props.countdown && duration?.asSeconds() > 0)) 
			return
		const timer = setTimeout(() => {
			setDuration(getDuration)
		}, 1000)
		return () => clearTimeout(timer)
	})
	return (
		<div className={ `${styles.container} ${props.className}` }>
			<div className={ styles.header }>
				{ props.seriesId === 8100
						? <img src={nightowlLogo} alt="Reverb Series"/>
						: <img src={outputLogo} alt="Output Series"/>
				}
				<h3>
					<span>
						{`${props.seasonName}\u000a`}
						<span className={props.title ? 'chase' : 'round'}>
							{ props.title ?? `Round ${props.raceNumber}` }
						</span>
					</span>
				</h3>
			</div>
			<RaceChip {...props}/>
			{ props.trackAsset &&
					<div className={ styles.map }>
						<img src={`${props.trackAsset.map}${props.trackAsset.layers.active}`} alt="track map"/>
					</div>
			}
			{ props.race 
					? <ResultsChip
							counts={props.pointsCount}
							results={
								props.race.participants
									.sort((a, b) => a.finishPos - b.finishPos)
									.slice(0, 3)
							}
							hideSm={true}
						/>
					: props.countdown
							? duration?.asSeconds() > 0 &&
									<div className={ styles.countdown }>
										<h3>Countdown to Green</h3>
										<div className="columns">
											<div className="col-3">
												<b>{ parseInt(duration.asDays()) }</b> days
											</div>
											<div className="col-3">
												<b>{ duration.hours() }</b> hours
											</div>
											<div className="col-3">
												<b>{ duration.minutes() }</b> minutes
											</div>
											<div className="col-3">
												<b>{ duration.seconds() }</b> seconds
											</div>
										</div>
									</div>
							: props.seasonClass?.length > 0 &&
									<Cars cars={props.seasonClass[0]?.seasonClassCars} />
			}
		</div>
	)
}

export default ScheduleCard
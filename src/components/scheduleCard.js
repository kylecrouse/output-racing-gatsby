import * as React from 'react'
import moment from 'moment'
import Cars from '../components/cars'
import RaceChip from '../components/raceChip'
import ResultsChip from '../components/resultsChip'
import * as styles from './scheduleCard.module.scss'

const ScheduleCard = (props) => {
	const date = moment(props.date)
	const getDuration = () => {
		return moment.duration(date.diff(moment()))
	}
	const [duration, setDuration] = React.useState(getDuration)
	React.useEffect(() => {
		const timer = setTimeout(() => {
			setDuration(getDuration)
		}, 1000)
		return () => clearTimeout(timer)
	})
	return (
		<div className={ styles.container }>
			<div className={ styles.header }>
				<h3><span>Round <span>{props.round + 1}</span></span></h3>
			</div>
			<RaceChip {...props}/>
			<img className={ styles.map } src={ props.track.map } alt="track map"/>
			{ props.cars &&
				<Cars cars={props.cars} />
			}
			{ !props.uploaded && duration.asSeconds() > 0 &&
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
			}
			{ props.results &&
					<ResultsChip
						counts={props.counts}
						results={
							props.results
								.slice(0, 3)
								.sort((a, b) => a.finish - b.finish)
						}
					/>
			}
		</div>
	)
}

export default ScheduleCard
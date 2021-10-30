import * as React from 'react'
import moment from 'moment'
import './scheduleCard.css'
import DriverChip from '../components/driverChip'
import Cars from '../components/cars'

const ScheduleCard = (props) => {
	const date = moment(props.date)
	const diff = date.diff(moment())
	const duration = moment.duration(diff)
	return (
		<div className="schedule-card">
			<div className="schedule-round">
				<h3><span>Round <span>{props.round + 1}</span></span></h3>
			</div>
			<img 
				className="schedule-track-logo" 
				src={ props.track.logo }
				alt={ `${props.track.name} logo` }
			/>
			<div className="schedule-details">
				<div className="schedule-date">
					<span className="schedule-day">
						{ date.format('DD') }
					</span> 
					<span className="schedule-month">
						{ date.format('MMM').toUpperCase() }
					</span>
				</div>
				<div className="schedule-track">
					<h4>{ props.track.name }</h4>
					<h5>{ props.name }</h5>
				</div>
			</div>
			<img className="schedule-track-map" src={ props.track.map } alt="track map"/>
			{ props.cars &&
				<Cars cars={props.cars} />
			}
			{ !props.uploaded &&
					<div className="schedule-countdown">
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
					<div className="schedule-results">
						{ props.results
								.slice(0, 3)
								.sort((a, b) => a.finish - b.finish)
								.map(item => {
									return (
										<div className="schedule-result-item">
											<div className="columns">
												<div className="col-8">
													<DriverChip { ...item.driver }/>
												</div>
												<div className="col-4">
													<b>{ parseInt(item.points) + parseInt(item.bonus) + parseInt(item.penalty) }</b> pts
												</div>
											</div>
										</div>
									)
								})
						}
					</div>
			}
		</div>
	)
}

export default ScheduleCard
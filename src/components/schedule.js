import * as React from 'react'
import { Link } from 'gatsby'
import moment from 'moment'
import RaceChip from '../components/raceChip'
import ResultsChip from '../components/resultsChip'
import * as styles from './schedule.module.css'

const Schedule = (props) => {
	console.log(props)
	return (
		<div className={ styles.container }>
			{ props.events.filter(event => event.offWeek === 'N').map((event, index) => {
					return event.chase
						? <div key={`schedule-${index}`} className={ styles.chase }>
								{ event.eventName || 'Chase for the Championship' }
							</div>
						: event.race
							?	<Link 
									key={`schedule-${index}`} 
									to={ `/${props.uri.split('/')[1]}/results/${event.race.raceId}` } 
									className={ styles.details }
								>
									<RaceChip {...event}/>
									<ResultsChip
										counts={event.pointsCount === 'Y'}
										results={
											event.race.participants
												.sort((a, b) => (a.finishPos ?? 999) - (b.finishPos ?? 999))
												.slice(0, 3)
										}
										hideSm={true}
									/>
								</Link>
							: <div key={`schedule-${index}`} className={ styles.details }>
									<RaceChip {...event}/>
									<div className={ `${styles.info} hide-sm` }>
										<div>
											{ event.plannedTime
													? <span>
															<b>{`${moment.duration(event.plannedTime).asMinutes()}`}</b> minutes
														</span>
													: event.plannedLaps && 
														<span>
															<b>{`${event.plannedLaps}`}</b>
															{`\u00A0laps`}
														</span>
											}
											{ event.trackConfig?.trackConfigName?.toLowerCase() !== 'oval' &&
													<span>{ event.trackConfigName }</span>
											}
											{ event.pointsCount === 'N' && <span>non-points</span> }
										</div>
									</div>
								</div>
				}) 
			}
		</div>
	)
}

export default Schedule
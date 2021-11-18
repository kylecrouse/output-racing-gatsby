import * as React from 'react'
import Cars from '../components/cars'
import DriverChip from '../components/driverChip'
import RaceHeader from '../components/raceHeader'
import * as styles from './schedule.module.css'

const Schedule = (props) => {
	return (
		<div className={ styles.container }>
			{ props.schedule.map((race) => {
					const config = race.track.config.replace(`${race.track.name}`, '')
					const { results = [] } = race.results || {}
					return race.chase
							? (
									<div className={ styles.chase }>
										{ race.name }
									</div>
								)
							: (
									<a href={ `/results/${race.raceId}` } className={ styles.details }>
										<RaceHeader {...race}/>
										{	results.length > 0
												?	<div className={ styles.results }>
														{ results
																.slice(0, 3)
																.sort((a, b) => a.finish - b.finish)
																.map((item, index) => {
																	const driver = props.drivers.find(({ name }) => name === item.name)
																	return (
																		<div className={ styles.resultItem }>
																			<div className="columns">
																				<div className="col-8">
																					<DriverChip { ...driver } link={false}/>
																				</div>
																				<div className="col-4">
																					{ race.counts
																							? <><b>{ parseInt(item.points) + parseInt(item.bonus) + parseInt(item.penalty) }</b> pts</>
																							: <b>{`P${index+1}`}</b>
																					}
																				</div>
																			</div>
																		</div>
																	)
																})
														}
													</div>
												: race.track && race.track.name &&
														<div className={ styles.info }>
															<div>
																{ !race.counts && <span>non-points</span> }
																{ config && config.toLowerCase() !== ' oval' &&
																		<span>{ config }</span>
																}
																<span>{race.laps ? `${race.laps}\u00A0laps` : race.time}</span>
															</div>
															{ props.cars &&
																<Cars cars={props.cars} />
															}
														</div>
										}
									</a>
								)
				}) 
			}
		</div>
	)
}

export default Schedule
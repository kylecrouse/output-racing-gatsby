import * as React from 'react'
import Cars from '../components/cars'
import RaceChip from '../components/raceChip'
import ResultsChip from '../components/resultsChip'
import * as styles from './schedule.module.css'

const Schedule = (props) => {
	return (
		<div className={ styles.container }>
			{ props.schedule.map((race) => {
					const config = race.track.config.replace(`${race.track.name}`, '')
					const { results = [] } = race.results || {}
					return race.chase
							? <div className={ styles.chase }>
									{ race.name }
								</div>
							: results.length > 0
									?	<a href={ `/results/${race.raceId}` } className={ styles.details }>
											<RaceChip {...race}/>
											<ResultsChip
												counts={race.counts}
												results={
													results
														.slice(0, 3)
														.sort((a, b) => a.finish - b.finish)
														.map((item, index) => {
															return ({
																...item,
																driver: props.drivers.find(({ name }) => name === item.name)
															})
														})	
												}
												hideSm={true}
											/>
										</a>
									: race.track && race.track.name &&
											<div className={ styles.details }>
												<RaceChip {...race}/>
												<div className={ `${styles.info} hide-sm` }>
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
											</div>
				}) 
			}
		</div>
	)
}

export default Schedule
import * as React from 'react'
import './seasonCard.css'
import DriverChip from '../components/driverChip'
import Cars from '../components/cars'

const SeasonCard = (props) => {
	const name = props.name.match(/Output Racing (\d+) (Season \d)?(.*)/)
	return (
		<a href={`/${props.path}/${props.id}`} className="season-card">
			<div className="season-details">
				<div className="season-date">
					<span className="season-day">
						{ name[1].replace('20','\'') }
					</span> 
				</div>
				<div className="season-track">
					{ name[2] && <h4>{ name[2] }</h4> }
					{ name[3] && <h5>{ name[3] }</h5> }
				</div>
			</div>
			{ props.cars &&
				<Cars cars={props.cars} />
			}
			{ props.standings &&
					<div className="season-results">
						{ props.standings
								.slice(0, 3)
								.sort((a, b) => a.position - b.position)
								.map(item => {
									return (
										<div className="season-result-item">
											<div className="columns">
												<div className="col-8">
													<DriverChip { ...item.driver }/>
												</div>
												<div className="col-4">
													<b>{ item.points }</b> pts
												</div>
											</div>
										</div>
									)
								})
						}
					</div>
			}
		</a>
	)
}

export default SeasonCard
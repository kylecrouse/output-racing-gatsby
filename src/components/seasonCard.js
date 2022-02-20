import * as React from 'react'
import { Link } from 'gatsby'
import './seasonCard.css'
import DriverChip from '../components/driverChip'
import Cars from '../components/cars'

const pathify = (string) => string.replace(/[:-]/g, '').replace(/\s+/g, '-').toLowerCase()

const SeasonCard = (props) => {
	const [, year, head, , subhead] = React.useMemo(
		() => props.seasonName.match(/^20(\d+) ((Winter )?Season\s?\d?)?:?(.*)/),
		[props.seasonName]
	)
	const standings = React.useMemo(
		() => props.standings && props.standings.slice(0, 3)
			.map((item, index) => (
				<div key={`seasonCardStanding${index}`} className="season-result-item">
					<div className="columns">
						<div className="col-8">
							{	item.member
									? <DriverChip { ...item.member } link={false} />
									: <DriverChip 
											active={false}
											driverName={ item.driverName }
											link={false}
										/>
							}						
						</div>
						<div className="col-4">
							<b>{ item.totalPoints }</b> pts
						</div>
					</div>
				</div>
			)),
		[props.standings]
	)
	return (
		<Link to={`/${props.path}/${pathify(props.seasonName)}`} className="season-card">
			<div className="season-details">
				<div className="season-date">
					<span className="season-day">
						{ `'${year}` }
					</span> 
				</div>
				<div className="season-track">
					{ head && <h4>{ head }</h4> }
					{ subhead && <h5>{ subhead }</h5> }
				</div>
			</div>
			{ props.seasonClass?.length > 0 &&
				<Cars cars={props.seasonClass[0]?.seasonClassCars} />
			}
			{ props.standings &&
					<div className="season-results">
						{ standings }
					</div>
			}
		</Link>
	)
}

export default SeasonCard
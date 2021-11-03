import * as React from 'react'
import SeasonCard from './seasonCard'
import './seasons.css'

const Seasons = (props) => {
	return (
		<div class="columns">
			{ props.seasons.map(season => {
				season.standings = season.standings
					.slice(0, 3)
					.map(item => ({
						...item,
						driver: props.drivers.find(
							({ name }) => name === item.driver
						)
					}))
				season.cars = season.cars.map(
					name => props.cars.find(car => car.name === name)
				)
				return (
					<div class="col-4 season-container">
						<SeasonCard {...season} path={props.path}/>
					</div>
				)
			})
		}
	</div>
	)
}

export default Seasons
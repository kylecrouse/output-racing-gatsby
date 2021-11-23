import * as React from 'react'
import { Carousel, Slide } from './carousel'
import SeasonCard from './seasonCard'
import './seasons.css'

const Seasons = (props) => {
	let seasons = {}
	props.seasons.forEach(season => {
		const [, year] = season.name.match(/Output Racing (\d+)/);
		if (seasons[year])
			seasons[year].push(season)
		else
			seasons[year] = [season]
	})

	return (
		<Carousel options={{ type: "carousel", gap: 0 }}>
			{	Object.entries(seasons)
					.sort((a, b) => b[0] - a[0])
					.map(([years, seasons]) => (
						<Slide>
							<div className="columns">
								{ seasons.map((season, i, a) => {
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
											<div className={`col-4 col-sm-10 ${i === 0 ? 'col-ml-auto' : i === a.length - 1 ? 'col-mr-auto' : ''} season-container`}>
												<SeasonCard {...season} path={props.path}/>
											</div>
										)
									})
								}
							</div>
						</Slide>
					))
			}
		</Carousel>
	)
}

export default Seasons
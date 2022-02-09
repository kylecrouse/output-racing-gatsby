import * as React from 'react'
import { Carousel, Slide } from './carousel'
import SeasonCard from './seasonCard'
import './seasons.css'

const Seasons = (props) => {
	let seasons = React.useRef()
	React.useMemo(
		() => {
			seasons.current = props.seasons.reduce(
				(a, season) => {
					const [year] = season.seasonName.match(/^\d+/)
					if (a[year])
						a[year] = [season, ...a[year]]
					else
						a[year] = [season]
					return a
				},
				{}
			)
			seasons.current = Object.entries(seasons.current)
				.sort((a, b) => b[0] - a[0])
				.map(([years, seasons], i) => (
					<Slide key={`seasonSlide${i}`}>
						<div className="columns">
							{ seasons.map((season, i, a) => (
									<div key={`seasonCard${i}`} className={`col-4 col-sm-10 ${i === 0 ? 'col-ml-auto' : i === a.length - 1 ? 'col-mr-auto' : ''} season-container`}>
										<SeasonCard {...season} path={props.path}/>
									</div>
								))
							}
						</div>
					</Slide>
				))
		},
		[props.seasons, props.path]
	)

	return (
		<Carousel options={{ type: "carousel", gap: 0 }}>
			{	seasons.current }
		</Carousel>
	)
}

export default Seasons
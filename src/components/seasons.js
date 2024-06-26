import * as React from 'react'
import { Carousel, Slide } from './carousel'
import SeasonCard from './seasonCard'
import './seasons.css'

const Seasons = (props) => {
	return (
		<Carousel options={{ type: props.seasons.length > 3 ? "carousel" : "slider", perView: 3, rewind: true, breakpoints: { 960: { perView: 2 }, 680: { perView: 1 }}}}>
			{ props.seasons.map((season, i) => (
					<Slide key={`seasonCard${i}`}>
						<SeasonCard {...season} path={props.path}/>
					</Slide>
				))
			}
		</Carousel>
	)
}

export default Seasons
import * as React from 'react'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import './car.css'

const Car = (props) => {
	const image = getImage(props.image)
	return (
		<figure key={props.name} className="car-container">
			<GatsbyImage image={image} alt={props.name} className="car-image" />
			<figcaption className="car-caption">{props.name}</figcaption>
		</figure>
	)
}

export default Car
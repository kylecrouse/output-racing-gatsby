import * as React from 'react'
import './car.css'

const Car = (props) => {
	return (
		<figure key={props.name} className="car-container">
			<img src={props.image} alt={props.name} className="car-image" style={{ transform: props.transform }}/>
			<figcaption className="car-caption">{props.name}</figcaption>
		</figure>
	)
}

export default Car
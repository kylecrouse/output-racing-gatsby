import * as React from 'react'
import './cars.css'
import Car from './car'

const Cars = (props) => {
	const cars = React.useMemo(
		() => props.cars.map(
			(car, index) => <Car key={`car${index}`} {...car}/>
		),
		[props.cars]
	)
	return (
		<div className={`cars-container ${props.className}`}>
			{ cars }
		</div>
	)
}

export default Cars
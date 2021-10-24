import * as React from 'react'
import './cars.css'
import Car from './car'

const Cars = (props) => {
	return (
		<div className="cars-container">
			{ props.cars.map(car => <Car {...car}/>) }
		</div>
	)
}

export default Cars
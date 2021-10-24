import * as React from 'react'
import './driverChip.css'

const DriverChip = (props) => {
	return props.active ? (
		<a href={`/driver/${props.name.replace(/\s/g, '-').toLowerCase()}/`} className="driverChip">
			{ props.numberArt &&
				<NumberArt number={props.number} image={props.numberArt.file.url}/>
			}
			{props.nickname || props.name}
		</a>    
	) : (
		<div className="driverChip">
			{ props.numberArt &&
				<NumberArt number={props.number} image={props.numberArt.file.url}/>
			}
			{props.nickname || props.name}
		</div>    
	)
}

const NumberArt = (props) => {
	return (
		<div className="numberArtContainer">
			<img className="numberArt" src={ props.image } alt={props.number} />
		</div>
	)
}

export default DriverChip
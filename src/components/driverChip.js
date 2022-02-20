import * as React from 'react'
import { Link } from 'gatsby'
import './driverChip.scss'

const DriverChip = (props) => {
	return (
		<div className={`driverChip ${props.className} ${!props.active ? 'inactive' : ''}`}>
			{ (props.showNumberArt || props.showNumberArt === undefined) && props.driverNumberArt &&
				<NumberArt number={props.driverNumber} image={props.driverNumberArt.file.url}/>
			}
			{ (props.showNumberArt || props.showNumberArt === undefined) &&
				<div className="numberPlate">{props.carNumber || '-'}</div>
			}
			{ props.active && props.link !== false
				? <Link to={`drivers/${props.driverName.replace(/\s/g, '-').toLowerCase()}/`}>
						{ renderName(props) }
					</Link>
				: renderName(props)
			}
			{ props.children &&  
				<div className="driver-children">{ props.children }</div>
			}
		</div>    
	)
}

const NumberArt = (props) => {
	return (
		<div className="numberArtContainer">
			<img className="numberArt" src={props.image} alt={props.number} />
		</div>
	)
}

const renderName = (props) => {
	const name = props.driverNickname || props.driverName || ''
	const parts = name.split(' ')
	const last = parts.pop()
	return (
		<span className="driver-name">
			<span className="first-name">
				{ parts.join(' ') }
			</span>
			&nbsp;
			<span className="last-name">
				{ last }
			</span>
		</span>
	)
}

export default DriverChip
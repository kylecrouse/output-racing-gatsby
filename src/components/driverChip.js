import * as React from 'react'
import './driverChip.css'

const DriverChip = (props) => {
	return props.active && props.link !== false ? (
		<a 
			href={`/drivers/${props.name.replace(/\s/g, '-').toLowerCase()}/`} 
			className={`driverChip ${props.className}`}
		>
			{ props.numberArt &&
				<NumberArt number={props.number} image={props.numberArt.file.url}/>
			}
			{ renderName(props) }
			{ props.children &&  
					<div className="driver-children">{ props.children }</div>
			}
		</a>    
	) : (
		<div className={`driverChip ${props.className} ${!props.active ? 'inactive' : ''}`}>
			{ props.numberArt &&
				<NumberArt number={props.number} image={props.numberArt.file.url}/>
			}
			{ renderName(props) }
			{ props.children &&  
				<div className="driver-children">{ props.children }</div>
			}
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

const renderName = (props) => {
	const name = props.nickname || props.name || ''
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
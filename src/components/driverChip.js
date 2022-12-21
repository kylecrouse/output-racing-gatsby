import * as React from 'react'
import { Link } from 'gatsby'
import './driverChip.scss'

const DriverChip = (props) => {
	return (
		<div className={`driverChip ${props.className} ${!props.active ? 'inactive' : ''}`}>
			{ (props.showNumberArt || props.showNumberArt === undefined) 
					&& props.numberPlate
						? <div className="numberPlate" style={props.carNumber.length > 2 ? { fontSize: '1rem' } : {}}>{props.carNumber || '-'}</div>
						: props.driverNumberArt 
								&& <NumberArt number={props.driverNumber} image={props.driverNumberArt.file.url}/>				
			}
			{ props.active && props.link !== false
				? <Link to={`/${props.location?.pathname.split('/')[1]}/drivers/${props.driverName.replace(/\s/g, '-').toLowerCase()}/`}>
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

export const renderDriverChip = (props, children = null) => {
	const { driver, seriesId, link } = props
	return (
		<DriverChip
			location={props.location}
			active={!!driver.member}
			driverName={driver.member?.driverNickName ?? driver.driverName}
			carNumber={driver.member?.carNumber ?? driver.driverNumber}
			driverNumberArt={driver.member?.carNumberArt}
			numberPlate={seriesId === 8100}
			link={link}
		>
			{ children }
		</DriverChip>
	)
}

export default DriverChip
import * as React from 'react'
import './license.css'

const License = (props) => {
	return (
		<ul className="license-container">
			<li>
				<span style={{ backgroundColor: `#${props.licColor}`, color: props.licGroup === 3 ? 'black' : 'white' }}> {props.licGroupDisplayName}
					<span>{props.srPrime}.{props.srSub}</span>
				</span>
			</li>
			<li>
				<span style={{ border: "1px solid black" }}>
					iRating <span>{props.iRating}</span>
				</span>
			</li>
		</ul>		
	)
}

export default License
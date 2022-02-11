import * as React from 'react'
import * as styles from './license.module.scss'

const License = (props) => {
	return (
		<ul className={ `${styles.container} hide-sm` }>
			<li style={{ backgroundColor: `#${props.licColor}`, color: props.licGroup === 3 ? 'black' : 'white' }}>
				<span>
					{props.licGroupDisplayName.replace('Class ', '')}&nbsp;
					{props.srPrime}.{props.srSub}
				</span>
			</li>
			<li style={{ borderRightColor: `#${props.licColor}` }}>
				<span>{`${Math.floor(props.iRating/100)/10}k`}</span>
			</li>
		</ul>		
	)
}

export default License
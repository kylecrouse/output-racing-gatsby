import * as React from 'react'
import * as styles from './license.module.scss'

const License = (props) => {
	const licenseClass = props.license.replace('Class ', '')
	return (
		<ul className={ `${styles.container} class-${licenseClass} hide-sm` }>
			<li>
				<span>
					{licenseClass}&nbsp;
					{props.sr}
				</span>
			</li>
			<li>
				<span>{`${(Math.floor(props.ir/100)/10).toFixed(1)}k`}</span>
			</li>
		</ul>		
	)
}

export default License
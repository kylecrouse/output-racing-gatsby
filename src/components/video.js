import * as React from 'react'
import * as styles from './video.module.scss'

const Video = (props) => {
	return (
		<div className={`${styles.container} ${props.className}`} style={props.style}>
			<iframe title="broadcast" className={ styles.video } src={props.src} allowFullScreen></iframe>
		</div>
	)
}

export default Video
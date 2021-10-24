import * as React from 'react'
import './video.css'

const Video = (props) => {
	return (
		<div className="video-container" style={props.style}>
			<iframe title="broadcast" className="video" src={props.src} allowFullScreen></iframe>
		</div>
	)
}

export default Video
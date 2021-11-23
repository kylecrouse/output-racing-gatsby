import * as React from 'react'
import * as styles from './video.module.scss'

const Video = (props) => {
	return (
		<div className={`${styles.container} ${props.className}`} style={ props.style }>
			{ props.src && 
				<video className={ styles.video } autoPlay loop muted>
					{ props.src.mp4 && <source src={ props.src.mp4 } type="video/mp4" /> }
					{ props.src.ogg && <source src={ props.src.ogg } type="video/ogg" /> }
					{/* Your browser does not support the video tag. */}
				</video>
			}
			{ props.href && 
				<iframe title="broadcast" className={ styles.video } src={ props.href } allowFullScreen/>
			}
		</div>
	)
}

export default Video
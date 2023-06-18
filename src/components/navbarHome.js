import * as React from 'react'
import logo from '../images/logo.png'
import * as styles from './navbarHome.module.scss'

const Navbar = (props) => {
	return (
		<header>
			<div className="container">
				<div className={`${styles.navbar} columns col-gapless`}>
					<div className="column col-8 col-xl-10 col-lg-12 col-mx-auto">
						<img src={logo} alt="Output Racing"/>
						<div className={styles.tagline}>
							<p>An Asphalt Oval League for the Late-Night Racer</p>
						</div>
					</div>
				</div>
			</div>
		</header>
	)
}

export default Navbar
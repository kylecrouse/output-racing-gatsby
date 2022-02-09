import * as React from 'react';
import './nav.scss'
import logo from '../images/logo.png'
import outputLogo from '../images/output-logo.svg'
import nightowlLogo from '../images/nightowl-logo.svg'

const Nav = (props) => {
	return (
		<section className="navbar-section">
			<a href="/" className="navbar-brand mr-2">
				<img src={logo} alt="Output Racing" className="logo"/>
			</a>
			<a href="/output-series/schedule" className="output-logo">
				<img src={outputLogo} alt="Output Series"/>
			</a>
			<a href="/night-owl-series/schedule" className="nightowl-logo">
				<img src={nightowlLogo} alt="Night Owl Series"/>
			</a>
		</section>
	)
}

export default Nav
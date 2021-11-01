import * as React from 'react'
import './footer.css'
import Nav from './nav'
import logo from '../images/logo.png'

const Footer = (props) => {
	return (
		<footer className="footer col-8 col-mx-auto">
			<Nav {...props}/>
			<div class="columns">
				<div class="col-6">
					<a href="/">
						<img src={logo} alt="Output Racing" className="logo"/>
					</a>
				</div>
				<div class="col-6">
					<p class="text-right">&copy; {new Date().getFullYear()} Output Racing League</p>
				</div>
			</div>
		</footer>
	)
}

export default Footer
import * as React from 'react'
import './navbar.css'
import Nav from './nav'
import logo from '../images/logo.png'

const Navbar = (props) => {
	return (
		<header>
			<div className="container">
				<div className="columns col-gapless">
					<div className="navbar column col-8 col-xl-10 col-lg-12 col-mx-auto">
						<section className="navbar-section">
							<a href="/" className="navbar-brand mr-2">
								<img src={logo} alt="Output Racing" className="logo"/>
							</a>
						</section>              
						<section className="navbar-section">
							<Nav {...props}/>
						</section>
					</div>
				</div>
			</div>
		</header>
	)
}

export default Navbar
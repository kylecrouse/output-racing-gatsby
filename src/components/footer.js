import * as React from 'react'
import './footer.css'
import Nav from './nav'
import logo from '../images/logo.png'

const Footer = (props) => {
	return (
		<footer className="footer col-8 col-xl-10 col-mx-auto">
			<div className="about columns">
				<div className="col-6 col-md-12 col-mr-auto">
					<p>Output Racing is an online sim racing league on iRacing.</p>
					<p>We put this league together to provide a place for the late night racer to hang out, make friends and race hard. Established in mid 2018 with the goal of building a competitive league without toxic people or egos, we focused on building a tight knit community that meshes well on and off the track.</p>
					<p>If you are a late night racer that is looking for a fun group to chill and race with once a week, feel free to apply. We welcome a wide range of skill levels with a minimum C class 2.0 SR license and 1000 IR.</p>
					<p><a href="/apply" className="btn btn-primary"><span>Apply Now</span></a></p>
				</div>
				<div className="col-4 col-md-12 col-ml-auto">
					<Nav {...props}/>
				</div>
			</div>
			<div className="columns">
				<div className="col-6">
					<a href="/">
						<img src={logo} alt="Output Racing" className="logo"/>
					</a>
				</div>
				<div className="col-6">
					<p className="text-right">&copy; {new Date().getFullYear()} Output Racing League</p>
				</div>
			</div>
		</footer>
	)
}

export default Footer
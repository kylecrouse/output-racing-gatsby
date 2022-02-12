import * as React from 'react'
import './footer.css'
import logo from '../images/logo.png'
import outputLogo from '../images/output-logo.svg'
import nightOwlLogo from '../images/nightowl-logo.svg'

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
					<div className="footer-nav-container">
							<a href="/output-series/schedule" className="output-logo">
								<img src={outputLogo} alt="Output Series"/>
							</a>		
							<nav className="footer-nav">
								<a href={`/output-series/drivers`}>
									<span>Drivers</span>
								</a>
								<a href={`/output-series/schedule`}>
									<span>Schedule</span>
								</a>
								<a href={`/output-series/standings`}>
									<span>Standings</span>
								</a>
								<a href={`/output-series/stats`}>
									<span>Stats</span>
								</a>
							</nav>
						<hr/>
							<a href="/night-owl-series/schedule" className="night-owl-logo">
								<img src={nightOwlLogo} alt="Night Owl Series"/>
							</a>		
							<nav className="footer-nav">
								<a href={`/night-owl-series/drivers`}>
									<span>Drivers</span>
								</a>
								<a href={`/night-owl-series/schedule`}>
									<span>Schedule</span>
								</a>
								<a href={`/night-owl-series/standings`}>
									<span>Standings</span>
								</a>
								<a href={`/night-owl-series/stats`}>
									<span>Stats</span>
								</a>
							</nav>
						<hr/>
							<nav className="footer-nav">
								<a href="https://www.youtube.com/c/AussieSimCommentator" target="_blank" rel="noreferrer">
									<span>Broadcast</span>
								</a>
								<a href="https://shop.champsspeedshop.com/collections/t-shirts/products/output-racing-league-t-shirt" target="_blank" rel="noreferrer">
									<span>Merch</span>
								</a>
								<a href="/rules" className={props.page === 'rules' ? 'active' : ''}>
									<span>Rules</span>
								</a>
								<a href="/protest" className={props.page === 'protest' ? 'active' : ''}>
									<span>Protest</span>
								</a>
								<a href="/apply" className={props.page === 'apply' ? 'active' : ''}>
									<span>Apply</span>
								</a>
							</nav>
					</div>
				</div>
			</div>
			<div className="columns">
				<div className="col-6 text-left">
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
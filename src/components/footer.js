import * as React from 'react'
import { Link } from 'gatsby'
import './footer.css'
import logo from '../images/logo.png'
import outputLogo from '../images/output-logo.svg'
import nightOwlLogo from '../images/reverb-logo.svg'

const Footer = (props) => {
	return (
		<footer className="footer col-8 col-xl-10 col-mx-auto">
			<div className="about columns">
				<div className="col-5 col-sm-12 col-mr-auto">
					<p>Output Racing is an online sim racing league on iRacing.</p>
					<p>We put this league together to provide a place for the late night racer to hang out, make friends and race hard. Established in mid-2018 with the goal of building a competitive league without toxic people or egos, we focused on building a tight-knit community that meshes well on and off the track.</p>
					<p>If you are a late-night racer that is looking for a fun group to chill and race with once a week, feel free to apply. We welcome a wide range of skill levels with a minimum C class 2.0 SR license and 1000 IR.</p>
					<p><Link to="/apply" className="btn btn-primary"><span>Apply Now</span></Link></p>
				</div>
        <div className="col-6 col-sm-12 footer-nav-container">
              <Link to="/output-series/schedule" className="output-logo">
								<img src={outputLogo} alt="Output Series"/>
							</Link>		
							<nav className="footer-nav">
								<Link to={`/output-series/drivers`}>
									<span>Drivers</span>
								</Link>
								<Link to={`/output-series/schedule`}>
									<span>Schedule</span>
								</Link>
								<Link to={`/output-series/standings`}>
									<span>Standings</span>
								</Link>
								<Link to={`/output-series/stats`}>
									<span>Stats</span>
								</Link>
							</nav>

            <hr/>
							<Link to="/reverb-series/schedule" className="reverb-logo">
								<img src={nightOwlLogo} alt="Night Owl Series"/>
							</Link>		
							<nav className="footer-nav">
								<Link to={`/reverb-series/drivers`}>
									<span>Drivers</span>
								</Link>
								<Link to={`/reverb-series/schedule`}>
									<span>Schedule</span>
								</Link>
								<Link to={`/reverb-series/standings`}>
									<span>Standings</span>
								</Link>
								<Link to={`/reverb-series/stats`}>
									<span>Stats</span>
								</Link>
							</nav>
							<hr/>
							<nav className={`footer-nav`}>
								<a href="https://www.youtube.com/c/AussieSimCommentator" target="_blank" rel="noreferrer">
									<span>Broadcast</span>
								</a>
								<Link to="/news">
									<span>News</span>
								</Link>
								<a href="https://shop.champsspeedshop.com/collections/t-shirts/products/output-racing-league-t-shirt" target="_blank" rel="noreferrer">
									<span>Merch</span>
								</a>
								<Link to="/rules">
									<span>Rules</span>
								</Link>
								<Link to="/protest">
									<span>Protest</span>
								</Link>
								<Link to="/apply">
									<span>Apply</span>
								</Link>
							</nav>
        </div>
			</div>
			<div className="columns">
				<div className="col-6 text-left">
					<Link to="/">
						<img src={logo} alt="Output Racing" className="logo"/>
					</Link>
				</div>
        <div className="col-6">
          <p className="text-right">&copy; {new Date().getFullYear()} Output Racing League</p>
        </div>
			</div>
		</footer>
	)
}

export default Footer
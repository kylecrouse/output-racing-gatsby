import * as React from 'react'
import './navbar.scss'
import logo from '../images/logo.png'
import outputLogo from '../images/output-logo.svg'
import nightowlLogo from '../images/nightowl-logo.svg'

const Navbar = (props) => {
	return (
		<header>
			<div className="container">
				<div className={`navbar columns col-gapless ${props.series ? 'with-subnav' : 'no-subnav'}`}>
					<div className="column col-8 col-xl-10 col-lg-12 col-mx-auto">
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
						<section className="navbar-section">
							<nav className="nav">
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
						</section>
					</div>
				</div>
				{ props.series &&
					<div className="subnav columns col-gapless">
						<div className="column col-8 col-xl-10 col-lg-12 col-mx-auto col-gapless">
							<div className="subnav-section">
								{	props.series === 'night-owl-series'
										? (	<a href="/night-owl-series/schedule" className="nightowl-logo">
													<img src={nightowlLogo} alt="Night Owl Series"/>
												</a>
											)
										: (	<a href="/output-series/schedule" className="output-logo">
													<img src={outputLogo} alt="Output Series"/>
												</a>		
											)
								}
							</div>
							<div className="subnav-section">
								<nav className="nav">
									<a href={`/${props.series}/drivers`} className={props.page === 'drivers' ? 'active' : ''}>
										<span>Drivers</span>
									</a>
									<a href={`/${props.series}/schedule`} className={props.page === 'schedule' ? 'active' : ''}>
										<span>Schedule</span>
									</a>
									<a href={`/${props.series}/standings`} className={props.page === 'standings' ? 'active' : ''}>
										<span>Standings</span>
									</a>
									<a href={`/${props.series}/stats`} className={props.page === 'stats' ? 'active' : ''}>
										<span>Stats</span>
									</a>
								</nav>
							</div>
						</div>
					</div>	
				}
			</div>
		</header>
	)
}

export default Navbar
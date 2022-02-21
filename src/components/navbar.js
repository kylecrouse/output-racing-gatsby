import * as React from 'react'
import { Link } from 'gatsby'
import './navbar.scss'
import './nav.scss'
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
							<Link to="/" className="navbar-brand mr-2">
								<img src={logo} alt="Output Racing" className="logo"/>
							</Link>
							<Link to="/output-series/schedule" className={`output-logo ${props.series === 'output-series' ? 'hide-sm' : ''}`}>
								<img src={outputLogo} alt="Output Series"/>
							</Link>
							<Link to="/night-owl-series/schedule" className={`nightowl-logo ${props.series === 'night-owl-series' ? 'hide-sm' : ''}`}>
								<img src={nightowlLogo} alt="Night Owl Series"/>
							</Link>
						</section>	
						<section className="navbar-section">
							<nav className="nav">
								<a href="https://www.youtube.com/c/AussieSimCommentator" target="_blank" rel="noreferrer">
									<span>Broadcast</span>
								</a>
								<a href="https://shop.champsspeedshop.com/collections/t-shirts/products/output-racing-league-t-shirt" target="_blank" rel="noreferrer">
									<span>Merch</span>
								</a>
								<Link to="/rules" activeClassName="active">
									<span>Rules</span>
								</Link>
								<Link to="/protest" activeClassName="active">
									<span>Protest</span>
								</Link>
								<Link to="/apply" activeClassName="active">
									<span>Apply</span>
								</Link>
							</nav>
						</section>
					</div>
				</div>
				{ props.series &&
					<div className="subnav columns col-gapless">
						<div className="column col-8 col-xl-10 col-lg-12 col-mx-auto col-gapless">
							<div className="subnav-section">
								{	props.series === 'night-owl-series'
										? (	<Link to="/night-owl-series/schedule" className="nightowl-logo">
													<img src={nightowlLogo} alt="Night Owl Series"/>
												</Link>
											)
										: (	<Link to="/output-series/schedule" className="output-logo">
													<img src={outputLogo} alt="Output Series"/>
												</Link>		
											)
								}
							</div>
							<div className="subnav-section">
								<nav className="nav">
									<Link to={`/${props.series}/drivers`} activeClassName="active" partiallyActive={true}>
										<span>Drivers</span>
									</Link>
									<Link to={`/${props.series}/schedule`} activeClassName="active" partiallyActive={true}>
										<span>Schedule</span>
									</Link>
									<Link to={`/${props.series}/standings`} activeClassName="active" partiallyActive={true}>
										<span>Standings</span>
									</Link>
									<Link to={`/${props.series}/stats`} activeClassName="active">
										<span>Stats</span>
									</Link>
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
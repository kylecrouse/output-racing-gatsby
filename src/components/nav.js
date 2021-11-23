import * as React from 'react';
import './nav.css'


const Nav = (props) => {
	return (
		<nav className="nav">
			<a href="/drivers" className={props.page === 'drivers' ? 'active' : ''}>
				<span>Drivers</span>
			</a>
			<a href="/schedule" className={props.page === 'schedule' ? 'active' : ''}>
				<span>Schedule</span>
			</a>
			<a href="/standings" className={props.page === 'standings' ? 'active' : ''}>
				<span>Standings</span>
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
			<a href="https://shop.champsspeedshop.com/collections/t-shirts/products/output-racing-league-t-shirt" target="_blank" rel="noreferrer">
				<span>Merch</span>
			</a>
		</nav>
	)
}

export default Nav
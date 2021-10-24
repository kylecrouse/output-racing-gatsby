import * as React from 'react'
import './footer.css'
import Nav from './nav'

const Footer = (props) => {
	return (
		<footer className="footer">
			<Nav {...props}/>
			<p>&copy; {new Date().getFullYear()} Output Racing League</p>
		</footer>
	)
}

export default Footer
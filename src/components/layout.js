import * as React from 'react'
import 'spectre.css/dist/spectre.min.css'
import 'spectre.css/dist/spectre-icons.min.css'
import 'spectre.css/dist/spectre-exp.min.css'
import './layout.css'
import Navbar from './navbar'
import Footer from './footer'

const Layout = (props) => {
	const path = props.uri.split('/');
	return (
		<React.Fragment>
			<Navbar page={ path[1] }/>
			{ props.children }
			<Footer/>
		</React.Fragment>
	)
}

export default Layout
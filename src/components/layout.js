import * as React from 'react'
import { Helmet } from 'react-helmet'
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
			<Helmet>
				<link rel="stylesheet" href="https://use.typekit.net/ovc0kir.css"/>
			</Helmet>
			<Navbar page={ path[1] }/>
			{ props.children }
			<Footer/>
		</React.Fragment>
	)
}

export default Layout
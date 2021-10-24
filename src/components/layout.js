import * as React from 'react'
import 'spectre.css/dist/spectre.min.css'
import 'spectre.css/dist/spectre-exp.min.css'
import './layout.css'
import Navbar from './navbar'
import Footer from './footer'

const Layout = (props) => {
	return (
		<React.Fragment>
			<Navbar page={props.uri.substr(1)}/>
			<div className="container content">
				<div className="columns">
					<div className="column col-8 col-xl-12 col-mx-auto">
						{props.children}
					</div>
				</div>
			</div>
			<Footer/>
		</React.Fragment>
	)
}

export default Layout
import * as React from 'react'
import 'spectre.css/dist/spectre.min.css'
import 'spectre.css/dist/spectre-icons.min.css'
import 'spectre.css/dist/spectre-exp.min.css'
import './layout.css'
import Navbar from './navbar'
import Footer from './footer'

const Layout = (props) => {
	const path = props.uri.split('/');
	let content = props.children
	if (!(path[1] === '' || path[1] === 'protest' || path[1] === 'apply' || (path[1] === 'drivers' && path.length > 2)))
		content = <div className="container content">
				<div className="columns">
					<div className="column col-8 col-xl-12 col-mx-auto">
						{props.children}
					</div>
				</div>
			</div>
	return (
		<React.Fragment>
			<Navbar page={ path[1] }/>
			{ content }
			<Footer/>
		</React.Fragment>
	)
}

export default Layout
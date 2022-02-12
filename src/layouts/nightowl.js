import * as React from 'react'
import { Helmet } from 'react-helmet'
import 'spectre.css/dist/spectre.min.css'
import 'spectre.css/dist/spectre-icons.min.css'
import 'spectre.css/dist/spectre-exp.min.css'
import './layout.scss'
import Navbar from '../components/navbar'
import Footer from '../components/footer'

const Layout = ({ pageContext, uri, children }) => {
	React.useEffect(() => {
		document.documentElement.style.setProperty('--highlight-color', '#FF0066')
		document.documentElement.style.setProperty('--primary-color', '#0FC3E8')
		document.documentElement.style.setProperty('--secondary-color', '#0194BE')
		document.documentElement.style.setProperty('--highlight-opposite-color', 'white')
	}, [])
	return (
		<>
			<Helmet>
				<style type="text/css">{ `body { padding-top: 6.5rem; }` }</style>
			</Helmet>
			<Navbar series={pageContext.seriesName} page={ uri.split('/')[1] } />
			{ children }
			<Footer />
		</>
	)	
}

export default Layout
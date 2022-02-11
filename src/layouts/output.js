import * as React from 'react'
import 'spectre.css/dist/spectre.min.css'
import 'spectre.css/dist/spectre-icons.min.css'
import 'spectre.css/dist/spectre-exp.min.css'
import './layout.scss'
import Navbar from '../components/navbar'
import Footer from '../components/footer'

const Layout = ({ pageContext, uri, children }) => {
	React.useEffect(() => {
		document.documentElement.style.setProperty('--highlight-color', '#fccc00')
		document.documentElement.style.setProperty('--primary-color', '#530388')
		document.documentElement.style.setProperty('--secondary-color', '#37096c')
		document.documentElement.style.setProperty('--highlight-opposite-color', '#37096c')
	}, [])
	return (
		<>
			<Navbar series={pageContext.seriesName} page={ uri.split('/')[2] } />
			{ children }
			<Footer />
		</>
	)	
}

export default Layout
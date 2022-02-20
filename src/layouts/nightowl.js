import * as React from 'react'
import { Helmet } from 'react-helmet'
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
				<body className="night-owl-series"/>
			</Helmet>
			<Navbar series={pageContext.seriesName} page={ uri.split('/')[2] } />
			{ children }
			<Footer />
		</>
	)	
}

export default Layout
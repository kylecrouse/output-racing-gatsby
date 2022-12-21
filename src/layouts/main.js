import * as React from 'react'
import './layout.scss'
import Navbar from '../components/navbar'
import Footer from '../components/footer'

const Layout = ({ children }) => {
	React.useEffect(() => {
		document.documentElement.style.setProperty('--highlight-color', '#fccc00')
		document.documentElement.style.setProperty('--highlight-opposite-color', '#37096c')
	}, [])
	return (
		<>
			<Navbar />
			{ children }
			<Footer />
		</>
	)	
}

export default Layout
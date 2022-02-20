import * as React from 'react'
import './layout.scss'
import Navbar from '../components/navbar'
import Footer from '../components/footer'

const Layout = ({ children }) => {
	return (
		<>
			<Navbar />
			{ children }
			<Footer />
		</>
	)	
}

export default Layout
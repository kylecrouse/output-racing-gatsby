import * as React from 'react'
import 'spectre.css/dist/spectre.min.css'
import 'spectre.css/dist/spectre-icons.min.css'
import 'spectre.css/dist/spectre-exp.min.css'
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
import * as React from "react"
import Layout from '../components/layout'
import Meta from '../components/meta'

const ProtestPage = (props) => {
	return (
		<Layout {...props}>
			<main className="container">
				
				<div className="columns">
					<div className="column col-8 col-xl-10 col-lg-12 col-mx-auto content">
						<iframe title="protest" src="https://docs.google.com/forms/d/e/1FAIpQLSdH-nRenusYWx1CzQ7E4F-p0VjHoLkorNgCUTGT33ZGYC4TPQ/viewform?embedded=true" frameBorder="0">Loading…</iframe>
					</div>
				</div>
	
			</main>
		</Layout>
	)
}

export default ProtestPage

export const Head = (props) => (
	<Meta {...props}/>
)
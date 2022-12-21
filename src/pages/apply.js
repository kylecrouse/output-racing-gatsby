import * as React from "react"
import Layout from '../components/layout'
import Meta from '../components/meta'

const ApplyPage = (props) => {
	return (
		<Layout {...props}>
			<main className="container">
			
				<div className="columns">
					<div className="column col-8 col-xl-10 col-lg-12 col-mx-auto content">
						<iframe title="application" src="https://docs.google.com/forms/d/e/1FAIpQLSfqlx-RMiOXR0e0CPrpfhZ-7LLH4ewtaS__O5EkM-q7TGwXEg/viewform?embedded=true" frameBorder="0">Loading…</iframe>
					</div>
				</div>
	
			</main>
		</Layout>
	)
}

export default ApplyPage

export const Head = (props) => (
	<Meta {...props}/>
)
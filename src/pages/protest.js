import * as React from "react"
import { Helmet } from 'react-helmet'

const ProtestPage = () => {
	return (
		<main>
			
			<Helmet>
				<meta charSet="utf-8" />
				<title>Output Racing League | Protest</title>
			</Helmet>

			<div class="content">
				<iframe title="protest" src="https://docs.google.com/forms/d/e/1FAIpQLSdH-nRenusYWx1CzQ7E4F-p0VjHoLkorNgCUTGT33ZGYC4TPQ/viewform?embedded=true" frameBorder="0">Loading…</iframe>
			</div>

		</main>
	)
}

export default ProtestPage
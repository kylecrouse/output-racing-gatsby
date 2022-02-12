import * as React from 'React'

import MainLayout from '../layouts/main'
import OutputLayout from '../layouts/output'
import NightOwlLayout from '../layouts/nightowl'

const Layout = props => {
	const { seriesName = null } = props.pageContext
	return (
		seriesName === 'night-owl-series'
			? <NightOwlLayout {...props}/>
			: seriesName === 'output-series'
					? <OutputLayout {...props}/>
					: <MainLayout {...props}/>
	)
}

export default Layout
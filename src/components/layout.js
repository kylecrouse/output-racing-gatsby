import * as React from 'React'

import OutputLayout from '../layouts/output'
import NightOwlLayout from '../layouts/nightowl'

const Layout = props => {
	const { seriesName = null } = props.pageContext
	return (
		seriesName === 'night-owl-series'
			? (
					<NightOwlLayout {...props}>
						{ props.children }
					</NightOwlLayout>
				)
			: (
					<OutputLayout {...props}>
						{ props.children }
					</OutputLayout>	
				)
	)
}

export default Layout
import * as React from 'React'

const OutputLaytout = React.lazy(
	() => import('../layouts/output')
)
const NightOwlLayout = React.lazy(
	() => import('../layouts/nightowl')
)

const Layout = props => {
	const { seriesName = null } = props.params
	return (
		<React.Suspense fallback={<></>}>
			{	seriesName === 'output-series' && 
					<OutputLayout {...props}>
						{ props.children }
					</OutputLayout>
			}
			{	seriesName === 'night-owl-series' && 
					<NightOwlLayout {...props}>
						{ props.children }
					</NightOwlLayout>
			}
		</React.Suspense>
	)
}
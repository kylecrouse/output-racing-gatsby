import * as React from 'react'
import { Helmet } from 'react-helmet'
import useSiteMetadata from '../hooks/use-site-metadata'
import logo from '../images/logo.png'

const Meta = props => {
	let { title, siteUrl } = useSiteMetadata(),
			description = `An asphalt oval league for the late-night racer.`
	title += ` | ${props.seriesName} ${props.page} | ${props.seasonName}`
	return (
		<Helmet>
			<title>{title}</title>
			<meta property="og:image" content={`${siteUrl}${logo}`} />
			<meta property="og:description" content={description} />
			<meta property="og:title" content={title} />
			<meta property="og:type" content="website"/>
			<meta property="og:url" content={ `${siteUrl}${location.pathname}` } />
			<meta name="twitter:card" content="summary_large_image"/>
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={`${siteUrl}${logo}`} />
			<meta name="theme-color" content="#000000"/>
		</Helmet>
	)
}

export default Meta
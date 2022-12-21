import * as React from 'react'
import useSiteMetadata from '../hooks/use-site-metadata'
import logo from '../images/logo.png'

const depathify = string => string
	.split('/')
	.join(' ')
	.replace(/-/g, ' ')
	.replace(/\w\S*/g, s => `${s.charAt(0).toUpperCase()}${s.substr(1)}`)

const Head = props => {
	let { title, siteUrl } = useSiteMetadata(),
			description = `An asphalt league for the late-night racer.`
	if (props.location.pathname !== '/')
		title += ` | ${depathify(props.location.pathname)}`
	if (props.pageContext.seasonName)
		title += ` | ${depathify(props.pageContext.seasonName)}`
	return (
		<>
			<title>{title}</title>
			<meta property="og:image" content={`${siteUrl}${logo}`} />
			<meta property="og:description" content={description} />
			<meta property="og:title" content={title} />
			<meta property="og:type" content="website"/>
			<meta property="og:url" content={ `${siteUrl}${props.location.pathname}` } />
			<meta name="twitter:card" content="summary_large_image"/>
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={`${siteUrl}${logo}`} />
			<meta name="theme-color" content="#000000"/>
		</>
	)
}

export default Head
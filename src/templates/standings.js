import * as React from 'react'
import { Helmet } from 'react-helmet'
import useSiteMetadata from '../hooks/use-site-metadata'
import Cars from '../components/cars'
import Seasons from '../components/seasons'
import Standings from '../components/standings'
import logo from '../images/logo.png'

const StandingsTemplate = ({ pageContext, location }) => {
	const { season } = pageContext
	const seasons = React.useMemo(() => pageContext.seasons.edges.map(({ node }) => node), [pageContext.seasons])
	const { title, siteUrl } = useSiteMetadata()
	const totalRounds = season.events.filter(({ pointsCount, chase, offWeek }) => pointsCount && !chase && !offWeek)?.length ?? 0
	const roundsCompleted = season.events.filter(({ pointsCount, chase, offWeek, race }) => pointsCount && !chase && !offWeek && race)?.length ?? 0
	return (
		<>
			<main className="container">
	
				<Helmet>
					<title>Output Racing League | {season.seriesName} | {season.seasonName} Standings</title>
					<meta property="og:image" content={`${siteUrl}${logo}`} />
					<meta property="og:description" content={`An asphalt oval league for the late-night racer.`} />
					<meta property="og:title" content={ `${title} | ${season.seasonName} Standings` } />
					<meta property="og:type" content="website"/>
					<meta property="og:url" content={ `${siteUrl}${location.pathname}` } />
					<meta name="twitter:card" content="summary_large_image"/>
					<meta name="twitter:title" content={ `${title} | ${season.seasonName} Standings` } />
					<meta name="twitter:description" content={`An asphalt oval league for the late-night racer.`} />
					<meta name="twitter:image" content={`${siteUrl}${logo}`} />
					<meta name="theme-color" content="#000000"/>
				</Helmet>
				
				<div className="columns">
					<div className="column col-8 col-xl-12 col-mx-auto content">
				
						<hgroup className="page-header columns">
							<div>
								<h2 className="page-title">Standings</h2>
								<h3 className="page-subtitle">
									<span>{ season.seasonName }</span>
									<span>{	roundsCompleted < totalRounds
											? `Round ${roundsCompleted} of ${totalRounds}`
											: 'Final'
									}</span>
								</h3>
							</div>
							{ season.seasonClass?.length > 0 &&
								<Cars cars={season.seasonClass[0]?.seasonClassCars} />
							}
						</hgroup>
	
						<Standings 
							standings={ season.standings }
							fields={ column => ['laps'].includes(column) }
						/>
							
					</div>
				</div>
					
			</main>
	
			<div className="columns seasons-container">
				<div className="column col-8 col-xl-12 col-mx-auto">
					<Seasons path="standings" seasons={seasons} />
				</div>
			</div>
			
		</>
	)
}

export default StandingsTemplate
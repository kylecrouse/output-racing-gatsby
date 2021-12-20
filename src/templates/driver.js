import * as React from "react"
import { Helmet } from 'react-helmet'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import useSiteMetadata from '../hooks/use-site-metadata'
import DriverChip from '../components/driverChip'
import License from '../components/license'
import Table from '../components/table'
import * as styles from './driver.module.scss'

const TYPE_ORDER = ['Overall', 'Short Track', '1-mile', 'Intermediate', '2-mile', 'Superspeedway', 'Road Course', 'Dirt Oval', 'Rallycross']

const DriverTemplate = ({ pageContext: props, location }) => {
	const { title, siteUrl } = useSiteMetadata()
	const driver = props.driver
	const typeStats = React.useMemo(
		() => props.typeStats && [
			{ typeName: 'Overall', ...props.stats },
			...props.typeStats
		].sort((a, b) => TYPE_ORDER.indexOf(a.typeName) - TYPE_ORDER.indexOf(b.typeName)),
		[props.stats, props.typeStats]
	)
	const typeColumns = React.useMemo(
		() => [
			{
				Header: '',
				accessor: 'typeName',
				className: 'cell-typeName'
			},
			{
				Header: 'Starts',
				accessor: 'starts'
			},
			{
				Header: 'Avg Start',
				accessor: 'avgStartPos',
				Cell: ({ value }) => parseFloat(value) > 0 ? value : '-'
			},
			{
				Header: 'Avg Finish',
				accessor: 'avgFinishPos'
			},
			{
				Header: 'Laps',
				accessor: 'lapsCompleted'
			},
			{
				Header: 'Led',
				accessor: 'lapsLed',
			},
			{
				Header: 'Led\u00A0%',
				accessor: 'lapsLedPct',
			},
			{
				Header: 'Inc',
				accessor: 'incidents'
			},
			{
				Header: 'Inc/Race',
				accessor: 'incidentsPerRace'
			},
			{
				Header: 'Inc/Lap',
				accessor: 'incidentsPerLap'
			},
			{
				Header: 'Wins',
				accessor: 'wins'
			},
			{
				Header: 'W%',
				accessor: 'winPct'
			},
			{
				Header: 'T5',
				accessor: 'top5s'
			},
			{
				Header: 'T5%',
				accessor: 'top5Pct'
			},
			{
				Header: 'T10',
				accessor: 'top10s'
			},
			{
				Header: 'T10%',
				accessor: 'top10Pct'
			},
			{
				Header: 'Poles',
				accessor: 'poles'
			},
			{
				Header: `Pole\u00A0%`,
				accessor: 'polePct'
			},
		],
		[]
	)
	const trackColumns = React.useMemo(
		() => [
			{
				Header: 'Track',
				accessor: 'trackName',
				className: 'cell-trackName'
			},
			{
				Header: 'Type',
				accessor: 'typeName',
				className: 'cell-typeName'
			},
			{
				Header: 'Starts',
				accessor: 'starts'
			},
			{
				Header: 'Avg Start',
				accessor: 'avgStartPos',
				Cell: ({ value }) => parseFloat(value) > 0 ? value : '-'
			},
			{
				Header: 'Avg Finish',
				accessor: 'avgFinishPos'
			},
			{
				Header: 'Laps',
				accessor: 'lapsCompleted'
			},
			{
				Header: 'Led',
				accessor: 'lapsLed',
			},
			{
				Header: 'Led\u00A0%',
				accessor: 'lapsLedPct',
			},
			{
				Header: 'Inc',
				accessor: 'incidents'
			},
			{
				Header: 'Inc/Race',
				accessor: 'incidentsPerRace'
			},
			{
				Header: 'Inc/Lap',
				accessor: 'incidentsPerLap'
			},
			{
				Header: 'Wins',
				accessor: 'wins'
			},
			{
				Header: 'W%',
				accessor: 'winPct'
			},
			{
				Header: 'T5',
				accessor: 'top5s'
			},
			{
				Header: 'T5%',
				accessor: 'top5Pct'
			},
			{
				Header: 'T10',
				accessor: 'top10s'
			},
			{
				Header: 'T10%',
				accessor: 'top10Pct'
			},
			{
				Header: 'Poles',
				accessor: 'poles'
			},
			{
				Header: `Pole\u00A0%`,
				accessor: 'polePct'
			},
		],
		[]
	)
	
	return (
		<>
			<Helmet>
				<title>{title} | Drivers | {driver.nickname || driver.name}</title>
				{ driver.media &&
					<meta property="og:image" content={`http:${driver.media[0].file.url}`} />
				}
				<meta property="og:description" content={`${driver.nickname || driver.name}'s driver profile and league statistics.`} />
				<meta property="og:title" content={ `${title} | ${driver.nickname || driver.name}` } />
				<meta property="og:type" content="website"/>
				<meta property="og:url" content={ `${siteUrl}${location.pathname}` } />
				<meta name="twitter:card" content="summary_large_image"/>
				<meta name="twitter:title" content={ `${title} | ${driver.nickname || driver.name}` } />
				<meta name="twitter:description" content={`${driver.nickname || driver.name}'s driver profile and league statistics.`} />
				{ driver.media &&
					<meta name="twitter:image" content={`http:${driver.media[0].file.url}`} />
				}
				<meta name="theme-color" content="#F4A913"/>
			</Helmet>
			
			{ driver.media && 
				driver.media
					.slice(0, 1)
					.map(image => (
						<GatsbyImage 
							alt="car screenshot"
							className={ styles.driverImage }
							image={ getImage(image) } 
						/>
					)) 
			}

			<main className="container">
				
				<div className="columns">   
					<div className="column col-8 col-xl-10 col-lg-12 col-mx-auto content">
					
						<hgroup className={`page-header ${styles.pageHeader}`}>
							<DriverChip 
								{...driver } 
								active={true}
								license={true}
								link={false}
							/>
							{ driver.license && 
								<License {...driver.license}/>
							}
						</hgroup>

						{ typeStats && 
							<Table 
								columns={typeColumns} 
								data={typeStats}
								disableSortBy={true} 
								scrolling={true}
							/>							
						}
						
						<br/>

						{ props.trackStats && 
							<Table 
								columns={trackColumns} 
								data={props.trackStats}
								disableSortBy={true} 
								initialState={{
									sortBy: [{ id: 'trackName', desc: false }]
								}}
								scrolling={true}
							/>							
						}

					</div>
				</div>
	
			</main>
		</>
	)
}

export default DriverTemplate
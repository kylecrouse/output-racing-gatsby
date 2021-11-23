import * as React from "react"
import { Helmet } from 'react-helmet'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import useSiteMetadata from '../hooks/use-site-metadata'
import DriverChip from '../components/driverChip'
import License from '../components/license'
import Table from '../components/table'
import * as styles from './driver.module.scss'

const DriverTemplate = ({ pageContext: props, location }) => {
	const { title, siteUrl } = useSiteMetadata()
	const driver = props.driver
	const columns = React.useMemo(
		() => [
			{
				Header: 'Starts',
				accessor: 'starts'
			},
			{
				Header: 'Avg Start',
				accessor: 'avgStart'
			},
			{
				Header: 'Avg Finish',
				accessor: 'avgFinish'
			},
			{
				Header: 'Laps',
				accessor: 'laps'
			},
			{
				Header: 'Led',
				accessor: 'lapsLed',
			},
			{
				Header: 'Led\u00A0%',
				id: 'ledPercentage',
				Cell: ({ row, value }) => {
					return (
						`${((parseInt(row.original.lapsLed.replace(',','')) / parseInt((row.original.laps || '0').replace(',',''))) * 100).toFixed(0)}%`
					)
				}
			},
			{
				Header: 'Inc',
				accessor: 'incidents'
			},
			{
				Header: 'Inc/Race',
				accessor: 'incidentsRace'
			},
			{
				Header: 'Inc/Lap',
				accessor: 'incidentsLap'
			},
			{
				Header: 'Wins',
				accessor: 'wins'
			},
			{
				Header: 'W%',
				accessor: 'winPercentage'
			},
			{
				Header: 'T5',
				accessor: 'top5s'
			},
			{
				Header: 'T5%',
				accessor: 'top5Percentage'
			},
			{
				Header: 'T10',
				accessor: 'top10s'
			},
			{
				Header: 'T10%',
				accessor: 'top10Percentage'
			},
			{
				Header: 'Poles',
				accessor: 'poles'
			},
			{
				Header: `Pole\u00A0%`,
				accessor: 'polePercentage'
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
					<div className="column col-8 col-xl-12 col-mx-auto content">
					
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

						{ props.stats && 
							<Table 
								columns={columns} 
								data={[props.stats]}
								disableSortBy={true} 
							/>							
						}

					</div>
				</div>
	
			</main>
		</>
	)
}

export default DriverTemplate
import * as React from "react"
import { graphql } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import DriverChip from '../components/driverChip'
import Layout from '../components/layout'
import Meta from '../components/meta'
import License from '../components/license'
import Table from '../components/table'
import * as styles from './driver.module.scss'

const TYPE_ORDER = ['Short Track', '1 mile', 'Intermediate', '2+ mile', 'Superspeedway', 'Road Course', 'Dirt Oval', 'Rallycross', 'Overall']

const DriverTemplate = props => {
	const { driver } = props.data
	const typeStats = React.useMemo(
		() => driver.typeStats && [
			{ typeName: 'Overall', ...driver.stats },
			...driver.typeStats
		].sort((a, b) => TYPE_ORDER.indexOf(a.typeName) - TYPE_ORDER.indexOf(b.typeName)),
		[driver.stats, driver.typeStats]
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
				Header: 'Avg Rating',
				accessor: 'rating'
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
				Header: 'Avg Rating',
				accessor: 'rating'
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
		<Layout {...props}>
			<Meta {...props}/>
			
			{ driver.driverMedia && 
					<GatsbyImage 
						alt="car screenshot"
						className={ styles.driverImage }
						image={ getImage(driver.driverMedia) } 
					/>
			}

			<main className="container">
				
				<div className="columns">   
					<div className="column col-8 col-xl-10 col-lg-12 col-mx-auto content">
					
						<hgroup className={`page-header ${styles.pageHeader}`}>
							<DriverChip 
								{...driver} 
								active={true}
								license={true}
								link={false}
							/>
							<div className={ styles.licenseContainer }>
								{ driver.driverLicenseOval && 
										<License 
											license={driver.driverLicenseOval}
											ir={driver.driverIROval}
											sr={driver.driverSROval}
										/>
								}
								{ driver.driverLicenseRoad && 
										<License 
											license={driver.driverLicenseRoad}
											ir={driver.driverIRRoad}
											sr={driver.driverSRRoad}
										/>
								}
							</div>
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

						{ driver.trackStats && 
							<Table 
								columns={trackColumns} 
								data={driver.trackStats}
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
		</Layout>
	)
}

export const query = graphql`
	query DriverQuery($driverId: Int) {
		driver: simRacerHubDriver(
			driverId: {eq: $driverId}
		) {
			...driverData	
		}	
	}
`

export default DriverTemplate
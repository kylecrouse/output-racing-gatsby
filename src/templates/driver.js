import * as React from "react"
import { graphql } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import { Carousel, Slide } from '../components/carousel'
import DriverChip from '../components/driverChip'
import Layout from '../components/layout'
import Meta from '../components/meta'
import License from '../components/license'
import Table from '../components/table'
import * as styles from './driver.module.scss'

const TYPE_ORDER = ['Overall', 'Short Track', '1 mile', 'Intermediate', '2+ mile', 'Superspeedway', 'Road Course', 'Dirt Oval', 'Rallycross']

const DriverTemplate = props => {
	const { driver } = props.data
	const configStats = React.useMemo(
		() => driver.driverConfigStats && driver.driverConfigStats.stats.length > 1
			? [{ typeName: 'Overall', ...driver.driverCareerStats },
				  ...driver.driverConfigStats.stats
				].sort((a, b) => TYPE_ORDER.indexOf(a.typeName) - TYPE_ORDER.indexOf(b.typeName))
			: [{ typeName: 'Overall', ...driver.driverCareerStats }],
		[driver.driverCareerStats, driver.driverConfigStats]
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
				Header: '%Led',
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
				Header: '%W',
				accessor: 'winPct'
			},
			{
				Header: 'T5',
				accessor: 'top5s'
			},
			{
				Header: '%T5',
				accessor: 'top5Pct'
			},
			{
				Header: 'T10',
				accessor: 'top10s'
			},
			{
				Header: '%T10',
				accessor: 'top10Pct'
			},
			{
				Header: 'Poles',
				accessor: 'poles'
			},
			{
				Header: `%Pole`,
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
				Header: '%Led',
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
				Header: '%W',
				accessor: 'winPct'
			},
			{
				Header: 'T5',
				accessor: 'top5s'
			},
			{
				Header: '%T5',
				accessor: 'top5Pct'
			},
			{
				Header: 'T10',
				accessor: 'top10s'
			},
			{
				Header: '%T10',
				accessor: 'top10Pct'
			},
			{
				Header: 'Poles',
				accessor: 'poles'
			},
			{
				Header: `%Pole`,
				accessor: 'polePct'
			},
		],
		[]
	)
	
	const media = React.useMemo(() => {
		if (!driver.driverMedia) 
			return null
		const slides = driver.driverMedia.reduce(
			(a, m) => {
				if ((props.pageContext.seriesId !== 8100 && m.metadata.tags[0]?.name === 'Series: Night Owl Series') || (props.pageContext.seriesId === 8100 && m.metadata.tags[0]?.name !== 'Series: Night Owl Series'))
					return a
				else 
					return (
						[...a, (
							<Slide>
								<GatsbyImage 
									alt="car screenshot"
									className={ styles.driverImage }
									image={ getImage(m) } 
								/>
							</Slide>	
						)]
					)
			},
			[]
		)
		return slides.length > 1 
			? (
					<Carousel options={{ type: "carousel", showNav: true }}>
						{ slides }
					</Carousel>
				) 
			: slides
	}, [driver.driverMedia, props.pageContext.seriesId])
	
	return (
		<Layout {...props}>
			<Meta {...props}/>
			
			{ media }

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
							<div className="hide-sm">
								{ driver.licenseOval && 
										<License 
											license={driver.licenseOval}
											ir={driver.irOval}
											sr={driver.srOval}
										/>
								}
								{ driver.licenseRoad && 
										<License 
											license={driver.licenseRoad}
											ir={driver.irRoad}
											sr={driver.srRoad}
										/>
								}
							</div>
						</hgroup>

						{ configStats && 
							<Table 
								columns={typeColumns} 
								data={configStats}
								disableSortBy={true} 
								scrolling={true}
							/>							
						}
						
						<br/>

						{ driver.driverTrackStats && 
							<Table 
								columns={trackColumns} 
								data={driver.driverTrackStats.stats}
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
			driverCareerStats {
				starts
				avgStartPos
				avgFinishPos
				wins
				podiums
				top5s
				top10s
				lapsCompleted
				lapsLed
				poles
				incidents
				incidentsPerRace
				winPct
				podiumPct
				top5Pct
				top10Pct
				lapsLedPct
				polePct
				incidentsPerLap
				rating
			}
			driverConfigStats {
				stats {					
					typeName
					starts
					avgStartPos
					avgFinishPos
					wins
					podiums
					top5s
					top10s
					lapsCompleted
					lapsLed
					poles
					incidents
					incidentsPerRace
					winPct
					podiumPct
					top5Pct
					top10Pct
					lapsLedPct
					polePct
					incidentsPerLap
					rating
				}
			}
			driverTrackStats {
				stats {					
					trackName
					typeName
					starts
					avgStartPos
					avgFinishPos
					wins
					podiums
					top5s
					top10s
					lapsCompleted
					lapsLed
					poles
					incidents
					incidentsPerRace
					winPct
					podiumPct
					top5Pct
					top10Pct
					lapsLedPct
					polePct
					incidentsPerLap
					rating
				}
			}
		}	
	}
`

export default DriverTemplate
import * as React from "react"
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import DriverChip from '../../components/driverChip'
import License from '../../components/license'
import Table from '../../components/table'
import * as styles from './driver.module.css'

const DriverPage = ({ data }) => {
	const driver = data.driver
	const name = driver.nickname || driver.name
	const stats = data.stats
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
				<title>Output Racing League | Drivers | { name }</title>
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

						<Table 
							columns={columns} 
							data={[stats]}
							disableSortBy={true} 
						/>

					</div>
				</div>
	
			</main>
		</>
	)
}

export const query = graphql`
	query DriverQuery($name: String) {
		driver: contentfulDriver(name: {eq: $name}) {
			name
			nickname
			number
			numberArt {
				file {
					url
				}
			}
			media {
				gatsbyImageData(
					layout: FULL_WIDTH
					placeholder: BLURRED
				)
			}
			license {
				iRating
				licColor
				licGroup
				licGroupDisplayName
				licLevel
				licLevelDisplayName
				srPrime
				srSub
			}
		}
		stats: contentfulLeagueStatsJsonNode(driver: {eq: $name}) {
			avgFinish
			avgStart
			incidents
			incidentsLap
			incidentsRace
			laps
			lapsLed
			miles
			polePercentage
			poles
			provisionals
			races
			starts
			top10Percentage
			top10s
			top5Percentage
			top5s
			winPercentage
			wins
		}	
	}
`

export default DriverPage
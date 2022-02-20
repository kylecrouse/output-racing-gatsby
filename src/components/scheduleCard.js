import * as React from 'react'
import { useStaticQuery, graphql } from "gatsby"
import moment from 'moment'
import RaceChip from '../components/raceChip'
import ResultsChip from '../components/resultsChip'
import outputLogo from '../images/output-logo.svg'
import nightowlLogo from '../images/nightowl-logo.svg'
import * as styles from './scheduleCard.module.scss'

const ScheduleCard = (props) => {
	const data = useStaticQuery(graphql`
		{
			maps: allFile(filter: { relativePath: { glob: "tracks/*_map.png" } }) {
				edges {
					node {
						name
						publicURL
					}
				}
			}
		}
	`)
	// const image = `https://images-static.iracing.com${props.folder}/${props.smallImage}`
	const { node: mapNode = null } = data.maps.edges.find(({ node }) => node.name === `${props.trackConfigId}_map`) ?? {}
	const date = moment(`${props.raceDate}T${props.raceTime ?? '21:00:00'}`)
	const getDuration = () => {
		return moment.duration(date.diff(moment()))
	}
	const [duration, setDuration] = React.useState(getDuration)
	React.useEffect(() => {
		const timer = setTimeout(() => {
			setDuration(getDuration)
		}, 1000)
		return () => clearTimeout(timer)
	})
	return (
		<div className={ styles.container } style={props.style}>
			<div className={ styles.header }>
				{ props.seriesId === 8100
						? <img src={nightowlLogo} alt="Night Owl Series"/>
						: <img src={outputLogo} alt="Night Owl Series"/>
				}
				<h3>
					{ props.title
							? props.title.split(' ')[0]
							: `Round ${props.raceNumber}`
					}
				</h3>
			</div>
			<RaceChip {...props}/>
			{ mapNode?.publicURL &&
					<img className={ styles.map } src={ mapNode.publicURL } alt="track map"/>
			}
			{ duration && duration.asSeconds() > 0 &&
					<div className={ styles.countdown }>
						<h3>Countdown to Green</h3>
						<div className="columns">
							<div className="col-3">
								<b>{ parseInt(duration.asDays()) }</b> days
							</div>
							<div className="col-3">
								<b>{ duration.hours() }</b> hours
							</div>
							<div className="col-3">
								<b>{ duration.minutes() }</b> minutes
							</div>
							<div className="col-3">
								<b>{ duration.seconds() }</b> seconds
							</div>
						</div>
					</div>
			}
			{ props.race &&
					<ResultsChip
						counts={props.pointsCount}
						results={
							props.race.participants
								.sort((a, b) => a.finishPos - b.finishPos)
								.slice(0, 3)
						}
						hideSm={true}
					/>
			}
		</div>
	)
}

export default ScheduleCard
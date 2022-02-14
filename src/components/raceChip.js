import * as React from 'react'
import { useStaticQuery, graphql } from "gatsby"
import RaceDate from '../components/raceDate'
import * as styles from './raceChip.module.scss'

const RaceChip = (props) => {
	const data = useStaticQuery(graphql`
		{
			allFile(filter: { relativePath: { glob: "tracks/*" } }) {
				edges {
					node {
						name
						publicURL
					}
				}
			}
		}
	`)
	const { node = null } = data.allFile.edges.find(({ node }) => Math.floor(node.name) === props.trackConfigId) ?? {}
	console.log(props.trackName, props.trackConfigId)
	return (
		<div className={ styles.container }>
			{ node?.publicURL &&
					<div className={ styles.logo }>
						<img 
							src={node.publicURL}
							alt={ `${props.trackName} logo` }
						/>
					</div>
			}
			<RaceDate date={ props.raceDate }/>
			<div className={ styles.track }>
				{ props.trackName &&
					<h4>{ props.trackName }</h4>
				}
				<h5>{ props.eventName }</h5>
			</div>
		</div>
	)
}

export default RaceChip
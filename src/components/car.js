import * as React from 'react'
import { useStaticQuery, graphql } from "gatsby"
import './car.css'

const Car = (props) => {
	const data = useStaticQuery(graphql`
		{
			allFile(filter: { name: { glob: "car_*" } }) {
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
	const { node = null } = data.allFile.edges.find(({ node }) => node.name === `car_${props.carId}`) ?? {}
	return node?.publicURL ? (
		<figure key={props.carName} className="car-container">
			<img src={node.publicURL} alt={props.carName} className="car-image" />
			<figcaption className="car-caption">{props.carName}</figcaption>
		</figure>
	) : null
}

export default Car
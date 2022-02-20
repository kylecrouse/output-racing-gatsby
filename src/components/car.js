import * as React from 'react'
import { useStaticQuery, graphql } from "gatsby"
import './car.css'

const Car = (props) => {
	const data = useStaticQuery(graphql`
		{
			cars: allFile(filter: { relativePath: { glob: "cars/car_*.png" } }) {
				edges {
					node {
						name
						publicURL
					}
				}
			}
			logos: allFile(filter: { relativePath: { glob: "cars/*.svg" } }) {
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
	const { node:carNode = null } = data.cars.edges.find(({ node }) => node.name === `car_${props.carId}`) ?? {}
	const { node:logoNode = null } = data.logos.edges.find(({ node }) => Math.floor(node.name) === props.carSimId) ?? {}
	// console.log(props.carName, props.carId, props.carSimId)
	return carNode?.publicURL ? (
		<figure key={props.carName} className="car-container">
			{ logoNode?.publicURL && <img src={logoNode.publicURL} alt={`${props.carName} logo`} className="car-logo" /> }
			<img src={carNode.publicURL} alt={props.carName} className="car-image" />
			<figcaption className="car-caption">{props.carName}</figcaption>
		</figure>
	) : null
}

export default Car
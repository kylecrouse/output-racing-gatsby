// const { createRemoteFileNode } = require("gatsby-source-filesystem")
const path = require('path')
const fs = require('fs-extra')
const { graphql } = require('gatsby')

const pathify = (string) => string.replace(/[:-]/g, '').replace(/\s+/g, '-').toLowerCase()

exports.createResolvers = ({ createResolvers }) => {
	let ContentfulDrivers = {},
			ContentfulRaces = {}

	const publicStaticDir = path.join(
		process.cwd(),
		'public',
		'static'
	)
			
	const getContentfulDriver = async (source, args, context, info) => {
		if (!ContentfulDrivers.hasOwnProperty(source.custid))			
			ContentfulDrivers[source.custid] = await context.nodeModel.findOne({
				query: {
					filter: {
						custId: { eq: source.custid }
					},
				},
				type: "ContentfulDriver",
			})
					
		return ContentfulDrivers[source.custid]
	}
	
	const getContentfulRace = async (source, args, context, info) => {
		if (!ContentfulRaces.hasOwnProperty(source.raceId))			
			ContentfulRaces[source.raceId] = await context.nodeModel.findOne({
				query: {
					filter: {
						raceId: { eq: source.raceId }
					},
				},
				type: "ContentfulRace",
			})
					
		return ContentfulRaces[source.raceId]
	}
	
	const resolvers = {
		SimRacerHubDriver: {
			driverMedia: {
				type: "ContentfulAsset",
				resolve: async (source, args, context, info) => {
					const { media___NODE = null } = await getContentfulDriver(source, args, context, info) ?? {}
					if (!media___NODE) 
						return null				
							
					return context.nodeModel.getNodeById({ id: media___NODE })
				}
			},
			driverNumberArt: {
				type: "ContentfulAsset",
				resolve: async (source, args, context, info) => {
					const { numberArt___NODE = null } = await getContentfulDriver(source, args, context, info) ?? {}
					if (!numberArt___NODE) 
						return null
					
					return context.nodeModel.getNodeById({ id: numberArt___NODE })
				}
			},
		},
		SimRacerHubRace: {
			eventBroadcast: {
				type: "String",
				resolve: async (source, args, context, info) => {
					const { broadcast = null } = await getContentfulRace(source, args, context, info)
					return broadcast
				}
			},
			eventLogo: {
				type: "ContentfulAsset",
				resolve: async (source, args, context, info) => {
					const { logo___NODE = null } = await getContentfulRace(source, args, context, info)
					if (!logo___NODE)
						return null
						
					return context.nodeModel.getNodeById({ id: logo___NODE })
				}
			},
			eventMedia: {
				type: ["ContentfulAsset"],
				resolve: async (source, args, context, info) => {
					const { media___NODE = [] } = await getContentfulRace(source, args, context, info)
					return Promise.all(
						media___NODE.map(
							id => context.nodeModel.getNodeById({ id })
						)
					)
				}
			}
		},
		SimRacerHubParticipant: {
			carImage: {
				type: "File",
				resolve: async (source, args, context, info) => {
					const file = await context.nodeModel.findOne({
						query: {
							filter: {
								relativePath: { eq: `cars/${source.carId}.svg` }
							},
						},
						type: "File",
					}).catch(err => console.log(err))
					return file
				}
			}
		}
	}
	createResolvers(resolvers)
}

exports.createSchemaCustomization = ({ actions }) => {
	const { createTypes } = actions
	const typeDefs = `
		type SimRacerHubSeason implements Node {
			events: [SimRacerHubEvent]
		}
		
		type SimRacerHubSeasonStandings {
			member: SimRacerHubDriver @link(by: "driverId", from: "driverId")
		}
		
		type SimRacerHubEvent {
			race: SimRacerHubRace @link(by: "raceId", from: "raceId")
		}
		
		type SimRacerHubRace implements Node {
			participants: [SimRacerHubParticipant]
			bestAvgPos: DriverSuperlative
			bestFastLap: DriverSuperlative
			bestNumFastLap: DriverSuperlative
			bestAvgFastLap: DriverSuperlative
			bestRestart: DriverSuperlative
			bestPasses: DriverSuperlative
			bestQualityPasses: DriverSuperlative
			bestClosingPasses: DriverSuperlative
			hardCharger: DriverSuperlative
		}
		
		type SimRacerHubParticipant implements Node {
			member: SimRacerHubDriver @link(by: "driverId", from: "driverId")  
		}
		
		type DriverLicense {
			iRating: Int
			licColor: String
			licGroup: Int
			licGroupDisplayName: String
			licLevel: Int
			licLevelDisplayName: String
			srPrime: String
			srSub: String
		}
		
		type DriverSuperlative {
			driverId: Int!
			driver: SimRacerHubDriver @link(by: "driverId", from:"driverId")
		}
	`
	createTypes(typeDefs)
}

exports.createPages = async ({ graphql, actions }) => {
	const { createPage } = actions
	const { data } = await graphql(`
		query {
			drivers: allSimRacerHubDriver(
				filter: {active: {eq: true}}
			) {
				edges {
					node {
						driverId
						driverName
					}
				}
			}
			seasons: allSimRacerHubSeason(
				sort: { 
					fields: events___race___raceDate, 
					order: DESC
				}
			) {
				edges {
					node {
						seriesId
						seriesName
						seasonName
						seasonId
						active
						events {
							race {
								raceId
							}
						}
					}
				}
			}
		}
	`)
	
	// Get all series names
	const series = data.seasons.edges.reduce(
		(a, { node }) => [...a, node.seriesName], 
		[]
	)
	
	// Create drivers pages
	data.drivers.edges.forEach(({ node }) => {
		const seasonName = pathify(node.driverName),
					driverId = node.driverId

		series.forEach(seriesName => {
			seriesName = pathify(seriesName)
			createPage({
				path: `${seriesName}/drivers/${seasonName}`,
				component: path.resolve(`src/templates/driver.js`),
				context: { seriesName, seasonName, driverId },
			})			
		})
	})
	
	series.forEach(seriesName => {
		seriesName = pathify(seriesName)
		createPage({
			path: `${seriesName}/drivers`,
			component: path.resolve(`src/templates/drivers.js`),
			context: { seriesName, seasonName: 'Drivers' },
		})			
	})
	
	// Create schedule, standings and results pages
	data.seasons.edges.forEach(({ node }) => {
		const seriesId = node.seriesId,
					seriesName = pathify(node.seriesName),
					seasonName = pathify(node.seasonName),
					seasonId = node.seasonId
					
		createPage({
			path: `${seriesName}/schedule/${seasonName}`,
			component: path.resolve(`src/templates/schedule.js`),
			context: { seriesId, seriesName, seasonName, seasonId },
		})
		createPage({
			path: `${seriesName}/standings/${seasonName}`,
			component: path.resolve(`src/templates/standings.js`),
			context: { seriesId, seriesName, seasonName, seasonId },
		})
		
		if (node.active === true) {
			createPage({
				path: `${seriesName}/schedule`,
				component: path.resolve(`src/templates/schedule.js`),
				context: { seriesId, seriesName, seasonName, seasonId },
			})
			createPage({
				path: `${seriesName}/standings`,
				component: path.resolve(`src/templates/standings.js`),
				context: { seriesId, seriesName, seasonName, seasonId },
			})
		}
		
		let latestRaceId
		node.events.forEach(({ race }, index) => {
			if (!race) return
			const raceId = race.raceId
			createPage({
				path: `${seriesName}/results/${race.raceId}`,
				component: path.resolve(`src/templates/results.js`),
				context: { seriesName, seasonName, seasonId, raceId },
			})
			if (node.active === true && !latestRaceId) {
				createPage({
					path: `${seriesName}/results`,
					component: path.resolve(`src/templates/results.js`),
					context: { seriesName, seasonName, seasonId, raceId },
				})
				latestRaceId = raceId
			}
		})
	})
}
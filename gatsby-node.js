// const { createRemoteFileNode } = require("gatsby-source-filesystem")
const path = require('path')
const fs = require('fs-extra')
const { graphql } = require('gatsby')

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
			active: {
				type: "Boolean",
				resolve: async (source, args, context, info) => {
					// @TODO: Pull this from iRacing roster presence?
					const { active = false } = await getContentfulDriver(source, args, context, info)
					return active
				}
			},
			driverLicense: {
				type: "DriverLicense",
				resolve: async (source, args, context, info) => {
					const { license___NODE = null } = await getContentfulDriver(source, args, context, info)
					if (!license___NODE) 
						return null				
							
					return context.nodeModel.getNodeById({ id: license___NODE })
				}
			},
			driverMedia: {
				type: "ContentfulAsset",
				resolve: async (source, args, context, info) => {
					const { media___NODE = null } = await getContentfulDriver(source, args, context, info)
					if (!media___NODE) 
						return null				
							
					return context.nodeModel.getNodeById({ id: media___NODE })
				}
			},
			driverNickname: {
				type: "String",
				resolve: async (source, args, context, info) => {
					const { nickname = null } = await getContentfulDriver(source, args, context, info)
					return nickname
				}
			},
			driverNumber: {
				type: "String",
				resolve: async (source, args, context, info) => {
					const { number = null } = await getContentfulDriver(source, args, context, info)
					return number
				}
			},
			driverNumberArt: {
				type: "ContentfulAsset",
				resolve: async (source, args, context, info) => {
					const { numberArt___NODE = null } = await getContentfulDriver(source, args, context, info)
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
			seasons: allSimRacerHubSeason {
				edges {
					node {
						seriesName
						seasonName
						seasonId
					}
				}
			}
		}
	`)
	data.seasons.edges.forEach(({ node }) => {
		createPage({
			path: `${node.seriesName}/schedule/${node.seasonName}`,
			component: path.resolve(`src/templates/schedule.js`),
			context: {
				seasonId: node.seasonId
			},
		})
	})
}
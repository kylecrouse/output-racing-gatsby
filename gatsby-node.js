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
				type: ["ContentfulAsset"],
				resolve: async (source, args, context, info) => {
					const { media___NODE = [] } = await getContentfulDriver(source, args, context, info) ?? {}
					return context.nodeModel.findAll({
						query: {
							filter: {
								id: {in: media___NODE}
							}
						},
						type: 'ContentfulAsset'
					}).then(data => Array.from(data.entries))
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
			driverCarLogo: {
				type: "File",
				resolve: async (source, args, context, info) => {
					const season = await context.nodeModel.findOne({
						query: {
							filter: {
								seriesId: {eq: context.context.seriesId},
								active: {eq: true}
							}
						},
						type: 'SimRacerHubSeason'
					})
					
					const raceId = season.events.reduce(
						(a, { raceId }) => raceId ? [...a, raceId] : a, []
					)
					
					const races = await context.nodeModel.findAll({
						query: {
							filter: {
								raceId: {in: raceId}
							}
						},
						type: 'SimRacerHubRace'
					})
					
					const carId = Array.from(races.entries).reduce(
						(a, { participants }) => {
							const d = participants.find(p => p.driverId === source.driverId) 
							return d ? d.carSimId : a
						}, 
						null
					)
					
					if (!carId)
						return null
					
					return context.nodeModel.findOne({
						query: {
							filter: {
								relativePath: { eq: `cars/${carId}.svg` }
							},
						},
						type: "File",
					}).catch(err => console.log(err))
				}
			},
			driverCareerStats: {
				type: "SimRacerHubCareerStats",
				resolve: async (source, args, context, info) => {
					return context.nodeModel.findOne({
						query: {
							filter: {
								driverId: { eq: source.driverId },
								seriesId: { eq: context.context.seriesId }
							},
						},
						type: "SimRacerHubCareerStats",
					})
				}
			},
			driverTrackStats: {
				type: "SimRacerHubTrackStats",
				resolve: async (source, args, context, info) => {
					return context.nodeModel.findOne({
						query: {
							filter: {
								driverId: { eq: source.driverId },
								seriesId: { eq: context.context.seriesId }
							},
						},
						type: "SimRacerHubTrackStats",
					})
				}
			},
			driverConfigStats: {
				type: "SimRacerHubConfigStats",
				resolve: async (source, args, context, info) => {
					return context.nodeModel.findOne({
						query: {
							filter: {
								driverId: { eq: source.driverId },
								seriesId: { eq: context.context.seriesId }
							},
						},
						type: "SimRacerHubConfigStats",
					})
				}
			},
		},
		SimRacerHubRace: {
			eventBroadcast: {
				type: "String",
				resolve: async (source, args, context, info) => {
					const { broadcast = null } = await getContentfulRace(source, args, context, info) ?? {}
					return broadcast
				}
			},
			eventLogo: {
				type: "ContentfulAsset",
				resolve: async (source, args, context, info) => {
					const { logo___NODE = null } = await getContentfulRace(source, args, context, info) ?? {}
					if (!logo___NODE)
						return null
						
					return context.nodeModel.getNodeById({ id: logo___NODE })
				}
			},
			eventMedia: {
				type: ["ContentfulAsset"],
				resolve: async (source, args, context, info) => {
					const { media___NODE = [] } = await getContentfulRace(source, args, context, info) ?? {}
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
								relativePath: { eq: `cars/${source.carSimId}.svg` }
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
			series: allSimRacerHubSeason {
				group(field: seriesId) {
					fieldValue
					distinct(field: seriesName)
				}
			}
		}
	`)
	
	// Get all series names
	const series = data.series.group.reduce(
		(a, { fieldValue, distinct }) => [
			...a, 
			{ 
				seriesId: Math.floor(fieldValue), 
				seriesName: distinct[0] 
			}
		], 
		[]
	)
	
	// Create drivers pages
	data.drivers.edges.forEach(({ node }) => {
		const seasonName = pathify(node.driverName),
					driverId = node.driverId

		series.forEach(({ seriesId, seriesName }) => {
			seriesName = pathify(seriesName)
			createPage({
				path: `${seriesName}/drivers/${seasonName}`,
				component: path.resolve(`src/templates/driver.js`),
				context: { seriesId, seriesName, seasonName, driverId },
			})			
		})
	})
	
	series.forEach(({ seriesId, seriesName }) => {
		seriesName = pathify(seriesName)
		createPage({
			path: `${seriesName}/drivers`,
			component: path.resolve(`src/templates/drivers.js`),
			context: { seriesId, seriesName, seasonName: 'Drivers' },
		})			
		createPage({
			path: `${seriesName}/stats`,
			component: path.resolve(`src/templates/stats.js`),
			context: { seriesId, seriesName, seasonName: 'Stats' },
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
		
		node.events.forEach(({ race }, index, events) => {
			if (!race) {
				if (events?.[index - 1]?.race && node.active === true)
					createPage({
						path: `${seriesName}/results`,
						component: path.resolve(`src/templates/results.js`),
						context: { seriesId, seriesName, seasonName, seasonId, raceId: events[index - 1].race.raceId },
					})
				return
			}
			createPage({
				path: `${seriesName}/results/${race.raceId}`,
				component: path.resolve(`src/templates/results.js`),
				context: { seriesId, seriesName, seasonName, seasonId, raceId: race.raceId },
			})
		})
	})
}

exports.onCreateWebpackConfig = ({ stage, actions, getConfig }) => {
	if (stage === 'build-javascript' || stage === 'develop') {
			const config = getConfig()

			const miniCssExtractPlugin = config.plugins.find(
					plugin => (plugin.constructor.name === 'MiniCssExtractPlugin')
			)

			if (miniCssExtractPlugin) miniCssExtractPlugin.options.ignoreOrder = true

			actions.replaceWebpackConfig(config)
	}
}
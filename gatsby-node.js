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
		if (!ContentfulDrivers.hasOwnProperty(source.cust_id))			
			ContentfulDrivers[source.cust_id] = await context.nodeModel.findOne({
				query: {
					filter: {
						custId: { eq: source.cust_id }
					},
				},
				type: "ContentfulDriver",
			})
					
		return ContentfulDrivers[source.cust_id]
	}
	
	const getContentfulRace = async (source, args, context, info) => {
		if (!ContentfulRaces.hasOwnProperty(source.race_id))			
			ContentfulRaces[source.raceId] = await context.nodeModel.findOne({
				query: {
					filter: {
						raceId: { eq: source.race_id }
					},
				},
				type: "ContentfulRace",
			})
					
		return ContentfulRaces[source.race_id]
	}
	
	const resolvers = {
		IracingMember: {
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
			// driverCareerStats: {
			// 	type: "SimRacerHubCareerStats",
			// 	resolve: async (source, args, context, info) => {
			// 		return context.nodeModel.findOne({
			// 			query: {
			// 				filter: {
			// 					driverId: { eq: source.driverId },
			// 					seriesId: { eq: context.context.seriesId }
			// 				},
			// 			},
			// 			type: "SimRacerHubCareerStats",
			// 		})
			// 	}
			// },
			// driverTrackStats: {
			// 	type: "SimRacerHubTrackStats",
			// 	resolve: async (source, args, context, info) => {
			// 		return context.nodeModel.findOne({
			// 			query: {
			// 				filter: {
			// 					driverId: { eq: source.driverId },
			// 					seriesId: { eq: context.context.seriesId }
			// 				},
			// 			},
			// 			type: "SimRacerHubTrackStats",
			// 		})
			// 	}
			// },
			// driverConfigStats: {
			// 	type: "SimRacerHubConfigStats",
			// 	resolve: async (source, args, context, info) => {
			// 		return context.nodeModel.findOne({
			// 			query: {
			// 				filter: {
			// 					driverId: { eq: source.driverId },
			// 					seriesId: { eq: context.context.seriesId }
			// 				},
			// 			},
			// 			type: "SimRacerHubConfigStats",
			// 		})
			// 	}
			// },
		},
		MysqlRace: {
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
		MysqlParticipant: {
			carImage: {
				type: "File",
				resolve: async (source, args, context, info) => {
					const file = await context.nodeModel.findOne({
						query: {
							filter: {
								relativePath: { eq: `cars/${source.car_iracing_id}.svg` }
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
		type MysqlDriver implements Node {
			member: IracingMember @link(by: "cust_id", from: "custid")  
		}
		
		type MysqlParticipant implements Node {
			driver: MysqlDriver @link(by: "driver_id", from: "driver_id")
			car: MysqlCar @link(by: "car_id", from: "car_id")
			bonuses: [MysqlBonus] @link(by: "race_participant_id", from: "race_participant_id")
			penalties: [MysqlPenalty] @link(by: "race_participant_id", from: "race_participant_id")
		}
		
		type MysqlRace implements Node {
			race_date: Date @proxy(from: "schedule.race_date")
			race_time: String @proxy(from: "schedule.race_time")
		}
		
		type MysqlSeason implements Node {
			series: MysqlSeries @link(by: "series_id", from: "series_id")
		}
		
		type MysqlSchedule implements Node {
			trackConfig: MysqlConfig @link(by: "track_config_id", from: "track_config_id")	
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
	`
	createTypes(typeDefs)
}

exports.createPages = async ({ graphql, actions }) => {
	const { createPage } = actions
	const { data } = await graphql(`
		query {
			drivers: allIracingMember(sort: {car_number: ASC}) {
				nodes {
					driverName: display_name
					nickName: nick_name
				}
			}
			races: allMysqlRace(sort: {schedule: {race_date: DESC}}) {
				nodes {
					raceId: race_id
				}
			}
			seasons: allMysqlSeason(sort: {schedules: {race_date: DESC}}) {
				nodes {
					seasonId: season_id
					seasonName: season_name
					series {
						seriesId: series_id
						seriesName: series_name
						seriesCurrSeasonId: curr_season_id
					}
				}
			}
			series: allMysqlSeries(filter: {series_active: {eq: "Y"}}) {
				nodes {
					seriesId: series_id
					seriesName: series_name
					currSeasonId: curr_season_id						
				}	
			}
		}
	`)
	
	// Create drivers pages
	data.drivers.nodes.forEach((node) => {
		const seasonName = pathify(node.driverName),
					driverId = node.driverId

		// series.forEach(({ seriesId, seriesName }) => {
		// 	seriesName = pathify(seriesName)
		// 	createPage({
		// 		path: `${seriesName}/drivers/${seasonName}`,
		// 		component: path.resolve(`src/templates/driver.js`),
		// 		context: { seriesId, seriesName, seasonName, driverId },
		// 	})			
		// })
	})
	
	data.series.nodes.forEach(({ seriesId, seriesName }) => {
		seriesName = pathify(seriesName)
		// createPage({
		// 	path: `${seriesName}/drivers`,
		// 	component: path.resolve(`src/templates/drivers.js`),
		// 	context: { seriesId, seriesName, seasonName: 'Drivers' },
		// })			
		// createPage({
		// 	path: `${seriesName}/stats`,
		// 	component: path.resolve(`src/templates/stats.js`),
		// 	context: { seriesId, seriesName, seasonName: 'Stats' },
		// })			
	})
	
	// Create schedule, standings and results pages
	data.seasons.nodes.forEach((node) => {
		const seriesId = node.series.seriesId,
					seriesName = pathify(node.series.seriesName),
					seasonName = pathify(node.seasonName),
					seasonId = node.seasonId
					
		// createPage({
		// 	path: `${seriesName}/schedule/${seasonName}`,
		// 	component: path.resolve(`src/templates/schedule.js`),
		// 	context: { seriesId, seriesName, seasonName, seasonId },
		// })
		createPage({
			path: `${seriesName}/standings/${seasonName}`,
			component: path.resolve(`src/templates/standings.js`),
			context: { seriesId, seriesName, seasonName, seasonId },
		})
		
		if (seasonId === node.seriesCurrSeasonId) {
			// createPage({
			// 	path: `${seriesName}/schedule`,
			// 	component: path.resolve(`src/templates/schedule.js`),
			// 	context: { seriesId, seriesName, seasonName, seasonId },
			// })
			createPage({
				path: `${seriesName}/standings`,
				component: path.resolve(`src/templates/standings.js`),
				context: { seriesId, seriesName, seasonName, seasonId },
			})
		}
		
		// node.events.forEach(({ race }, index, events) => {
		// 	if (!race) {
		// 		if (events?.[index - 1]?.race && node.active === true)
		// 			createPage({
		// 				path: `${seriesName}/results`,
		// 				component: path.resolve(`src/templates/results.js`),
		// 				context: { seriesId, seriesName, seasonName, seasonId, raceId: events[index - 1].race.raceId },
		// 			})
		// 		return
		// 	}
		// 	createPage({
		// 		path: `${seriesName}/results/${race.raceId}`,
		// 		component: path.resolve(`src/templates/results.js`),
		// 		context: { seriesId, seriesName, seasonName, seasonId, raceId: race.raceId },
		// 	})
		// })
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
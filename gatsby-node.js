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
		
		type MysqlSeries implements Node {
			currentSeason: MysqlSeason @link(by: "season_id", from: "curr_season_id")
		}
		
		type MysqlSchedule implements Node {
			trackConfig: MysqlConfig @link(by: "track_config_id", from: "track_config_id")	
		}
		
		type MysqlConfig implements Node {
			trackAssets: IracingTrackAsset @link(by: "track_config_iracing_id", from: "track_id")	
		}
		
		type IracingMember implements Node {
			participants: [MysqlParticipant] @link(by: "driver.custid", from: "cust_id")
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
					custId: cust_id
					driverName: display_name
					nickName: nick_name
				}
			}
			races: allMysqlRace(
				sort: {schedule: {race_date: DESC}}
			) {
				nodes {
					raceId: race_id
					schedule {
						chase
						season {
							seasonId: season_id
							seasonName: season_name
							series {
								seriesId: series_id
								seriesName: series_name
							}
						}
					}
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
			series: allMysqlSeries(
				filter: {series_active: {eq: "Y"}}
				sort: {currentSeason: {schedules: {race_date: DESC}}}
			) {
				nodes {
					seriesId: series_id
					seriesName: series_name
					currSeasonId: curr_season_id	
					currentSeason {
						seasonId: season_id
						seasonName: season_name
						schedules {
							raceDate: race_date
							raceTime: race_time
							chase
							race {
								raceId: race_id
							}	
						}	
					}					
				}	
			}
			posts: allContentfulNews {
				nodes {
					slug
					series
				}
			}
		}
	`)
		
	data.series.nodes.forEach(({ seriesId, seriesName, currentSeason }) => {
		seriesName = pathify(seriesName)
		
		createPage({
			path: `${seriesName}/drivers`,
			component: path.resolve(`src/templates/drivers.js`),
			context: { seriesId, seriesName, seasonName: 'Drivers' },
		})			
		
		// Create drivers pages
		data.drivers.nodes.forEach((node) => {
			const seasonName = pathify(node.nickName ?? node.driverName),
						custId = node.custId
		
			createPage({
				path: `${seriesName}/drivers/${seasonName}`,
				component: path.resolve(`src/templates/driver.js`),
				context: { seriesId, seriesName, seasonName, custId },
			})			
		})
		
		createPage({
			path: `${seriesName}/results`,
			component: path.resolve(`src/templates/results.js`),
			context: { 
				seriesId, 
				seriesName, 
				seasonName: currentSeason.seasonName, 
				seasonId: currentSeason.seasonId, 
				raceId: currentSeason.schedules.reduce(
					(recent, schedule) => {
						const scheduleDate = new Date(`${schedule.raceDate.split('T')[0]}T${schedule.raceTime}`)
						const recentDate = recent.raceDate ? new Date(`${recent.raceDate.split('T')[0]}T${recent.raceTime}`) : null
						return schedule.race !== null && schedule.chase === 'N' && (!recentDate || scheduleDate.getTime() > recentDate?.getTime())
							? schedule
							: recent
					}, 
					{}
				).race?.raceId
			},
		})

		createPage({
			path: `${seriesName}/stats`,
			component: path.resolve(`src/templates/stats.js`),
			context: { seriesId, seriesName, seasonName: 'Stats' },
		})			
	})
	
	// Create schedule, standings and results pages
	data.seasons.nodes.forEach((node) => {
		const seriesId = node.series.seriesId,
					seriesName = pathify(node.series.seriesName),
					seasonName = pathify(node.seasonName),
					seasonId = node.seasonId
					
		if (seasonId === node.series.seriesCurrSeasonId) {
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
		
	})

	data.races.nodes.forEach((node, index) => {
		if (node.schedule.chase === 'Y') return
		
		const raceId = node.raceId
					seriesId = node.schedule.season.series.seriesId,
					seriesName = pathify(node.schedule.season.series.seriesName),
					seasonName = pathify(node.schedule.season.seasonName),
					seasonId = node.schedule.season.seasonId

		createPage({
			path: `${seriesName}/results/${raceId}`,
			component: path.resolve(`src/templates/results.js`),
			context: { seriesId, seriesName, seasonName, seasonId, raceId },
		})
	})

	// Create news pages
	data.posts.nodes.forEach((node) => {
		const seriesId = node.series === 'output' ? 6842 : 8100,
					seriesName = `${node.series} Series`

		createPage({
			path: `/news/${node.slug}`,
			component: path.resolve(`src/templates/post.js`),
			context: { seriesId, seriesName, slug: node.slug },
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
const { createRemoteFileNode } = require("gatsby-source-filesystem")

exports.onCreateNode = async ({
	node,
	actions: { createNode },
	store,
	cache,
	createNodeId,
}) => {
	// if (
	// 	node.internal.type === "contentfulLeagueCarsJsonNode"
	// ) {
	// 	let fileNode = await createRemoteFileNode({
	// 		url: node.image, // string that points to the URL of the image
	// 		parentNodeId: node.id, // id of the parent node of the fileNode you are going to create
	// 		createNode, // helper function in gatsby-node to generate the node
	// 		createNodeId, // helper function in gatsby-node to generate the node id
	// 		cache, // Gatsby's cache
	// 		store, // Gatsby's Redux store
	// 	})
	// 	// if the file was created, attach the new node to the parent node
	// 	if (fileNode) {
	// 		node.image___NODE = fileNode.id
	// 	}
	// }

	// if (
	// 	node.internal.type === "contentfulLeagueTracksJsonNode"
	// ) {
	// 	let fileNode = await createRemoteFileNode({
	// 		url: node.logo, // string that points to the URL of the image
	// 		parentNodeId: node.id, // id of the parent node of the fileNode you are going to create
	// 		createNode, // helper function in gatsby-node to generate the node
	// 		createNodeId, // helper function in gatsby-node to generate the node id
	// 		cache, // Gatsby's cache
	// 		store, // Gatsby's Redux store
	// 	})
	// 	// if the file was created, attach the new node to the parent node
	// 	if (fileNode) {
	// 		node.logo___NODE = fileNode.id
	// 	}
	// }
}

exports.createPages = async function ({ actions, graphql }) {
	const { data } = await graphql(`
		query Pages {
			drivers: allContentfulDriver {
				nodes {			
					custId		
					name
					nickname
					active
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
						file {
							url
						}
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
			}
			league: contentfulLeague(leagueId: {eq: 2732}) {
				name
				cars {
					name
					image
				}
				tracks {
					name
					logo
				}
				seasons {
					name
					id: contentful_id
					cars
					schedule {
						counts
						name
						raceNo
						raceId
						offWeek
						track
						time
						laps
						date
						chase
						uploaded
					}
					results {
						raceId
						subsessionId
						broadcast
						cautionLaps
						cautions
						counts
						date
						duration
						name
						laps
						leadChanges
						leaders
						logo {
							file {
								url
							}
						}
						media {
							gatsbyImageData(
								layout: FULL_WIDTH
								placeholder: BLURRED
							)
							file {
								url
							}
						}
						track
						time
						results {
							average
							bonus
							completed
							fastest
							finish
							incidents
							interval
							led
							name
							penalty
							points
							start
							status
						}
						uploaded
						fields {
							ratings {
								custid
								rating
							}
							bestAvgPos {
								custid
								avgPos
							}
							bestFastLap {
								custid
								time
							}
							bestNumFastLap {
								custid
								numFastLap
							}
							bestAvgFastLap {
								custid
								avgFastLap
							}
							bestRestarts {
								custid
								time
							}
							bestPasses {
								custid
								passes
							}
							bestQualityPasses {
								custid
								qualityPasses	
							}
							bestClosingPasses {
								custid
								closingPasses
							}
							hardCharger {
								custid
								gain
							}
						}
					}
					standings {
						position
						driver
						change
						starts
						points
						behindNext
						behindLeader
						wins
						t5s
						t10s
						laps
						incidents
					}
				}
				stats {
					avgFinish
					avgStart
					driver
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
			site {
				siteMetadata {
					title
					siteUrl
				}
			}
		}
	`)
	
	// Build driver pages
	await Promise.all(data.drivers.nodes
		.filter(({ active }) => !!active)
		.map(async (driver) => {
			// Create page
			actions.createPage({
				path: `/drivers/${driver.name.replace(/\s/gi, '-').toLowerCase()}`,
				component: require.resolve(`./src/templates/driver.js`),
				context: {
					driver,
					stats: data.league.stats.find(obj => obj.driver === driver.name)
				},
			})
		})
	)
		
	// Build schedule, standings and results pages
	data.league.seasons.forEach(season => {
		
		// Results
		season.results
			.filter(({ uploaded }) => !!uploaded)
			.forEach(race => {
				const { ratings = [], ...stats } = race.fields || {}
				actions.createPage({
					path: `/results/${race.raceId}`,
					component: require.resolve(`./src/templates/results.js`),
					context: {
						...race,
						track: data.league.tracks.find(
							({ name }) => race.track.includes(name)
						),
						results: race.results.map(
							(item) => {
								const driver = data.drivers.nodes.find(({ name }) => name === item.name)
								const { rating = 0 } = ratings.find(({ custid }) => custid === driver.custId) || {}
								return { ...item, driver, rating }
							}
						),
						stats: Object.fromEntries(
							Object.entries(stats).map(
								([key, value]) => {
									if (!value) return [key, null]
									const driver = data.drivers.nodes.find(
										({ custId }) => custId === value.custid
									)
									return [key, { ...value, driver }]
								}
							)
						)
					},
				})
			})
		
		// Schedule
		actions.createPage({
			path: `/schedule/${season.id}`,
			component: require.resolve(`./src/templates/schedule.js`),
			context: {
				season: {
					...season,
					schedule: season.schedule.map(item => ({
						...item,
						track: {
							...data.league.tracks.find(
								({ name }) => item.track.includes(name)
							),
							config: item.track
						},
						results: season.results.find(
							({ raceId }) => parseInt(raceId) === parseInt(item.raceId)
						)
					}))
				}, 
				seasons: data.league.seasons, 
				cars: data.league.cars, 
				drivers: data.drivers.nodes, 
			},
		})
		
		// Standings
		actions.createPage({
			path: `/standings/${season.id}`,
			component: require.resolve(`./src/templates/standings.js`),
			context: {
				season: {
					...season,
					standings: season.standings.map(item => {
						const driver = data.drivers.nodes.find(({ name }) => name === item.driver)
						const rating = season.results.reduce((total, { fields }) => {
							if (!fields || !fields.ratings) return total
							return total + fields.ratings
								.filter(({ custid }) => custid === driver.custId)
								.reduce((total, { rating }) => total + rating, 0)
						}, 0) / item.starts
						return { ...item, driver, rating }
					})
				}, 
				seasons: data.league.seasons, 
				cars: data.league.cars, 
				drivers: data.drivers.nodes, 
			},
		})

	})
}
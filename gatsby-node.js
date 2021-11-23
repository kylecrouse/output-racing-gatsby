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
				actions.createPage({
					path: `/results/${race.raceId}`,
					component: require.resolve(`./src/templates/results.js`),
					context: {
						...race,
						track: data.league.tracks.find(
							({ name }) => race.track.includes(name)
						),
						results: race.results.map(
							(item) => ({
								...item,
								driver: data.drivers.nodes.find(({ name }) => name === item.name)
							})
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
				season, 
				seasons: data.league.seasons, 
				cars: data.league.cars, 
				drivers: data.drivers.nodes, 
			},
		})

	})
}
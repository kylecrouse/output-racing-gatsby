/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */
const axios = require('axios')
const querystring = require('querystring')
const throttledQueue = require('./lib/throttled-queue')

const throttle = throttledQueue(5, 500)

const LEAGUE_ID = 1710

// const instance = axios.create({ baseURL: 'http://127.0.0.1:3000' })
const instance = axios.create({ baseURL: 'https://api.simracerhub.com' })

exports.sourceNodes = async ({
  actions,
  cache,
  createContentDigest,
  createNodeId,
  getNodesByType,
  reporter
}, pluginOptions) => {
  const { createNode } = actions
  
  const fetch = async (url) => {
    let data = await cache.get(url)
    if (data) return data
    
    return throttle(() => instance.get(url)
      .then(({ data }) => cache.set(url, data))
      .catch(err => console.log(url, err.response.status, err.response.statusText, err.response.data)))
  }
  
  await Promise.all([6842,8100].map(async (seriesId) => {
    
    const [drivers = {}, series = null] = await Promise.all([
      fetch(`/series/${seriesId}/drivers`),
      fetch(`/series/${seriesId}`),
    ])
    
    if (drivers)
      Object.values(drivers).forEach(
        ({ stats, trackStats, typeStats, ...driver }) => {
          // Create driver node
          createNode({
            ...driver,
            id: createNodeId(`SimRacerHubDriver-${driver.driverId}`),
            internal: {
              type: 'SimRacerHubDriver',
              content: JSON.stringify(driver),
              contentDigest: createContentDigest(driver),
            },
          })
          // Create stats nodes based on series
          createNode({
            ...stats,
            seriesId,
            driverId: driver.driverId,
            type: 'career',
            id: createNodeId(`SimRacerHubCareerStats-${seriesId}-${driver.driverId}`),
            internal: {
              type: 'SimRacerHubCareerStats',
              content: JSON.stringify(stats),
              contentDigest: createContentDigest(stats),
            },
          })
          createNode({
            stats: trackStats,
            seriesId,
            driverId: driver.driverId,
            type: 'track',
            id: createNodeId(`SimRacerHubTrackStats-${seriesId}-${driver.driverId}`),
            internal: {
              type: 'SimRacerHubTrackStats',
              content: JSON.stringify(trackStats),
              contentDigest: createContentDigest(trackStats),
            },
          })
          createNode({
            stats: typeStats,
            seriesId,
            driverId: driver.driverId,
            type: 'config',
            id: createNodeId(`SimRacerHubConfigStats-${seriesId}-${driver.driverId}`),
            internal: {
              type: 'SimRacerHubConfigStats',
              content: JSON.stringify(typeStats),
              contentDigest: createContentDigest(typeStats),
            },
          })
        }
      )
  
    await Promise.all(
      series.seasons.map(
        async (season) => {
          
          // Get events for this season
          season.events = await fetch(`/series/${seriesId}/schedule`)
            .then(({ events }) => events)
          
          // Get standings for season
          season.standings = await fetch(`/season/${season.seasonId}/standings`)
          
          // Get races for season
          await fetch(`/season/${season.seasonId}/results`)
            .then(results => results && Object.entries(results).map(
              ([raceId, race]) => createNode({
                seriesId,
                seriesName: series.seriesName,
                seasonId: season.seasonId,
                seasonName: season.seasonName,
                ...race,
                id: createNodeId(`SimRacerHubRace-${race.raceId}`),
                internal: {
                  type: 'SimRacerHubRace',
                  content: JSON.stringify(race),
                  contentDigest: createContentDigest(race),
                },
              })
            ))
          
          // Create node for season
          createNode({
            leagueName: 'Output Racing League',
            seriesId,
            seriesName: series.seriesName,
            ...season,
            id: createNodeId(`SimRacerHubSeason-${season.seasonId}`),
            internal: {
              type: 'SimRacerHubSeason',
              content: JSON.stringify(season),
              contentDigest: createContentDigest(season)
            }
          })
        }
      )
    )
    
  }))

  return
}
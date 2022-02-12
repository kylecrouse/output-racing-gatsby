/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */
const axios = require('axios')
const axiosRetry = require('axios-retry')
const querystring = require('querystring')
const throttledQueue = require('./lib/throttled-queue')

const throttle = throttledQueue(1, 10000)

const LEAGUE_ID = 1710

const instance = axios.create({ baseURL: 'http://127.0.0.1:3000' })
// axiosRetry(instance, { retries: 5 })

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
      
  const [drivers = {}, series = null, schedule = {}] = await Promise.all([
    fetch(`/drivers?seriesId=6842`),
    fetch(`/series?seriesId=6842`),
    fetch(`/schedule?seriesId=6842`),
  ])
  
  if (drivers)
    Object.values(drivers).forEach(driver => createNode({
      ...driver,
      id: createNodeId(`SimRacerHubDriver-${driver.driverId}`),
      internal: {
        type: 'SimRacerHubDriver',
        content: JSON.stringify(driver),
        contentDigest: createContentDigest(driver),
      },
    }))

  await Promise.all(
    series.seasons.map(
      async (season) => {
        
        // Get events for this season
        season.events = schedule[season.seasonId]
        
        // Get standings for season
        season.standings = await fetch(`/standings?seasonId=${season.seasonId}`)
        
        // Get races for season
        await fetch(`/results?seasonId=${season.seasonId}`)
          .then(results => results && Object.entries(results).map(
            ([raceId, race]) => createNode({
              seriesName: series.seriesName,
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

  return
}
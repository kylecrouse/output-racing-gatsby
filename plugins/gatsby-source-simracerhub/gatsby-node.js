/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */
const axios = require('axios')
const querystring = require('querystring')

const LEAGUE_ID = 1710
const BASE_URL = 'http://127.0.0.1:3000'

exports.sourceNodes = async ({
  actions,
  cache,
  createContentDigest,
  createNodeId,
  getNodesByType,
  reporter
}, pluginOptions) => {
  const { createNode } = actions
  
  const nodes = getNodesByType('ContentfulDriver')
  const ids = nodes.reduce(
    (a, { custId, active }) => custId && active ? [...a, custId] : a, 
    []
  )
  
  // Build query string for API request
  let qs = { leagueId: LEAGUE_ID }
  if (ids.length > 0)
    qs.custId = ids.join(',')
    
  const driversUrl = `${BASE_URL}/drivers?${querystring.encode(qs)}`
  let drivers = await cache.get(driversUrl)
  if (!drivers) {
    ({ data: drivers } = await axios.get(driversUrl))
    await cache.set(driversUrl, drivers)
  }

  if (Array.isArray(drivers))
    drivers.forEach(driver =>
      createNode({
        ...driver,
        id: createNodeId(`SimRacerHubDriver-${driver.driverId}`),
        parent: null,
        children: [],
        internal: {
          type: 'SimRacerHubDriver',
          content: JSON.stringify(driver),
          contentDigest: createContentDigest(driver),
        },
      })
    )
  
  const racesUrl = `${BASE_URL}/races?${querystring.encode(qs)}`
  let races = await cache.get(racesUrl)
  if (!races) {
    ({ data: races } = await axios.get(racesUrl))
    await cache.set(racesUrl, races)
  }
  
  if (Array.isArray(races))
    races.forEach(race =>
      createNode({
        ...race,
        id: createNodeId(`SimRacerHubRace-${race.raceId}`),
        parent: null,
        children: [],
        internal: {
          type: 'SimRacerHubRace',
          content: JSON.stringify(race),
          contentDigest: createContentDigest(race),
        },
      })
    )
  
  const tracksUrl = `${BASE_URL}/tracks`
  let tracks = await cache.get(tracksUrl)
  if (!tracks) {
    ({ data: tracks } = await axios.get(tracksUrl))
    await cache.set(tracksUrl, tracks)
  }
  
  if (Array.isArray(tracks))
    tracks.forEach(track =>
      createNode({
        ...track,
        id: createNodeId(`SimRacerHubTrack-${track.trackId}`),
        parent: null,
        children: [],
        internal: {
          type: 'SimRacerHubTrack',
          content: JSON.stringify(track),
          contentDigest: createContentDigest(track),
        },
      })
    )
  
  return
}
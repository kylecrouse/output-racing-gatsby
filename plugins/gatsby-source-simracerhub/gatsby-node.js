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
    
  const url = `${BASE_URL}/drivers?${querystring.encode(qs)}`
  let drivers = await cache.get(url)
  if (!drivers) {
    const { data } = await axios.get(url)
    if (!data) 
      return response.notFound({ message: 'No drivers found' })
    drivers = data
    await cache.set(url, drivers)
  }

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
  
  return
}

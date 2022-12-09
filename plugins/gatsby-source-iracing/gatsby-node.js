/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */
// You can delete this file if you're not using it
const { Client } = require('./iracing')
const dotenv = require('dotenv').config()
const util = require('util')

const client = new Client(process.env.IRACING_USERNAME, process.env.IRACING_PASSWORD)
  
exports.sourceNodes = async ({
  actions,
  cache,
  createContentDigest,
  createNodeId,
  getNodesByType,
  reporter
}, pluginOptions) => {
  const { createNode } = actions
  
  const league = await client.getLeague(2732)
  
  league?.roster.forEach(driver => {
    createNode({
      ...driver,
      id: createNodeId(`IracingMember-${driver.cust_id}`),
      internal: {
        type: 'IracingMember',
        content: JSON.stringify(driver),
        contentDigest: createContentDigest(driver),
      },
    })
  })          
}
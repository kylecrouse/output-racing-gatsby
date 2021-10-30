const { createRemoteFileNode } = require("gatsby-source-filesystem")

// Replacing '/' would result in empty string which is invalid
// const replacePath = path => (path === `/` ? path : path.replace(/\/$/, ``))

// Implement the Gatsby API “onCreatePage”. This is
// called after every page is created.
// exports.onCreatePage = ({ page, actions }) => {
// 	const { createPage, deletePage } = actions
// 	const oldPage = Object.assign({}, page)
// 	// Remove trailing slash unless page is /
// 	page.path = replacePath(page.path)
// 	if (page.path !== oldPage.path) {
// 		// Replace old page with new page
// 		deletePage(oldPage)
// 		createPage(page)
// 	}
// }

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
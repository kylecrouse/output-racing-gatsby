// Import React so that you can use JSX in HeadComponents
const React = require("react")

const HeadComponents = [
	<link key="typekit-css" rel="stylesheet" href="https://use.typekit.net/ovc0kir.css"/>,
	<link key="spectre-css" rel="stylesheet" href="https://unpkg.com/spectre.css/dist/spectre.min.css"/>,
	<link key="spectre-icons-css" rel="stylesheet" href="https://unpkg.com/spectre.css/dist/spectre-icons.min.css"/>,
]

exports.onRenderBody = ({ pathname, setHeadComponents }) => {
	setHeadComponents(HeadComponents)
}

exports.onPreRenderHTML = ({ getHeadComponents, replaceHeadComponents }) => {
	const headComponents = getHeadComponents()
	if (headComponents)
		replaceHeadComponents(headComponents.sort(
			item => item.key?.includes('spectre') ? -1 : 1
		))
}
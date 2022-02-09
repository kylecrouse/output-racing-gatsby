// Import React so that you can use JSX in HeadComponents
const React = require("react")

const HeadComponents = [
	<link rel="stylesheet" href="https://use.typekit.net/ovc0kir.css"/>
]

exports.onRenderBody = ({ pathname, setHeadComponents }) => {
	setHeadComponents(HeadComponents)
}
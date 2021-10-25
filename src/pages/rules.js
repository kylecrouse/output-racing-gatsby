import * as React from "react"
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'
import { BLOCKS, MARKS } from "@contentful/rich-text-types"
import { renderRichText } from "gatsby-source-contentful/rich-text"

const Bold = ({ children }) => <span className="bold">{children}</span>
const Text = ({ children }) => <p className="align-center">{children}</p>

const options = {
	renderMark: {
		[MARKS.BOLD]: text => <Bold>{text}</Bold>,
	},
	renderNode: {
		[BLOCKS.PARAGRAPH]: (node, children) => <Text>{children}</Text>,
		[BLOCKS.EMBEDDED_ASSET]: node => {
			return (
				<>
					<h2>Embedded Asset</h2>
					<pre>
						<code>{JSON.stringify(node, null, 2)}</code>
					</pre>
				</>
			)
		},
	},
}

const RulesPage = ({ data }) => {
	return (
		<main>
		<Helmet>
			<meta charSet="utf-8" />
			<title>Output Racing League | Rules</title>
		</Helmet>

			<div class="columns">
				<div class="column col-6 col-sm-4 col-mx-auto">
					<h2 className="text-center" style={{ margin: "0 0 3rem" }}>Race Info</h2>
					{ renderRichText(data.league.raceInfo, options) }
					<hr style={{ margin: "3rem 0" }}/>
					<h2 className="text-center" style={{ margin: "0 0 3rem" }}>Rules</h2>
					{ renderRichText(data.league.rules, options) }
					<hr style={{ margin: "3rem 0" }}/>
					<h2 className="text-center" style={{ margin: "0 0 3rem" }}>Code of Conduct</h2>
					{ renderRichText(data.league.codeOfConduct, options) }
				</div>
			</div>
		</main>
	)
}

export const query = graphql`
	query RulesQuery {
		league: contentfulLeague(leagueId: {eq: 2732}) {
			name
			rules {
				raw
			}
			raceInfo {
				raw
			}
			codeOfConduct {
				raw
			}
		}
	}
`

export default RulesPage
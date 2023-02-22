import * as React from "react"
import { Link, graphql } from 'gatsby'
import { BLOCKS, MARKS } from "@contentful/rich-text-types"
import { renderRichText } from "gatsby-source-contentful/rich-text"
import Layout from '../components/layout'
import Meta from '../components/meta'
// import Tabs from '../components/tabs'
import * as styles from './rules.module.css'

const Bold = ({ children }) => <span className="bold">{children}</span>
const Text = ({ children }) => <pre>{children}</pre>

const options = {
	renderMark: {
		[MARKS.BOLD]: text => <Bold>{text}</Bold>,
	},
	renderNode: {
		[BLOCKS.HEADING_3]: (node, children) => {
			return (
				<h3 id={ `section-${node.content[0].value.replace(/\s/g, '-').toLowerCase()}` }>{ children }</h3>
			)
		},
		[BLOCKS.HEADING_4]: (node, children) => {
			return (
				<h4 id={ `section-${node.content[0].value.replace(/\s/g, '-').toLowerCase()}` }>{ children }</h4>
			)
		},
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

const RulesPage = (props) => {
	return (
		<Layout {...props}>
			<main className="container">
		
				<div className="columns">
					<div className="column col-8 col-xl-10 col-lg-12 col-mx-auto content">
	
						<hgroup className="page-header">
							<h2 className="page-title">Rulebook</h2>
						</hgroup>
					
						<div className="columns" style={{ marginTop: 0 }}>
							<div className="column col-3 hide-sm">
								<ol className={ styles.toc }>
									{ React.useMemo(
											() => (
												(JSON.parse(props.data.league.rules.raw)).content[0].content
													// .filter(({ nodeType }) => nodeType === 'heading-3')
													.map(({ content }) => content[0].content[0].value)
													.map(section => (
														<li key={section}>
															<Link to={`#section-${section.replace(/\s/g,'-').toLowerCase()}`}>
																{ section }
															</Link>
														</li>
													))
											),
											[props.data.league.rules.raw]
										)		
									}
								</ol>
							</div>
							<div className={`${styles.body} column col-8 col-sm-12 col-mx-auto`}>
								{ renderRichText(props.data.league.rules, options) }
							</div>
						</div>
	
					</div>
				</div>
	
			</main>
		</Layout>
	)
}

// const getDefaultTabIndex = (hash) => {
// 	switch (hash) {
// 		case "#session-info":
// 			return 1
// 		case "#code-of-conduct":
// 			return 2
// 		default:
// 			return 0
// 	}
// }

export const query = graphql`
	query RulesQuery {
		league: contentfulLeague(leagueId: {eq: 2732}) {
			name
			rules {
				raw
			}
		}
	}
`

export default RulesPage

export const Head = (props) => (
	<Meta {...props}/>
)
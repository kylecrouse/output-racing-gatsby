import * as React from "react"
import { Link, graphql } from 'gatsby'
import { BLOCKS, MARKS } from "@contentful/rich-text-types"
import { renderRichText } from "gatsby-source-contentful/rich-text"
import Layout from '../components/layout'
import Tabs from '../components/tabs'
import * as styles from './rules.module.css'

const Bold = ({ children }) => <span className="bold">{children}</span>
const Text = ({ children }) => <p className="align-center">{children}</p>

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
					
						<Tabs 
							defaultIndex={getDefaultTabIndex(props.location.hash)}
							onSelect={
								(index) => {
									switch (index) {
										case 1:
											window.history.pushState(null, null, '#session-info')
											return true
										case 2:
											window.history.pushState(null, null, '#code-of-conduct')
											return true
										default:
											window.history.pushState(null, null, '#rules')
											return true
									}
								}
							}
							tabs={[
								{
									title: 'Rules',
									content: (
										<div className="columns">
											<div className="column col-4 hide-sm">
												<ol className={ styles.toc }>
													{ React.useMemo(
															() => (
																(JSON.parse(props.data.league.rules.raw)).content
																	.filter(({ nodeType }) => nodeType === 'heading-3')
																	.map(({ content }) => content[0].value)
																	.map(section => (
																		<li>
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
											<div className="column col-6 col-sm-12 col-mx-auto">
												{ renderRichText(props.data.league.rules, options) }
											</div>
										</div>
									),
								},
								{
									title: 'Session Info',
									content: (
										<div className="columns">
											<div className="column col-4 hide-sm">
												<ol className={ styles.toc }>
													{ React.useMemo(
															() => (
																(JSON.parse(props.data.league.raceInfo.raw)).content
																	.filter(({ nodeType }) => nodeType === 'heading-3')
																	.map(({ content }) => content[0].value)
																	.map(section => (
																		<li>
																			<Link to={`#section-${section.replace(/\s/g,'-').toLowerCase()}`}>
																				{ section }
																			</Link>
																		</li>
																	))
															),
															[props.data.league.raceInfo.raw]
														)		
													}
												</ol>												
											</div>
											<div className="column col-6 col-sm-12 col-mx-auto">
												{ renderRichText(props.data.league.raceInfo, options) }
											</div>
										</div>
									),
								},
								{
									title: 'Code of Conduct',
									content: (
										<div className="columns">
											<div className="column col-6 col-sm-12 col-mx-auto">
												{ renderRichText(props.data.league.codeOfConduct, options) }
											</div>
										</div>
									),
								},
							]}
						/>
	
					</div>
				</div>
	
			</main>
		</Layout>
	)
}

const getDefaultTabIndex = (hash) => {
	switch (hash) {
		case "#session-info":
			return 1
		case "#code-of-conduct":
			return 2
		default:
			return 0
	}
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
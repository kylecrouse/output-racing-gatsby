import * as React from "react"
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'
import { BLOCKS, MARKS } from "@contentful/rich-text-types"
import { renderRichText } from "gatsby-source-contentful/rich-text"
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

const RulesPage = ({ data }) => {
	return (
		<main className="container">
			<Helmet>
				<title>Output Racing League | Rules</title>
			</Helmet>
	
			<div className="columns">
				<div className="column col-8 col-xl-12 col-mx-auto content">

					<hgroup className="page-header">
						<h2 className="page-title">Rulebook</h2>
					</hgroup>
				
					<Tabs 
						tabs={[
							{
								title: 'Rules',
								content: (
									<div className="columns">
										<div className="column col-4">
											<ol className={ styles.toc }>
												{ React.useMemo(
														() => (
															(JSON.parse(data.league.rules.raw)).content
																.filter(({ nodeType }) => nodeType === 'heading-3')
																.map(({ content }) => content[0].value)
																.map(section => (
																	<li>
																		<a href={`#section-${section.replace(/\s/g,'-').toLowerCase()}`}>
																			{ section }
																		</a>
																	</li>
																))
														),
														[data.league.rules.raw]
													)		
												}
											</ol>
										</div>
										<div className="column col-6 col-mx-auto">
											{ renderRichText(data.league.rules, options) }
										</div>
									</div>
								),
							},
							{
								title: 'Session Info',
								content: (
									<div className="columns">
										<div className="column col-4">
											<div className={ styles.toc }>
												<ol className={ styles.toc }>
													{ React.useMemo(
															() => (
																(JSON.parse(data.league.raceInfo.raw)).content
																	.filter(({ nodeType }) => nodeType === 'heading-3')
																	.map(({ content }) => content[0].value)
																	.map(section => (
																		<li>
																			<a href={`#section-${section.replace(/\s/g,'-').toLowerCase()}`}>
																				{ section }
																			</a>
																		</li>
																	))
															),
															[data.league.raceInfo.raw]
														)		
													}
												</ol>												
											</div>
										</div>
										<div className="column col-6 col-mx-auto">
											{ renderRichText(data.league.raceInfo, options) }
										</div>
									</div>
								),
							},
							{
								title: 'Code of Conduct',
								content: (
									<div className="columns">
										<div className="column col-6 col-mx-auto">
											{ renderRichText(data.league.codeOfConduct, options) }
										</div>
									</div>
								),
							},
						]}
					/>

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
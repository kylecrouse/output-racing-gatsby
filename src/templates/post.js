import * as React from "react"
import { Link, graphql } from 'gatsby'
import { BLOCKS, MARKS } from "@contentful/rich-text-types"
import { renderRichText } from "gatsby-source-contentful/rich-text"
import Layout from '../components/layout'
import Meta from '../components/meta'
import * as styles from './post.module.css'

const Bold = ({ children }) => <span className="bold">{children}</span>
const Text = ({ children }) => <p>{children}</p>

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
				<pre>
					<code>{JSON.stringify(node, null, 2)}</code>
				</pre>
			)
		},
	},
}

const PostPage = (props) => {
	return (
		<Layout {...props}>
			<main className="container">
		
				<div className="columns">
					<div className="column col-8 col-xl-10 col-lg-12 col-mx-auto content">
	
						<hgroup className="page-header">
							<h2 className="page-title">News</h2>
						</hgroup>

						<div className="columns" style={{ marginTop: 0 }}>
							<div className={`${styles.body} column col-8 col-sm-12`}>
								<h3>{props.data.post.title}</h3>
								<h4 className="page-subtitle">{props.data.post.date}</h4>
							</div>
						</div>
					
						<div className="columns" style={{ marginTop: 0, padding: '0 0.4rem' }}>
							<div className={`${styles.body} column col-8 col-sm-12`}>
								<div>
									{ renderRichText(props.data.post.body, options) }
								</div>
							</div>
							<div className={`column col-3 col-sm-12 col-mx-auto`}>
								<div className={styles.recentNews}>
									<h5>More News</h5>
									<ul>
										{ props.data.posts.nodes.map((post, index) => (
												<li key={index}>
													<div>
														<h6>{post.date}</h6>
														<Link to={`/news/${post.slug}`}>
															{post.title}
														</Link>
													</div>
													<i className="icon icon-arrow-right"></i>
												</li>
											))
										}
									</ul>
								</div>
							</div>
						</div>
	
					</div>
				</div>
	
			</main>
		</Layout>
	)
}

export const query = graphql`
	query PostQuery($slug: String!) {
		post: contentfulNews(slug: {eq: $slug}) {
			title
			date(formatString: "DD MMM YYYY")
			body {
				raw
			}
		}
		posts: allContentfulNews(filter: {slug: {ne: $slug}}, sort: {fields: date, order: DESC}, limit: 3) {
			nodes {
				title
				slug
				date(formatString: "DD MMM YYYY")
			}
		}
	}
`

export default PostPage

export const Head = (props) => (
	<Meta {...props}/>
)
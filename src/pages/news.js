import * as React from "react"
import { Link, graphql } from 'gatsby'
import Layout from '../components/layout'
import Meta from '../components/meta'
import * as styles from './news.module.scss'


const NewsPage = (props) => {
	return (
		<Layout {...props}>
			<main className="container">
		
				<div className="columns">
					<div className="column col-8 col-xl-10 col-lg-12 col-mx-auto content">
	
						<hgroup className="page-header">
							<h2 className="page-title">News</h2>
						</hgroup>

						<div className={`columns ${styles.recentNews}`}>
              <ul className="col-12">
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
	
			</main>
		</Layout>
	)
}

export const query = graphql`
	query NewsQuery {
		posts: allContentfulNews(sort: {fields: date, order: DESC}) {
			nodes {
				title
				slug
				date(formatString: "DD MMM YYYY")
			}
		}
	}
`

export default NewsPage

export const Head = (props) => (
	<Meta {...props}/>
)
import * as React from "react"
import { graphql } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import { Helmet } from 'react-helmet'
import moment from 'moment'
import Video from '../components/video'
import './index.css'
import img1 from '../images/header/Champ.png'
import img2 from '../images/header/dega.png'
import img3 from '../images/header/Chambliss.png'
import img4 from '../images/header/Autoclub.png'

const IndexPage = ({ data }) => {
  return (
    <main>

      <Helmet>
        <meta charset="utf-8"/>
        <title>{ data.league.name }</title>
      </Helmet>
      
      <div className="tagline">
        <div className="columns col-gapless hide-sm">
          <figure className="column col-3 col-sm-12">
            <img src={img1} className="thumbnail" alt="Champ"/>
          </figure>
          <figure className="column col-3 col-sm-12">
            <img src={img2} className="thumbnail" alt="Dega"/>
          </figure>
          <figure className="column col-3 col-sm-12">
            <img src={img3} className="thumbnail" alt="Chambliss"/>
          </figure>
          <figure className="column col-3 col-sm-12">
            <img src={img4} className="thumbnail" alt="Auto Club"/>
          </figure>
        </div>
        <p>An Asphalt Oval League for the Late-Night Racer</p>
      </div>
      
      <div className="container content">
        <div className="columns">   
          <div className="column col-5 col-md-12 col-ml-auto">

          </div>
          <div className="column col-3 col-md-12 col-mr-auto">

          </div>
        </div>
      </div>
      
      <div className="container" style={{ margin: "0.5rem 0 -4rem" }}>
        <div className="columns">
          <div className="column col-8 col-md-12 col-mx-auto">
            <Video src="https://www.youtube.com/embed/34KPVZWE5Ks"/>
          </div>
        </div>
      </div>
      
    </main>
  )
}

export const query = graphql`
  query IndexQuery {
    league: contentfulLeague(leagueId: {eq: 2732}) {
      name
    }
  }
`

export default IndexPage

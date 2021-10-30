import * as React from "react"
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'
import { Carousel, Slide } from '../components/carousel'
import ScheduleCard from '../components/scheduleCard'
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
      
      <div className="content schedule-container">
        <Carousel options={{ 
          perView: 1, 
          startAt: data.league.activeSeason.schedule
            .filter(event => event.counts)
            .sort((a, b) => a.date - b.date)
            .findIndex(event => !event.uploaded), 
          type: "carousel" 
        }}>
          { data.league.activeSeason.schedule
            .filter(event => event.counts)
            .map((event, round, events) => {
              let results = []
              if (data.league.activeSeason.results) {
                const race = data.league.activeSeason.results.find(
                  ({ raceId }) => parseInt(raceId) === parseInt(event.raceId)
                )
                if (race && race.results.length > 0)
                  results = race.results.map(item => {
                    const driver = data.drivers.nodes.find(
                      ({ name }) => name === item.name
                    )
                    return ({ ...item, driver })
                  })
              }
                
              const track = data.league.tracks.find(
                ({ name }) => event.track.includes(name)
              )
              
              const cars = data.league.cars.filter(
                ({ name }) => data.league.activeSeason.cars.includes(name)
              )
    
              return (
                <Slide>
                  <ScheduleCard 
                    { ...event } 
                    round={round}
                    cars={cars}
                    track={track} 
                    results={results} 
                  />
                </Slide>
              )
            })
          }
        </Carousel>
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
      activeSeason {
        name
        cars
        schedule {
          track
          name
          date
          raceId
          counts
          uploaded
        }
        results {
          raceId
          results {
            finish
            name
            points
            bonus
            penalty
          }
        }
      }
      tracks {
        name
        logo
        map
      }
      cars {
        name
        image 
      }
    }
    drivers: allContentfulDriver {
      nodes {
        name
        nickname
        active
        number
        numberArt {
          file {
            url
          }
        }
      }
    }
  }
`

export default IndexPage

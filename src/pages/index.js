import * as React from "react"
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { Carousel, Slide } from '../components/carousel'
import Results from '../components/results'
import ScheduleCard from '../components/scheduleCard'
import StandingsCard from '../components/standingsCard'
import Standings from '../components/standings'
import Video from '../components/video'
import './index.css'
import img1 from '../images/header/Champ.png'
import img2 from '../images/header/dega.png'
import img3 from '../images/header/Chambliss.png'
import img4 from '../images/header/Autoclub.png'

const IndexPage = ({ data }) => {
  const race = data.race.nodes[0];
  return (
    <main>

      <Helmet>
        <meta charset="utf-8"/>
        <title>{ data.league.name }</title>
        <script async src="https://www.youtube.com/iframe_api"></script>
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
      
      <Tabs>
        <TabList className="tab">
          <Tab className="tab-item"><span>Standings</span></Tab>
          <Tab className="tab-item"><span>Rankings</span></Tab>
          <Tab className="tab-item"><span>Last Race</span></Tab>
        </TabList>      
        
        <TabPanel className="tab-body">
          <h3>Standings</h3>
          <div className="columns col-8 col-mx-auto">
            { data.league.activeSeason.standings
                .sort((a, b) => a.position - b.position)
                .slice(0, 3)
                .map(item => {
                  return (
                    <div className="col-4">
                      <StandingsCard 
                        { ...item } 
                        driver={
                          data.drivers.nodes.find(({ name }) => name === item.driver)
                        } 
                      />
                    </div>
                  )
                })
            }
            <div class="container">
              <div class="columns">
                <div className="table-container col-8 col-mx-auto">
                  <Standings 
                    headers={false}
                    fields={['pos', 'driver', 'points']}
                    standings={
                      data.league.activeSeason.standings
                        .sort((a, b) => a.position - b.position)
                        .slice(0, 10)
                        .map(item => ({
                          ...item, 
                          driver: data.drivers.nodes.find(({ name }) => name === item.driver)
                        }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
        
        <TabPanel className="tab-body">
          <h3>Rankings</h3>
        </TabPanel>

        <TabPanel className="tab-body">
          <hgroup>
            <h4>{race.track}</h4>
            <h5>{race.name}</h5>
          </hgroup>
          <div className="columns col-8 col-mx-auto">
            <div class="container">
              <div class="columns">
                {/*<div className="col-6">
                  { race.broadcast && 
                    <Video src={race.broadcast} /> 
                  }
                </div>*/}
                <div className="table-container col-8 col-mx-auto">
                  <Results 
                    headers={false}
                    fields={['finish', 'driver', 'points']}
                    results={
                      data.race.nodes[0].results
                        .slice(0,10)
                        .map(item => ({
                          ...item,
                          driver: data.drivers.nodes.find(({ name }) => name === item.name)
                        }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
      </Tabs>

      <div className="promo">
        <div id="embeddable"></div>
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
        standings {
          position
          driver
          change
          starts
          points
          behindNext
          behindLeader
          wins
          t5s
          t10s
          laps
          incidents
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
        media {
          gatsbyImageData(
            placeholder: BLURRED
          )
        }
      }
    }
    race: allContentfulRace(
      filter: { uploaded: { eq: true }}
      sort: { fields: date, order: DESC }
      limit: 1
    ) {
      nodes {
        raceId
        broadcast
        date
        name
        logo {
          file {
            url
          }
        }
        media {
          file {
            url
          }
        }
        track
        time
        results {
          bonus
          finish
          interval
          led
          name
          penalty
          points
          start
        }				
      }
    }
  }
`

export default IndexPage

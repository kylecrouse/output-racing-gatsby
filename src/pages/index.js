import * as React from "react"
import { graphql } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import { Helmet } from 'react-helmet'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import axios from 'axios'
import useSiteMetadata from '../hooks/use-site-metadata'
import { Carousel, Slide } from '../components/carousel'
import Results from '../components/results'
import ScheduleCard from '../components/scheduleCard'
import StandingsCard from '../components/standingsCard'
import Standings from '../components/standings'
import Video from '../components/video'
import './index.css'
import logo from '../images/logo.png'
import img1 from '../images/header/Champ.png'
import img2 from '../images/header/dega.png'
import img3 from '../images/header/Chambliss.png'
import img4 from '../images/header/Autoclub.png'
import promo from '../images/ORL-Season-2-promo.mp4'

const channel = "aussie_sim_commentator"
const isStreamOnlineURL = `https://rdkboffe10.execute-api.us-west-2.amazonaws.com/default/isStreamOnline?channel=${channel}`

const IndexPage = ({ data }) => {
  const { title, siteUrl } = useSiteMetadata()
  
  const [ isStreamOnline, setIsStreamOnline ] = React.useState(false)
  
  React.useEffect(() => {
    async function fetchStream() {
      const response = await axios.get(isStreamOnlineURL)
      const { status = false } = response.data
      setIsStreamOnline(!!status)
    }    
    const timer = setTimeout(fetchStream, 30000)
    fetchStream()
    return () => clearTimeout(timer)
  }, [])
  
  React.useEffect(() => {
    if (!isStreamOnline) return
    const player = new window.Twitch.Player("broadcast", { channel })
  }, [isStreamOnline])
  
  const race = data.race.nodes[0]
  return (
    <>

      <Helmet>
        <title>{ title }</title>
        <meta property="og:image" content={`${siteUrl}${logo}`} />
        <meta property="og:description" content={`An asphalt oval league for the late-night racer.`} />
        <meta property="og:title" content={ title } />
        <meta property="og:type" content="website"/>
        <meta property="og:url" content={ siteUrl } />
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title" content={ title } />
        <meta name="twitter:description" content={`An asphalt oval league for the late-night racer.`} />
        <meta name="twitter:player" content={`https://youtube.com/embed/34KPVZWE5Ks`} />
        <meta name="twitter:player:width" content="640" />
        <meta name="twitter:player:height" content="480" />
        <meta name="twitter:image" content={`${siteUrl}${logo}`} />
        <meta name="theme-color" content="#F4A913"/>
        <script src= "https://player.twitch.tv/js/embed/v1.js"></script>
      </Helmet>
      
      <div className="tagline">
        { isStreamOnline 
            ? <div className="columns">
                <div className="col-8 col-xl-10 col-lg-12 col-mx-auto">
                  <div id="broadcast"></div>
                </div>
              </div>
            : <div className="columns col-gapless hide-sm">
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
        }
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
          <div className="columns col-8 col-xl-10 col-md-11 col-sm-12 col-mx-auto">
            { data.league.activeSeason.standings
                .sort((a, b) => a.position - b.position)
                .slice(0, 3)
                .map((item, index) => {
                  return (
                    <div className={`col-4 ${index > 0 ? 'hide-sm' : 'col-sm-10 col-mx-auto'}`}>
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
            <div className="container">
              <div className="columns">
                <div className="table-container col-8 col-sm-10 col-mx-auto">
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
                  <p className="cta">
                    <a href="/standings" className="btn btn btn-primary"><span>View Full Standings</span></a>
                  </p>
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
          <div className="columns col-8 col-xl-10 col-md-10 col-mx-auto">
            <div className="container">
              <div className="columns">
                <div className="table-container col-8 col-md-10 col-sm-12 col-mx-auto">
                  { race.media && 
                    <GatsbyImage image={ getImage(race.media[0]) } alt="race screenshot" className="screenshot"/>
                  }
                  <Results 
                    headers={false}
                    fields={['finish', 'driver', 'points']}
                    results={
                      race.results
                        .slice(0,10)
                        .map(item => ({
                          ...item,
                          driver: data.drivers.nodes.find(({ name }) => name === item.name)
                        }))
                    }
                  />
                  <p className="cta">
                    <a href="/results" className="btn btn btn-primary"><span>View Full Results</span></a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
      </Tabs>

      <div className="promo hide-md">
        <Video src={{ mp4: promo }}/>
      </div>
            
    </>
  )
}

export const query = graphql`
  query IndexQuery {
    league: contentfulLeague(leagueId: {eq: 2732}) {
      name
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
        transform
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
          gatsbyImageData(
            placeholder: BLURRED
          )
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

import * as React from "react"
import { Link, Script, graphql } from 'gatsby'
import axios from 'axios'
import moment from 'moment'
import { Carousel, Slide } from '../components/carousel'
import Layout from '../layouts/home'
import Meta from '../components/meta'
import ScheduleCard from '../components/scheduleCard'
import StandingsCard from '../components/standingsCard'
import Video from '../components/video'
import * as styles from './index.module.scss'
import outputLogo from '../images/output-logo.svg'
import outputImage from '../images/output-screenshot-cup.png'
import nightowlLogo from '../images/reverb-logo.svg'
import nightOwlImage from '../images/reverb-screenshot-lmsc.png'
import promo from '../images/ORL-Season-2-promo.mp4'

const channel = "aussie_sim_commentator"
const isStreamOnlineURL = `https://api.outputracing.com/isStreamOnline?channel=${channel}`

const pathify = (string) => string?.replace(/[:-]/g, '').replace(/\s+/g, '-').toLowerCase()

const IndexPage = props => {
  const [ isStreamOnline, setIsStreamOnline ] = React.useState(false)
  
  React.useEffect(() => {
    async function fetchStream() {
      const response = await axios.get(isStreamOnlineURL).catch(err => {})
      const { status = false } = response?.data ?? {}
      setIsStreamOnline(!!status)
    }    
    const timer = setTimeout(fetchStream, 30000)
    fetchStream()
    return () => clearTimeout(timer)
  }, [])
  
  React.useEffect(() => {
    if (!isStreamOnline) return
    new window.Twitch.Player("broadcast", { 
      channel,
      parent: [
        "outputracing.com", 
        "beta.outputracing.com",
        "output-racing-gatsby.s3-website-us-west-2.amazonaws.com"
      ]
    })
  }, [isStreamOnline])
  
  const { cards = [] } = React.useMemo(
    () => props.data.schedules.nodes.reduce(
      (a, node) => {
        const date = new Date(`${node.raceDate.split('T')[0]}T${node.raceTime ?? '20:55:00'}`)
        console.log(node)
        if (node.chase === 'Y')
          a.chase.set(node.season.seasonId, node.eventName)
        else
          a.count.set(
            node.season.seasonId, 
            (a.count.get(node.season.seasonId) ?? 0) + 1
          )
        if (node.trackConfig?.trackId)
          node.trackAsset = props.data.assets.nodes.find(
            ({ trackId }) => trackId === node.trackConfig.trackId
          )
        if (date > Date.now() && node.chase !== 'Y' && node.race === null)
          a.cards = [...a.cards, (
            <Slide key={`event-${node.scheduleId}`}>
              <ScheduleCard 
                { ...node }
                title={a.chase.get(node.season.seasonId)}
                countdown={true}
                className={pathify(node.season.series.seriesName)}
                seriesId={node.season.seriesId}
                seasonName={node.season.seasonName}
                raceNumber={a.count.get(node.season.seasonId)}
              />
            </Slide>
          )]
        return a
      }, 
      { cards: [], chase: new Map(), count: new Map() }
    ),
    [props.data.schedules, props.data.assets]
  )
  
  const series = React.useMemo(() => props.data.series.nodes.reduce(
    (a, node) => ({
      ...a,
      [node.seriesId]: (
        <section className={`${styles.section} ${node.seriesId === 8100 ? styles.nightOwl : styles.output}`}>
          <div className={styles.sectionContainer}>
            <div className={styles.sectionScreenshot}>
              <div style={{backgroundImage: `url(${node.seriesId === 8100 ? nightOwlImage : outputImage })`}}/>
            </div>
            <div className={styles.sectionContent}>
              { node.seriesId === 8100
                  ? <Link to="/reverb-series/schedule" className={styles.seriesLogo}>
                      <img src={nightowlLogo} alt="Reverb Series"/>
                    </Link>
                  : <Link to="/output-series/schedule" className={styles.seriesLogo}>
                      <img src={outputLogo} alt="Output Series"/>
                    </Link>
              }
              <nav className={styles.nav}>
                <ul>
                  <li>
                    <Link to={`/${pathify(node.seriesName)}/drivers`}>
                      <span>Drivers</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={`/${pathify(node.seriesName)}/schedule`}>
                      <span>Schedule</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={`/${pathify(node.seriesName)}/stats`}>
                      <span>Stats</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={`/apply`}>
                      <span>Apply</span>
                    </Link>
                  </li>
                </ul>
              </nav>
              <h3>Latest News</h3>
              <ul className={styles.newsContainer}>
                {
                  props.data.news.nodes.reduce((items, item) => {
                    if ((node.seriesId === 8100 && item.series === 'reverb')
                      || (node.seriesId === 6842 && item.series === 'output')) {
                      if (items.length < 2) 
                        items.push(
                          <li key={item.contentful_id}>
                            <div className="date"><span className="day">{moment(item.date).format('DD')}</span><span className="month">{moment(item.date).format('MMM').toUpperCase()}</span></div>
                            <Link to={`/news/${item.slug}`}>
                              {item.title}
                            </Link>
                            <i className="icon icon-arrow-right"></i>
                          </li>
                        )
                    }
                    return items
                  }, [])
                }
              </ul>
              <p className="cta">                    
                <Link to={`/news`}>
                  <span>More News</span>
                </Link>
              </p>
              { node.currentSeason?.schedules.some(({ race }) => race !== null) > 0 && 
                <>
                  <h3>Current Standings</h3>
                  { Array.from(
                      node.currentSeason?.schedules.reduce(
                        (acc, schedule) => {
                          schedule.race?.participants.forEach(
                            (p) => {
                              const bonusPoints = p.bonuses?.reduce(
                                (points, { bonusPoints }) => points += bonusPoints, 
                                0
                              ) ?? 0
                              const penaltyPoints = p.penalties?.reduce(
                                (points, { penaltyPoints }) => points += penaltyPoints,
                                0
                              ) ?? 0
                              const totalPoints = p.racePoints + bonusPoints - penaltyPoints
        
                              const key = p.driver.member?.driverNickName ?? p.driver.driverName
                              acc.set(key, (acc.get(key) ?? 0) + totalPoints)
                            }
                          )
                          return acc
                        }, 
                        new Map()
                      ) ?? {}
                    ).sort(
                      (a, b) => b[1] - a[1]
                    ).slice(0,3).map(([driverName, totalPoints], index) => (
                      <StandingsCard 
                        key={`standings-${index}`}
                        position={index + 1}
                        driver={{ driverName }}
                        totalPoints={totalPoints}
                      />
                    ))
                  }
                  <p className="cta">                    
                    <Link to={`/${pathify(node.seriesName)}/standings`}>
                      <span>Full Standings</span>
                    </Link>
                  </p>
                </>
              }
            </div>
          </div>
        </section>
      )
    }),
    {}
  ), [props.data.series, props.data.news])
  
  return (
    <Layout {...props}>
      <Script src= "https://player.twitch.tv/js/embed/v1.js"/>
      
      { isStreamOnline
          ? (
            <div className={`${styles.broadcastContainer} columns`}>
              <div className="col-8 col-xl-10 col-lg-12 col-mx-auto">
                <div id="broadcast"></div>
              </div>
            </div>            
          )
          : (
            <div className={styles.scheduleContainer}>
                 { true
                    ? (
                      <Carousel options={{ 
                        type: "slider", 
                        rewind: false,
                        perView: 1
                      }}>
                        { cards }
                      </Carousel>                    
                    ) 
                    : null
                }
              </div>            
          )
      }
      
      {series[6842]}
      
      {series[8100]}
      
      <div className={`${styles.promo} hide-md`}>
        <Video src={{ mp4: promo }}/>
      </div>
            
    </Layout>
  )
}

export const query = graphql`
  query IndexQuery {
    series: allMysqlSeries(
     filter: {series_active: {eq: "Y"}} 
    ) {
      nodes {
        seriesId: series_id
        seriesName: series_name
        currentSeason {
          schedules {
            race {
              participants {
                driverId: driver_id
                driver {
                  driverName: driver_name
                  member {
                    driverNickName: nick_name
                  }
                }
                racePoints: race_points
                bonuses {
                  bonusPoints: bonus_points
                }
                penalties {
                  penaltyPoints: penalty_points
                }
              }
            }
          }
        }
      }
    }
    assets: allIracingTrackAsset {
      nodes {
        trackId: track_id
        logo
        map: track_map
        layers: track_map_layers {
          active
        }
      }
    }
    schedules: allMysqlSchedule(
      sort: {race_date: ASC}
    ) {
      nodes {							
        scheduleId: schedule_id
        eventName: event_name
        chase
        raceDate: race_date
        raceTime: race_time
        race {
          raceId: race_id
        }
        season {
          seasonId: season_id
          seasonName: season_name
          seriesId: series_id
          series {
            seriesName: series_name
            currSeasonId: curr_season_id
          }
        }
        trackConfigId: track_config_id
        trackConfig {
          trackName: track_name
          trackId: track_config_iracing_id
        }
      }
    }
    news: allContentfulNews(sort: {date: DESC}) {
      nodes {
        contentful_id
        title
        date
        body {
          raw
        }
        series
        slug
      }
    }  
  }			
`

export default IndexPage

export const Head = (props) => (
  <Meta {...props}/>
)
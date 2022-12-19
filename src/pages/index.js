import * as React from "react"
import { Link, Script, graphql } from 'gatsby'
import axios from 'axios'
import { Carousel, Slide } from '../components/carousel'
import Layout from '../layouts/home'
import ScheduleCard from '../components/scheduleCard'
import StandingsCard from '../components/standingsCard'
import Video from '../components/video'
import * as styles from './index.module.scss'
import outputLogo from '../images/output-logo.svg'
import outputImage from '../images/output-screenshot-trucks.png'
import nightowlLogo from '../images/nightowl-logo.svg'
import nightOwlImage from '../images/night-owl-screenshot.png'
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
        if (
          node.season.seasonId === node.season.series.currSeasonId
            && node.chase !== 'Y'
            && node.race === null
        )
          a.cards = [...a.cards, (
            <Slide key={`event-${node.scheduleId}`}>
              <ScheduleCard 
                { ...node }
                title={a.chase.get(node.season.seasonId)}
                countdown={true}
                className={pathify(node.season.series.seriesName)}
                seriesId={node.season.seriesId}
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
                  ? <Link to="/night-owl-series/schedule" className={styles.seriesLogo}>
                      <img src={nightowlLogo} alt="Night Owl Series"/>
                    </Link>
                  : <Link to="/output-series/schedule" className={styles.seriesLogo}>
                      <img src={outputLogo} alt="Output Series"/>
                    </Link>
              }
              { node.seriesId === 8100
                  ? <p>
                      Output Racing League's road racing series for drivers of all skill levels. Congratulations to James Watson for closing out 2022 with the season 4 championship!<br/><br/>2023 Season 1 kicks off in the new year in GT4 cars with a small multi-class field of AI racers in TCRs. Races are held on Thursday nights with a schedule that is budget-friendly to Output's Tuesday night drivers. <Link to="/apply" className={`${styles.btn} ${styles.btnPrimary}`}><span>Apply now</span></Link>
                    </p>
                  : <p>
                      Output Racing League's flagship Tuesday late-night NASCAR series. Congratulations once again to Thomas Harmon for winning the 2022 season 2 championship over Matt Burgess and James Watson!<br/><br/>For 2023 the Output Series will be back in the Next Gen Cup Cars starting in February with the Daytona 500. Come join our clean and competitive community! <Link to="/apply" className={`${styles.btn} ${styles.btnPrimary}`}><span>Apply now</span></Link>
                    </p>
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
                </ul>
              </nav>
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
            </div>
          </div>
        </section>
      )
    }),
    {}
  ), [props.data.series])
  
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
                      type: "carousel", 
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
  }			
`

export default IndexPage

export { Head } from '../components/meta'
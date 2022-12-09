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

const pathify = (string) => string.replace(/[:-]/g, '').replace(/\s+/g, '-').toLowerCase()

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
  
  let startAt = React.useRef(null),
      offset = React.useRef(0)
  const mergedEvents = React.useMemo(() => {
    const events = props.data.seasons.edges.reduce(
      (a, { node: { seriesId, seriesName, seasonId, seasonName, seasonClass, events }}) => [ 
        ...a, 
        ...events.map(
          e => ({ seriesId, seriesName, seasonId, seasonName, seasonClass, ...e })
        )
      ], 
      []
    )
    let chase = {}
    return events 
      ? events
          .sort((a, b) => new Date(a.raceDate) - new Date(b.raceDate))
          .map((e, i) => {
            if (!e.raceNumber) {
              if (e.eventName) chase[e.seasonId] = e.eventName
              if (startAt.current === null) offset.current += 1
              return null
            }
            if (startAt.current === null && !e.race)
              startAt.current = i
            return (
              <Slide key={`event-${i}`}>
                <ScheduleCard 
                  { ...e }
                  title={chase[e.seasonId]}
                  countdown={startAt.current === i}
                  className={pathify(e.seriesName)}
                />
              </Slide>
            ) 
          })
      : null
  }, [props.data.seasons])
  
  const series = React.useMemo(() => props.data.seasons.edges.reduce(
    (a, { node }) => ({
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
                      Output Racing League's road racing series for drivers of all skill levels. Races on Thursday nights at tracks that Tuesday night drivers mostly already own. 2022 Season 3 starts soon, featuring Skippy double-headers with NASCAR AI drivers. <Link to="/apply" className={`${styles.btn} ${styles.btnPrimary}`}><span>Apply now</span></Link>
                    </p>
                  : <p>
                      Output Racing League's flagship Tuesday late-night NASCAR series. Congratulations to Thomas Harmon for winning 2022 season 1 championship in Camping World trucks! Season two kicks off mid-July, featuring the Next-Gen Cup Cars. <Link to="/apply" className={`${styles.btn} ${styles.btnPrimary}`}><span>Apply now</span></Link>
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
              { node.standings?.length > 0 && 
                <>
                  <h3>Current Standings</h3>
                  { node.standings
                      .slice(0, 3)
                      .map((item, index) => (
                        <StandingsCard 
                          position={item.position}
                          driver={item.member ? item.member : item.driverName}
                          totalPoints={item.totalPoints}
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
  ), [props.data.seasons])
  
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
                      perView: 1, 
                      startAt: startAt.current - offset.current
                    }}>
                      { mergedEvents }
                    </Carousel>                    
                  ) 
                  : null
              }
            </div>            
          )
      }
      
      { series[6842] }
      
      { series[8100] }
      
      <div className={`${styles.promo} hide-md`}>
        <Video src={{ mp4: promo }}/>
      </div>
            
    </Layout>
  )
}

// export const query = graphql`
//   query IndexQuery {
//     seasons: allSimRacerHubSeason(
//       filter: {active: {eq: true}}
//       sort: {fields: events___raceDate, order: ASC}
//     ) {
//       edges {
//         node {
//           seasonId
//           seasonName
//           seriesId
//           seriesName
//           seasonClass {
//             seasonClassCars {
//               carId
//               carSimId
//               carName
//             }
//           }
//           events {
//             raceNumber
//             raceDate
//             eventName
//             trackConfigId
//             trackName
//             cars {
//               carId
//               carName
//               carSimId
//             }
//             pointsCount
//             race {
//               participants {
//                 finishPos
//                 totalPoints
//                 member {
//                   ...driverChipData
//                 }
//                 driverName
//               }
//             }
//           }
//           standings {
//             driverName
//             member {
//               ...driverChipData
//             }
//             position
//             totalPoints
//           }	
//         }
//       }
//     }
//   }
// `

export default IndexPage

export { Head } from '../components/meta'
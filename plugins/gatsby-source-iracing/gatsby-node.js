/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */
// You can delete this file if you're not using it
const iRacing = require('./iracing')
const util = require('util')

exports.sourceNodes = async ({
  actions,
  cache,
  getNodesByType,
  reporter
}, pluginOptions) => {
  const { createNodeField } = actions
  
  const nodes = getNodesByType('ContentfulRace')
  await Promise.all(nodes
    .filter(({ subsessionId }) => subsessionId)
    .map(async (node) => {
      
      // Get cached iRacing data
      let { data, events } = await cache.get(node.subsessionId) || {}
      
      // Fetch data if not cached
      if (!data) {
        data = await iRacing.getLaps(node.subsessionId, pluginOptions)
        events = await iRacing.getSessionEvents(node.subsessionId, pluginOptions)
        
        await cache.set(node.subsessionId, { data, events })
      }
    
      let isCaution = false, 
          cautionLap = 0, 
          cautionLaps = [],
          restartLaps = []
          
      // Get lap numbers for caution periods from session events
      // Cautions include the lap the caution was thrown on to
      // avoid any discrepancies with lap times, but this ends
      // up meaning there is 1 additional caution lap per event
      // than what iRacing reports.
      // Also log restart laps separately to track fast lap
      // averages after restart metric
      events.forEach(event => {

        // Caution start lap number
        if (event.type === 'caution')
          cautionLap = event.lap
          
        // Caution ended; capture range of caution laps
        // Capture lap num of first post-caution, green-flag lap
        if (event.type === 'green') {
          cautionLaps.push(...range(cautionLap, event.lap, 1))
          restartLaps.push(event.lap + 1)
        }
          
      })

      let lapnum = 0, 
          laptime = 0, 
          pos = 0, 
          fastestLaps = [],
          fastLap = null,
          restarts = [],
          prevLap = {},
          currLap = {}
          
      // Get total laps from highest number in lap data
      const totalLaps = Math.max(...data.lapdata.map(({ lapnum }) => lapnum))
      // Get total green flag laps in race
      const totalGreenLaps = totalLaps - cautionLaps.length
          
      // Map iRacing lap data 
      const lapdata = data.lapdata
        .map((lap, index, laps) => {
          
          // Flag as lead lap by default
          let leadlap = true, 
          // Flag as caution if in array from events
              caution = cautionLaps.includes(lapnum),
          // Get lap time from difference between session times
          // from driver's previous lap
              time = index !== 0 && prevLap[lap.custid]
                ? lap.sesTime - prevLap[lap.custid].sesTime 
                : 0   
            
          // If previous lap was a restart, capture avg time since
          if (restartLaps.includes(lapnum - 1))
            restarts.push({ 
              custid: lap.custid, 
              time: (lap.sesTime - laps.find(
                ({ lapnum, custid }) => custid === lap.custid && lapnum === lap.lapnum - 2
              ).sesTime) / 2
            })
            
          // Next running position on same lap
          if (lapnum === lap.lapnum) {
            pos += 1
    
            // If no fast lap, set current as fastest
            // ... or update fast lap if non-0 current is quicker
            if (!fastLap || (fastLap.time > time && time > 0))
              fastLap = { ...lap, time }
              
            // Add to current lap cache
            currLap[lap.custid] = { pos, sesTime: lap.sesTime }
          }
            
          // Handle different lap from current
          else if (lapnum !== lap.lapnum) {
            
            // If lap is less, flag as off lead lap
            // and increment running position
            if (lap.lapnum < lapnum) {
              leadlap = false
              pos += 1
  
              // If no fast lap, set current as fastest
              // ... or update fast lap if non-0 current is quicker
              if (!fastLap || (fastLap.time > time && time > 0))
                fastLap = { ...lap, time }
                
              // Add to current lap cache
              currLap[lap.custid] = { pos, sesTime: lap.sesTime }
            }
            
            // If lap is greater, reset counters
            else if (lap.lapnum > lapnum) {
              laptime = lap.sesTime
              lapnum = lap.lapnum
              pos = 0
              
              // Update laptime
              // At this point, prevLap has not been reset to current
              // lap, so use current lap then reset everything.
              time = lap.sesTime - currLap[lap.custid].sesTime 

              // Reset lap cache
              prevLap = currLap
              currLap = { [lap.custid]: { pos, sesTime: lap.sesTime }}
              
              // Push the fastest lap and reset
              fastestLaps.push(fastLap)
              fastLap = { ...lap, time}
            }
          }
          
          let posGain = 0,
              qualGain = 0,
              closeGain = 0
              
          // Handle position gain categories
          if (prevLap[lap.custid]) {
            
            // Calculate position gain this lap
            posGain = prevLap[lap.custid].pos - pos
            
            // Calculate quality position gain – number of passes moving
            // in to position 7 (index 6) or higher
            qualGain = (pos <= 6 && prevLap[lap.custid].pos > 6) 
              ? (6 + 1) - pos
              : 0

            // Calculate closing gain – passes in final 10% laps
            closeGain = (lapnum >= totalLaps - (totalLaps * .1))
              ? prevLap[lap.custid].pos - pos
              : 0

          }
            
          return {
            ...lap,
            pos,
            time,
            leadlap,
            caution,
            passes: Math.max(posGain, 0),
            qualpasses: Math.max(qualGain, 0),
            closingpasses: Math.max(closeGain, 0),
            // flags & 1 = "invalid"
            // flags & 2 = "pitted"
            // flags & 4 = "off track"
            // flags & 8 = "black flag"
            // flags & 16 = "car reset"
            // flags & 32 = "contact"
            // flags & 64 = "car contact"
            // flags & 128 = "lost control"
            // flags & 256 = "discontinuity"
            // flags & 512 = "interpolated crossing"
            // flags & 1024 = "clock smash"
            // flags & 2048 = "tow"
            anomaly: lap.flags & 1 || lap.flags & 512 || lap.flags & 1024,
          }
        })
        // Second pass to update fastest laps
        .map(lap => {
          const match = fastestLaps.find(
            ({ lapnum, custid }) => lapnum === lap.lapnum && custid === lap.custid
          )
          return {
            ...lap,
            fastest: !!match
          }
        })
      
      const drivers = data.startgrid
        .map(driver => {
          
          // Get laps for this driver
          const laps = lapdata.filter(
            (lap) => lap.custid === driver.custid && lap.lapnum > 0 && !lap.anomaly
          )
          
          // Filter laps for green flag only
          const greenFlagLaps = laps.filter(({ caution }) => !caution)
          
          // Filter for green flag laps on the lead lap
          const greenFlagLeadLaps = greenFlagLaps
            .filter(({ leadlap }) => leadlap)
          
          // Get number laps in lead position
          const lapsLed = laps
            .filter(({ pos }) => pos === 0).length
            
          // Get number green flag laps in lead position
          const greenFlagLapsLed = greenFlagLaps
            .filter(({ pos }) => pos === 0).length

          // Get sum of positions on all laps
          // Build an array of all laps, repeating the last item
          // for every lap not completed by the driver
          const totalPosition = laps.length > 0 
            ? Array.from(
                { length: totalLaps }, 
                (v, i) => {
                  return i < laps.length
                    ? laps[i]
                    : laps[laps.length - 1]
                }
              ).reduce((total, { pos }) => total + pos, 0)
            : 0
            
          // Calculate average position for entire race
          // Use -1 when no laps completed so it doesn't appear like
          // this driver led the entire race
          const averagePosition = laps.length > 0 
            ? (totalPosition / totalLaps)
            : -1 
          
          // Get sum of running positions on green flag laps
          const totalGreenPosition = greenFlagLeadLaps
            .reduce((total, { pos }) => total + pos, 0)
            
          // Calculate average running position under green laps completed
          const averageRunningPosition = (totalGreenPosition / greenFlagLeadLaps.length) 
            || driver.startPos
          
          // Get sum of green flag lap times
          const totalLapTime = greenFlagLaps
            .reduce((total, { time }) => total + time, 0)
            
          // Calculate average of lap times under green
          const averageLapTime = (totalLapTime / greenFlagLaps.length) || 0
          
          // console.log(util.inspect(greenFlagLaps.map(lap => ({
          //   lap: lap.lapnum,
          //   name: driver.displayName,
          //   time: lap.time
          // })), { colors: true, depth: 1, maxArrayLength: 140}))
          
          // Get average of 3 fastest non-0 lap times
          const averageFastLapTime = laps.filter(({ time }) => time > 0).length >= 3 
            ? laps
                .filter(({ time }) => time > 0)
                .sort((a, b) => a.time - b.time)
                .slice(0, 3)
                .reduce((total, { time }) => total + time, 0) / 3
            : 0

          const greenFlagFastLaps = greenFlagLaps
            .filter(({ fastest }) => fastest).length

          return {
            ...driver,
            laps,
            lapsLed,
            averagePosition,
            averageRunningPosition,
            averageLapTime,
            averageFastLapTime,
            passes: laps.reduce((a, { passes }) => a + passes, 0),
            qualityPasses: laps.reduce((a, { qualpasses }) => a + qualpasses, 0),
            closingPasses: laps.reduce((a, { closingpasses }) => a + closingpasses, 0),
            
            // Primary Statistics
            // ------------------
            // Points awarded by old NASCAR format (180, 175, etc.) by rank in each
            // of four weighted categories: finishing position, average running position,
            // average speed and average of 3 fastest laps. Only green-flag and
            // lead-lap laps count towards average running position.
            //
            primaryPoints: getPoints(driver.finishPos), // Finish
            
            // Fixed Bonus Points
            // ------------------
            // Bonus points awarded for reaching certain goals: wins, top 10s, lead
            // most laps, finishing on the lead lap, average running position better
            // than 10, 6 and 2.
            //
            fixedPoints: 
              (driver.finishPos === 0 ? 20 : 0)       // Win
                + (driver.finishPos < 10 ? 10 : 0)    // Top 10
                + (laps.length === totalLaps ? 5 : 0) // Lead lap
                + (averageRunningPosition < 9 ? 5 : 0)            // ARP < 10
                + (averageRunningPosition < 5 ? 5 : 0)            // ARP < 6
                + (averageRunningPosition < 1 ? 5 : 0),           // ARP < 2
            
            // Variable Bonus Points
            // ---------------------
            // Number of green flag laps led and green flag fastest laps divided
            // by the total number of green flag laps completed by the driver, 
            // multiplied by 100. Available points capped at 100.
            //
            variablePoints: greenFlagLaps.length > 0
              ? Math.min(
                  ((greenFlagLapsLed + greenFlagFastLaps) / greenFlagLaps.length) * 100,
                  100
                )
              : 0,
          }
        })
        .sort((a, b) => a.averageRunningPosition - b.averageRunningPosition)
        .map((driver, index) => ({
          ...driver,
          // Primary statistics: add points * 2 for average running position rank
          primaryPoints: driver.primaryPoints + getPoints(index, 2),
          arpRank: index,
        }))
        .sort((a, b) => a.averageLapTime === 0
          ? 1
          : b.averageLapTime === 0
            ? -1 
            : a.averageLapTime - b.averageLapTime
        )
        .map((driver, index) => {
          // console.log(util.inspect({
          //   pos: index, 
          //   name: driver.displayName, 
          //   avg: driver.averageLapTime,
          //   time: driver.totalLapTime, 
          //   laps: driver.greenFlagLaps.length
          // }, false, null, true))
          return {
            ...driver,
            // Primary statistics: add points for average speed rank
            primaryPoints: driver.primaryPoints + getPoints(index),
            avgSpeedRank: index,
          }
        })
        .sort((a, b) => a.averageFastLapTime === 0
          ? 1 
          : b.averageFastLapTime === 0
            ? -1
            : a.averageFastLapTime - b.averageFastLapTime
        )
        .map((driver, index) => {
          // console.log(index, driver.displayName, driver.averageFastLapTime)
          return {
            ...driver,
            // Primary statistics: add points * 1/9 for average of fastest 3 laps rank
            primaryPoints: driver.primaryPoints + getPoints(index, 1/9),
            avgFastLapRank: index,
          }
        })
        .sort((a, b) => b.lapsLed - a.lapsLed)
        .map((driver, index) => ({
          ...driver,
          // Fixed points: add bonus for leading the most laps
          fixedPoints: driver.fixedPoints + (index === 0 ? 10 : 0)
        }))
        .sort((a, b) => a.finishPos - b.finishPos)
        .map((driver, index) => ({
          custid: driver.custid,
          avgPos: driver.averagePosition,
          arp: driver.averageRunningPosition,
          avgFastLap: driver.averageFastLapTime,
          numFastLap: driver.laps.filter(({ fastest }) => fastest).length,
          passes: driver.passes,
          qualityPasses: driver.qualityPasses,
          closingPasses: driver.closingPasses,
          start: driver.startPos,
          finish: driver.finishPos,
          rating: driver.laps.length > 0
            ? (driver.primaryPoints + driver.fixedPoints + driver.variablePoints) / 6
            : 0
        }))
      
        // console.log(util.inspect(drivers, false, null, true))
        
        createNodeField({
          node,
          name: 'ratings',
          value: drivers.map(({ custid, arp, rating }) => ({ custid, arp, rating }))
        })
        
        createNodeField({
          node,
          name: 'bestAvgPos',
          value: drivers.reduce(
            (best, { custid, avgPos }) => {
              if (!best && avgPos >= 0) 
                return { custid, avgPos }
              else
                return (avgPos >= 0 && avgPos < best.avgPos )
                  ? { custid, avgPos }
                  : best
            },
            null
          )
        })
        
        createNodeField({
          node,
          name: 'bestFastLap',
          value: lapdata.reduce(
            (best, { custid, time }) => {
              if (!best && time > 0) 
                return { custid, time }
              else
                return (time > 0 && time < best.time)
                  ? { custid, time }
                  : best
            },
            null
          )
        })

        createNodeField({
          node,
          name: 'bestNumFastLap',
          value: drivers.reduce(
            (best, { custid, numFastLap }) => {
              if (!best) 
                return { custid, numFastLap }
              else
                return (numFastLap > best.numFastLap)
                  ? { custid, numFastLap }
                  : best
            },
            null
          )
        })

        createNodeField({
          node,
          name: 'bestAvgFastLap',
          value: drivers.reduce(
            (best, { custid, avgFastLap }) => {
              if (!best) 
                return { custid, avgFastLap }
              else
                return (avgFastLap < best.avgFastLap && avgFastLap > 0)
                  ? { custid, avgFastLap }
                  : best
            },
            null
          )
        })

        createNodeField({
          node,
          name: 'bestRestarts',
          value: restarts.reduce(
            (best, { custid, time }) => {
              if (!best) 
                return { custid, time }
              else
                return (time < best.time && time > 0)
                  ? { custid, time }
                  : best
            },
            null
          )
        })
        
        createNodeField({
          node,
          name: 'bestPasses',
          value: drivers
            .reduce(
              (best, { custid, passes }) => {
                if (!best) 
                  return { custid, passes }
                else
                  return (passes > best.passes)
                    ? { custid, passes }
                    : best
              },
              null
            )
        })
        
        createNodeField({
          node,
          name: 'bestQualityPasses',
          value: drivers
            .reduce(
              (best, { custid, qualityPasses }) => {
                if (!best) 
                  return { custid, qualityPasses }
                else
                  return (qualityPasses > best.qualityPasses)
                    ? { custid, qualityPasses }
                    : best
              },
              null
            )
        })

        createNodeField({
          node,
          name: 'bestClosingPasses',
          value: drivers
            .reduce(
              (best, { custid, closingPasses }) => {
                if (!best) 
                  return { custid, closingPasses }
                else
                  return (closingPasses > best.closingPasses)
                    ? { custid, closingPasses }
                    : best
              },
              null
            )
        })

        createNodeField({
          node,
          name: 'hardCharger',
          value: drivers
            .reduce(
              (best, { custid, start, finish }) => {
                const gain = Math.min(start, 11) - finish
                if (!best) 
                  return { custid, gain }
                else
                  return (gain > best.gain)
                    ? { custid, gain }
                    : best
              },
              null
            )
        })

        return 
      
    }))   
    
  return
}

const getTimeFromMilliseconds = (time) => {
  let hours = Math.floor(time / (3600 * 10000))
  time = time - hours * 3600 * 10000
  let min = Math.floor(time / (60 * 10000))
  time = time - min * 60 * 10000
  let secs = Math.floor(time / 10000)
  time = time - secs * 10000
  const tenths = Math.floor(time / 1000)
  time = time - tenths * 1000
  const hun = Math.floor(time / 100)
  time = time - hun * 100
  const thous = Math.floor(time / 10)
  if (hours) 
    hours += ":"
  else 
    hours = ""
  if (min < 10)
    min = "0" + min
  if (secs < 10)
    secs = "0" + secs
  return hours + min + ":" + secs + "." + tenths + hun + thous
}

const getPoints = (rank, multiplier = 1) => {
  if (rank < 0 || rank >= POINTS.length) return 0
  const points = POINTS[rank] * multiplier
  const max = POINTS[0] * multiplier
  const min = POINTS[POINTS.length - 1] * multiplier
  return Math.max(Math.min(points, max), min)
}

const range = (start, stop, step) => Array.from(
  { length: (stop - start) / step + 1}, (_, i) => start + (i * step)
)

const groupBy = (array, key) => array.reduce(
  (entryMap, e) => entryMap.set(e[key], [...entryMap.get(e[key]) || [], e]),
  new Map()
)

const POINTS = [180, 170, 165, 160, 155, 150, 146, 142, 138, 134, 130, 127, 124, 121, 118, 115, 112, 109, 106, 103, 100, 97, 94, 91, 88, 85, 82, 79, 76, 73, 70, 67, 64, 61, 58, 55, 52, 49, 46, 43, 40, 37, 34]
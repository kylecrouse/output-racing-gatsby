/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */
// You can delete this file if you're not using it
const iRacing = require('./iracing')
const util = require('util')

/**
 * You can uncomment the following line to verify that
 * your plugin is being loaded in your site.
 *
 * See: https://www.gatsbyjs.com/docs/creating-a-local-plugin/#developing-a-local-plugin-that-is-outside-your-project
 */
exports.onPreInit = () => console.log("Loaded gatsby-source-iracing")

exports.sourceNodes = async ({
  actions,
  cache,
  getNodesByType,
}, pluginOptions) => {
  const { createNodeField } = actions
  
  const nodes = getNodesByType('ContentfulRace')
  await Promise.all(nodes
    .filter(({ subsessionId }) => subsessionId)
    .map(async (node) => {
      
      let { data, events } = await cache.get(node.subsessionId) || {}
      
      if (!data) {
        data = await iRacing.getLaps(node.subsessionId, pluginOptions)
        events = await iRacing.getSessionEvents(node.subsessionId, pluginOptions)
        
        await cache.set(node.subsessionId, { data, events })
      }
    
      /**
        * SECTION 1
        * ---------
        * POINTS[finish]
        * POINTS[average position finish] * 2    
        * POINTS[average speed finish]
        * POINTS[fastest 3 lap average finish] * (1/9)  # should this be points?
        * 
        * SECTION 2
        * ---------
        * finish == 1 ? 20 : 0
        * finish <= 10 ? 10 : 0
        * led most laps ? 10 : 0
        * laps == total laps ? 5 : 0
        * average position <= 8 ? 5 : 0
        * average position <= 5 ? 5 : 0
        * average position <= 2 ? 5 : 0
        * 
        * SECTION 3
        * ---------
        * ((fastest laps (green only) + laps led (green only)) / green laps) * 100) > 100 ? 100 : value
        * 
        * RATING
        * ---------
        * SUM / 6
        */
      
      let lapnum = 0, laptime = 0  
      const laps = groupBy(data.lapdata.map((lap, index, laps) => {
        let interval = { value: 0, unit: "time" }    
        if (lapnum === lap.lapnum)
          interval = { value: lap.sesTime - laptime, unit: "time" }
        else if (lapnum !== lap.lapnum) {
          if (lap.lapnum < lapnum)
            interval = { value: lap.lapnum - lapnum, unit: "laps" }
          else if (lap.lapnum > lapnum) {
            laptime = lap.sesTime
            lapnum = lap.lapnum
          }
        }
        const prev = laps.find(
          ({ lapnum, custid }) => custid === lap.custid && lapnum === lap.lapnum - 1
        )
        return {
          ...lap,
          time: index !== 0 && prev ? lap.sesTime - prev.sesTime : 0,
          interval,
        }
      }), 'lapnum')
      const totalLaps = lapnum//data.lapdata[data.lapdata.length - 1].lapnum
    
      let isCaution = false, cautionLaps = []
      for (let lap = 0; lap < totalLaps; lap++) {
        const event = events.find(event => event.lap === lap)
        if (event)
          if (event.type === 'caution')
            isCaution = true
          else if (event.type === 'green')
            isCaution = false
        if (isCaution) 
          cautionLaps.push(lap)
      }
      
      const drivers = data.startgrid
        .map(driver => {
          const driverLaps = [...laps].map(([key, value], index, laps) => {
            const pos = value.findIndex(({ custid }) => custid === driver.custid)
            const lap = value[pos]
            if (lap) {
              let flags = lap.flags
              flags &= 4095
              return { 
                ...lap, 
                pos,
                caution: cautionLaps.includes(index) ? true : false,
                fastest: value.sort((a, b) => a.time - b.time)[0].custid === driver.custid,
                leadlap: lap.interval.type !== 'laps',
                anomaly: flags & 256 || flags & 512 || flags & 1024
              }
            }
            else 
              return null
          }).filter((lap) => lap && !lap.anomaly)
          const greenFlagLaps = driverLaps.filter(({ caution }) => !caution)
          
          const lapsLed = driverLaps
            .filter(({ pos }) => pos === 0).length
          const greenFlagLapsLed = greenFlagLaps
            .filter(({ pos }) => pos === 0).length
          const totalPosition = greenFlagLaps
            .filter(({ leadlap }) => leadlap)
            .reduce((total, { pos }) => total + pos, 0)
          const averagePos = (totalPosition / greenFlagLaps.filter(({ leadlap }) => leadlap).length) || driver.startPos
          const totalLapTime = greenFlagLaps
            .reduce((total, { time }) => total + time, 0)
          const averageLapTime =  (totalLapTime / greenFlagLaps.length) || 9999999999
          const averageFastLapTime = driverLaps
            .sort((a, b) => a.time - b.time)
            .filter(({ time }) => time > 0)
            .slice(0, 3)
            .reduce((total, { time }) => total + time, 0) / 3
          const greenFlagFastLaps = greenFlagLaps
            .filter(({ fastest }) => fastest).length
            
          // console.log(util.inspect({
          //   car: `#${driver.carnum}`,
          //   laps: driverLaps.length,
          //   anomalies: driverLaps.filter(({ anomaly }) => anomaly).length,
          //   green: greenFlagLaps.length,
          //   greenLL: greenFlagLaps.filter(({leadlap}) => leadlap).length,
          //   led: lapsLed,
          //   greenLed: greenFlagLapsLed,
          //   fastest: greenFlagFastLaps,
          //   finish: driver.finishPos,
          //   trp: totalPosition,
          //   arp: averagePos,
          //   alt: getTimeFromMilliseconds(averageLapTime),
          //   aft: getTimeFromMilliseconds(averageFastLapTime),
          // }, false, null, true))
            
          return {
            ...driver,
            laps: driverLaps,
            lapsLed,
            averagePos,
            averageLapTime,
            averageFastLapTime,
            finishPosPoints: POINTS[driver.finishPos] * 1,
            winBonusPoints: driver.finishPos === 0 ? 20 : 0,
            finishBonusPoints: driver.finishPos < 10 ? 10 : 0,
            leadLapBonusPoints: driverLaps.length === totalLaps ? 5 : 0,
            averageFinishTier1BonusPoints: driver.averagePos < 9 ? 5 : 0,
            averageFinishTier2BonusPoints: driver.averagePos < 5 ? 5 : 0,
            averageFinishTier3BonusPoints: driver.averagePos < 1 ? 5 : 0,
            variableBonusPoints: (((greenFlagLapsLed + greenFlagFastLaps) / greenFlagLaps.length) * 100) || 0
          }
        })
        .sort((a, b) => a.lapsLed - b.lapsLed)
        .map((driver, index) => ({
          ...driver,
          lapsLedPoints: index === 0 ? 10 : 0
        }))
        .sort((a, b) => a.averagePos - b.averagePos)
        .map((driver, index) => ({
          ...driver,
          averagePosPoints: POINTS[index] * 2
        }))
        .sort((a, b) => a.averageLapTime - b.averageLapTime)
        .map((driver, index) => ({
          ...driver,
          averageLapTimePoints: POINTS[index] * 1
        }))
        .sort((a, b) => a.averageFastLapTime - b.averageFastLapTime)
        .map((driver, index) => ({
          ...driver,
          averageFastLapTimePoints: POINTS[index] * (1/9)
        }))
        .sort((a, b) => a.finishPos - b.finishPos)
        .map((driver, index) => ({
          custid: driver.custid,
          carnum: driver.carnum,
          rating: (driver.finishPosPoints + driver.averagePosPoints + driver.averageLapTimePoints + driver.averageFastLapTimePoints + driver.winBonusPoints + driver.finishBonusPoints + driver.leadLapBonusPoints + driver.averageFinishTier1BonusPoints + driver.averageFinishTier2BonusPoints + driver.averageFinishTier3BonusPoints + driver.variableBonusPoints) / 6
        }))
      
        // console.log(util.inspect(drivers.sort((a,b) => b.rating - a.rating).map(({ carnum, rating }) => ({ car: `#${carnum}`, rating })), false, null, true))
        
        createNodeField({
          node,
          name: 'ratings',
          value: drivers
        })
        
        return 
      
    }))   
    
  return
}

const groupBy = (array, key) => array.reduce(
  (entryMap, e) => entryMap.set(e[key], [...entryMap.get(e[key]) || [], e]),
  new Map()
)

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

const POINTS = [180, 170, 165, 160, 155, 150, 146, 142, 138, 134, 130, 127, 124, 121, 118, 115, 112, 109, 106, 103, 100, 97, 94, 91, 88, 85, 82, 79, 76, 73, 70, 67, 64, 61, 58, 55, 52, 49, 46, 43, 40, 37, 34]
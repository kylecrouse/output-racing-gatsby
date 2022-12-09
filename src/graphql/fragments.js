import * as React from 'react'
import { graphql } from 'gatsby'

export const driverData = graphql`
	fragment driverData on MysqlDriver {
		active
		driverId
		driverName
		driverCarLogo {
			publicURL
		}
		carNumber
		driverNumberArt {
			gatsbyImageData	
			file {
				url
			}
		}
		driverMedia {
			gatsbyImageData(
				layout: FULL_WIDTH
				placeholder: BLURRED
			)
			file {
				url
			}
			metadata {
				tags {
					name
				}
			}
		}
		irOval
		srOval
		licenseOval
		irRoad
		srRoad
		licenseRoad
	}
`

export const driverChipData = graphql`
	fragment driverChipData on MysqlDriver {
		active
		driverName
		carNumber
		driverNumberArt {
			gatsbyImageData	
			file {
				url
			}
		}
	}
`

export const eventData = graphql`
	fragment eventData on MysqlRace {
		cars {
			carId
			carSimId
			carName
		}
		chase {
			chaseNumDrivers
		}
		eventName
		offWeek
		raceLength
		raceLengthUnit
		pointsCount
		race {
			...raceData
		}
		raceDate
		trackConfigId
		trackConfigName
		trackName
	}
`

export const participantData = graphql`
	fragment participantData on MysqlParticipant {
		driverId: driver_id
		driverName: driver_name
		carId: car_id
		carName: car_name
		carImage {
			publicURL
		}
		finishPos: finish_pos
		incidents
		interval: intv
		lapsLed: laps_led
		lapsCompleted: num_laps
		qualifyPos: qualify_pos
		qualifyTime: qualify_time
		fastestLapTime: fastest_lap_time
		racePoints: race_points
		avgLap: avg_lap
		status
		bonuses {
			bonusDesc: bonus_descr
			bonusPoints: bonus_points
		}
		penalties {
			penaltyDesc: penalty_descr
			penaltyPoints: penalty_points
		}
	}
`

export const raceData = graphql`
	fragment raceData on MysqlRace {
		raceId
		eventName
		eventBroadcast
		eventLogo {
			gatsbyImageData	
		}
		eventMedia {
			gatsbyImageData(
				layout: FULL_WIDTH
				placeholder: BLURRED
			)
		}
		pointsCount
		trackName
		trackConfigId
		trackConfigName
		trackType
		weatherFog
		weatherHumidity
		weatherSkies
		weatherTemp
		weatherTempUnit
		weatherType
		weatherWind
		weatherWindDir
		weatherWindUnit
		seriesName
		seasonName
		raceAvgTime
		raceDate
		raceCautions
		raceCautionLaps
		raceLaps
		raceLeadChanges
		raceTime
	}
`

export const standingsData = graphql`
	fragment standingsData on MysqlParticipant {
		behindLeader
		behindNext
		bonusPoints
		change
		driverId
		driverName
		incidents
		lapsCompleted
		member {
			...driverChipData
		}
		penaltyPoints
		position
		racesCounted
		rating
		starts
		top10s
		top5s
		totalPoints
		wins	
	}
`

export const statsData = graphql`
	fragment statsData on MysqlDriver {
		trackName
		typeName
		starts
		avgStartPos
		avgFinishPos
		wins
		podiums
		top5s
		top10s
		lapsCompleted
		lapsLed
		poles
		incidents
		incidentsPerRace
		winPct
		podiumPct
		top5Pct
		top10Pct
		lapsLedPct
		polePct
		incidentsPerLap
		rating
	}
`

export const superlativeData = graphql`
	fragment superlativeData on DriverSuperlative {
		driver {
			...driverChipData
		}
		value
	}
`
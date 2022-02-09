import * as React from 'react'
import { graphql } from 'gatsby'

export const driverData = graphql`
	fragment driverData on SimRacerHubDriver {
		custid
		active
		driverName
		driverNickname
		driverNumber
		driverNumberArt {
			gatsbyImageData	
			file {
				url
			}
		}
		driverLicense {
			iRating
			licColor
			licGroup
			licGroupDisplayName
			licLevel
			licLevelDisplayName
			srPrime
			srSub
		}
		driverMedia {
			gatsbyImageData(
				layout: FULL_WIDTH
				placeholder: BLURRED
			)
			file {
				url
			}
		}
		stats {
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
		}
		trackStats {
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
		}
		typeStats {
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
		}
		races {
			carId
			finishPos
			incidents
			lapsLed
			numLaps
			qualifyPos
			scheduleId
			seasonId
			seriesId
			trackConfigId
		}
	}
`

export const eventData = graphql`
	fragment eventData on SimRacerHubEvent {
		cars {
			carId
			carName
		}
		chase
		eventName
		offWeek
		raceLength
		raceLengthUnit
		pointsCount
		race {
			...raceData
		}
		raceDate
		trackConfigName
		trackLogo
		trackName
	}
`

export const participantData = graphql`
	fragment participantData on SimRacerHubParticipant {
		carId
		carImage {
			publicURL
		}
		carName
		driverId
		driverName
		member {
			...driverData
		}
		finishPos
		incidents
		intv
		lapsLed
		numLaps
		qualifyPos
		qualifyTime
		fastestLapTime
		racePoints
		avgLap
		provisional
		status
		bonus {
			bonusPoints
			bonusDescr
		}
		penalty {
			penaltyPoints
			penaltyDescr
		}
		avgPos
		arp
		avgFastLap
		numFastLap
		passes
		qualityPasses
		closingPasses
		rating
	}
`

export const raceData = graphql`
	fragment raceData on SimRacerHubRace {
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
		trackConfigName
		trackLogo
		weatherFog
		weatherRh
		weatherSkies
		weatherTemp
		weatherTempunit
		weatherType
		weatherWind
		weatherWinddir
		weatherWindunit
		seriesName
		seasonName
		raceAvgTime
		raceDate
		raceCautions
		raceCautionLaps
		raceLaps
		raceLeadChanges
		raceTime
		participants {
			...participantData
		}
		bestAvgPos {
			driver {
				...driverData
			}
			avgPos
		}
		bestFastLap {
			driver {
				...driverData
			}
			fastestLapTime
		}
		bestNumFastLap {
			driver {
				...driverData
			}
			numFastLap
		}
		bestAvgFastLap {
			driver {
				...driverData
			}
			avgFastLap
		}
		bestRestart {
			driver {
				...driverData
			}
			fastestRestart
		}
		bestPasses {
			driver {
				...driverData
			}
			passes
		}
		bestQualityPasses {
			driver {
				...driverData
			}
			qualityPasses
		}
		bestClosingPasses {
			driver {
				...driverData
			}
			closingPasses
		}
		hardCharger {
			driver {
				...driverData
			}
			gain
		}
	}
`

export const standingsData = graphql`
	fragment standingsData on SimRacerHubSeasonStandings {
		behindLeader
		behindNext
		bonusPoints
		change
		driverId
		driverName
		incidents
		lapsCompleted
		member {
			...driverData
		}
		penaltyPoints
		position
		racesCounted
		starts
		top10s
		top5s
		totalPoints
		wins	
	}
`
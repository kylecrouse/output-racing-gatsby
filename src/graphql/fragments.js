import * as React from 'react'
import { graphql } from 'gatsby'

export const driverData = graphql`
	fragment driverData on SimRacerHubDriver {
		active
		driverName
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
		}
		driverIROval
		driverSROval
		driverLicenseOval
		driverIRRoad
		driverSRRoad
		driverLicenseRoad
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
			rating
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
			rating
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
			rating
		}
	}
`

export const driverChipData = graphql`
	fragment driverChipData on SimRacerHubDriver {
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
		carName
		carImage {
			publicURL
		}
		driverName
		member {
			...driverChipData
		}
		finishPos
		incidents
		interval
		lapsLed
		lapsCompleted
		qualifyPos
		qualifyTime
		fastestLapTime
		totalPoints
		racePoints
		avgLap
		status
		bonusPoints
		penaltyPoints
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
		participants {
			...participantData
		}
		bestAvgPos {
			...superlativeData
		}
		bestFastLap {
			...superlativeData
		}
		bestNumFastLap {
			...superlativeData
		}
		bestAvgFastLap {
			...superlativeData
		}
		bestRestart {
			...superlativeData
		}
		bestPasses {
			...superlativeData
		}
		bestQualityPasses {
			...superlativeData
		}
		bestClosingPasses {
			...superlativeData
		}
		hardCharger {
			...superlativeData
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

export const superlativeData = graphql`
	fragment superlativeData on DriverSuperlative {
		driver {
			...driverChipData
		}
		value
	}
`
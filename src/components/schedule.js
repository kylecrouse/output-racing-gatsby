import * as React from 'react'
import moment from 'moment'
import './schedule.css'


const Schedule = (props) => {
	return (
		<table id="schedule">
			<thead>
				<tr>
					<th width="13%">Date</th>
					<th>Event</th>
					<th width="42%">Track</th>
					<th width="5%">Duration</th>
				</tr>
			</thead>
			<tbody>
				{ props.schedule.map((race) => {
						if (!race.counts && !race.offWeek && race.raceNo === "")
							return (
								<tr key={race.raceNo}>
									<td colspan="4" style={{backgroundColor:"#f4a913", textAlign: "center"}}>
										<i style={{fontWeight:"bold"}}>{race.name}</i>
									</td>
								</tr>
							);
						if (race.offWeek)
							return (
								<tr key={race.raceNo}>
									<td style={{ whiteSpace: "nowrap" }}>{moment.parseZone(race.date).format('MMM D, YYYY')}</td>
									<td colspan="3" style={{ whiteSpace: "nowrap" }}><i>{race.name}</i></td>
								</tr>
							);
						if (!race.offWeek && race.raceNo !== "")
							return (
								<tr key={race.raceNo}>
									<td style={{ whiteSpace: "nowrap" }}>{moment.parseZone(race.date).format('MMM D, YYYY')}</td>
									<td>
										{ race.raceId 
												? <a href={`/results/${race.raceId}/`}>{race.name}</a>
												: race.name
										}
										{ !race.counts && <i style={{opacity:0.5}}> (non-points)</i>}
									</td>
									<td>{race.track}</td>
									<td>{race.laps ? `${race.laps}\u00A0laps` : race.time}</td>
								</tr>
							);
						return null;
					}) 
				}
			</tbody>
		</table>	
	)
}

export default Schedule
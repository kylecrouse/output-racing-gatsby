import * as React from "react";
import { graphql, Link, navigate } from "gatsby";
import moment from "moment";
import Select from "react-select";
import Layout from "../components/layout";
import Meta from "../components/meta";
import RaceChip from "../components/raceChip";
import ResultsChip from "../components/resultsChip";
import * as styles from "./schedule.module.scss";

const pathify = (string) =>
  string.replace(/[:-]/g, "").replace(/\s+/g, "-").toLowerCase();

const ScheduleTemplate = (props) => {
  const seasonOptions = React.useMemo(
    () =>
      props.data.seasons.nodes.map((node) => ({
        label: node.seasonName,
        value: node.seasonId,
      })),
    [props.data.seasons]
  );

  const defaultValueIndex = React.useMemo(() => {
    const index = seasonOptions.findIndex(
      ({ label }) => props.location.hash === `#${pathify(label)}`
    );
    return index >= 0
      ? index
      : seasonOptions.findIndex(
          ({ value }) => value === props.data.series.currSeasonId
        );
  }, [seasonOptions, props.data.series.currSeasonId, props.location.hash]);

  const [seasonId, setSeasonId] = React.useState(
    seasonOptions[defaultValueIndex].value
  );

  const season = React.useMemo(
    () =>
      props.data.seasons.nodes.find((season) => season.seasonId === seasonId),
    [seasonId, props.data.seasons.nodes]
  );

  return (
    <Layout {...props}>
      <main className="container">
        <div className="columns">
          <div className="column col-8 col-xl-10 col-lg-11 col-sm-12 col-mx-auto content">
            <hgroup className="page-header columns">
              <div className="column col-6">
                <h2 className="page-title">Schedule</h2>
                <h3 className="page-subtitle">
                  <Select
                    className={styles.selectContainer}
                    styles={{
                      menu: (baseStyles, state) => ({
                        ...baseStyles,
                        whiteSpace: "nowrap",
                        width: "auto !important",
                      }),
                    }}
                    onChange={(selected) => {
                      setSeasonId(selected.value);
                      navigate(`#${pathify(selected.label)}`);
                    }}
                    options={seasonOptions}
                    defaultValue={seasonOptions[defaultValueIndex]}
                  />
                </h3>
              </div>
            </hgroup>

            <div className={styles.container}>
              {season.schedules
                .filter((event) => event.offWeek === "N")
                .map((event, index) => {
                  return event.chase === "Y" ? (
                    <div key={`schedule-${index}`} className={styles.chase}>
                      {event.eventName || "Chase for the Championship"}
                    </div>
                  ) : event.race ? (
                    <Link
                      key={`schedule-${index}`}
                      to={`/${props.uri.split("/")[1]}/results/${
                        event.race.raceId
                      }`}
                      className={styles.details}
                    >
                      <RaceChip
                        {...event}
                        trackAsset={
                          event.trackConfig &&
                          props.data.assets.nodes.find(
                            ({ trackId }) =>
                              trackId === event.trackConfig.trackConfigIracingId
                          )
                        }
                      />
                      <ResultsChip
                        counts={event.pointsCount === "Y"}
                        results={event.race.participants
                          .sort(
                            (a, b) =>
                              (a.finishPos ?? 999) - (b.finishPos ?? 999)
                          )
                          .slice(0, 3)}
                        link={false}
                        hideSm={true}
                      />
                    </Link>
                  ) : (
                    <div key={`schedule-${index}`} className={styles.details}>
                      <RaceChip
                        {...event}
                        trackAsset={
                          event.trackConfig &&
                          props.data.assets.nodes.find(
                            ({ trackId }) =>
                              trackId === event.trackConfig.trackConfigIracingId
                          )
                        }
                      />
                      <div className={`${styles.info} hide-sm`}>
                        <div>
                          {event.plannedTime ? (
                            <span>
                              <b>{`${moment
                                .duration(event.plannedTime)
                                .asMinutes()}`}</b>{" "}
                              minutes
                            </span>
                          ) : (
                            event.plannedLaps && (
                              <span>
                                <b>{`${event.plannedLaps}`}</b>
                                {`\u00A0laps`}
                              </span>
                            )
                          )}
                          {event.trackConfig?.trackConfigName?.toLowerCase() !==
                            "oval" && <span>{event.trackConfigName}</span>}
                          {event.pointsCount === "N" && <span>non-points</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export const query = graphql`
  query ScheduleQuery($seriesId: Int) {
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
    series: mysqlSeries(series_id: { eq: $seriesId }) {
      currSeasonId: curr_season_id
    }
    seasons: allMysqlSeason(
      filter: { series_id: { eq: $seriesId } }
      sort: { schedules: { race_date: DESC } }
    ) {
      nodes {
        seasonId: season_id
        seasonName: season_name
        schedules {
          scheduleId: schedule_id
          eventName: event_name
          pointsCount: points_count
          chase
          offWeek: off_week
          raceDate: race_date
          plannedLaps: planned_laps
          trackConfig {
            trackName: track_name
            trackConfigIracingId: track_config_iracing_id
            trackConfigName: track_config_name
          }
          race {
            raceId: race_id
            participants {
              driverId: driver_id
              driver {
                driverName: driver_name
                member {
                  driverNickName: nick_name
                  carNumber: car_number
                  carNumberArt: driverNumberArt {
                    gatsbyImageData
                    file {
                      url
                    }
                  }
                }
              }
              driverNumber: driver_number
              racePoints: race_points
              finishPos: finish_pos
              bonuses {
                bonusPoints: bonus_points
              }
              penalties {
                penaltyPoints: penalty_points
              }
              stages {
                stagePoints: stage_points
              }
            }
          }
        }
      }
    }
  }
`;

export default ScheduleTemplate;

export const Head = (props) => <Meta {...props} />;

import * as React from "react";
import { graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import moment from "moment";
import Layout from "../components/layout";
import useSiteMetadata from "../hooks/use-site-metadata";
import { Carousel, Slide } from "../components/carousel";
import { renderDriverChip as renderChipHelper } from "../components/driverChip";
import Table from "../components/table";
import Video from "../components/video";
import * as styles from "./results.module.scss";
import logo from "../images/logo.png";

const ResultsTemplate = (props) => {
  const { race, carLogos } = props.data;

  const renderDriverChip = (p, c) =>
    renderChipHelper({ ...p, location: props.location }, c);

  // Get track logo
  const trackAsset = React.useMemo(
    () =>
      props.data.assets.nodes.find(
        ({ trackId }) => trackId === race.schedule.trackConfig?.trackConfigId
      ) ?? {},
    [props.data.assets, race.schedule.trackConfig]
  );

  // Calculate race superlatives
  let bestAvgPos,
    bestPasses,
    bestRestarts,
    bestClosingPasses,
    bestFastLap,
    bestQualityPasses,
    bestAvgFastLap,
    bestNumFastLap,
    hardCharger;

  race.participants.forEach((p) => {
    if (
      p.loopstat?.avgPos > -1 &&
      p.loopstat?.avgPos < (bestAvgPos?.loopstat?.avgPos ?? 999999)
    )
      bestAvgPos = p;
    if (
      p.fastestLapTime > 0 &&
      p.fastestLapTime < (bestFastLap?.fastestLapTime ?? 999999)
    )
      bestFastLap = p;
    if (
      p.loopstat?.fastestRestart > 0 &&
      p.loopstat?.fastestRestart <
        (bestRestarts?.loopstat?.fastestRestart ?? 999999)
    )
      bestRestarts = p;
    if (
      p.loopstat?.avgFastLap > 0 &&
      p.loopstat?.avgFastLap < (bestAvgFastLap?.loopstat?.avgFastLap ?? 999999)
    )
      bestAvgFastLap = p;
    if (
      p.loopstat?.numFastLap > 0 &&
      p.loopstat?.numFastLap > (bestNumFastLap?.loopstat?.numFastLap ?? 0)
    )
      bestNumFastLap = p;
    if (
      p.loopstat?.passes > 0 &&
      p.loopstat?.passes > (bestPasses?.loopstat?.passes ?? 0)
    )
      bestPasses = p;
    if (
      p.loopstat?.qualityPasses > 0 &&
      p.loopstat?.qualityPasses >
        (bestQualityPasses?.loopstat?.qualityPasses ?? 0)
    )
      bestQualityPasses = p;
    if (
      p.loopstat?.closingPasses > 0 &&
      p.loopstat?.closingPasses >
        (bestClosingPasses?.loopstat?.closingPasses ?? 0)
    )
      bestClosingPasses = p;
    if (
      p.qualifyTime > 0 &&
      Math.min(p.qualifyPos, 11) - p.finishPos >
        Math.min(hardCharger?.qualifyPos ?? 0, 11) -
          (hardCharger?.finishPos ?? 0)
    )
      hardCharger = p;
  });

  const columns = React.useMemo(
    () => [
      {
        header: null,
        id: "finishPos",
        accessorFn: (row) => (row.provisional === "Y" ? 99 : row.finishPos),
        className: "cell-position",
        cell: ({ getValue }) => {
          const value = getValue();
          return value === 99 ? null : value;
        },
      },
      {
        header: null,
        id: "startPos",
        accessorKey: "qualifyPos",
        className: "cell-change",
        cell: ({ row, getValue }) => {
          const value = getValue();
          const change = value - row.original.finishPos;
          const className =
            change > 0 ? "positive" : change < 0 ? "negative" : "neutral";
          return hardCharger?.driverId === row.original.driverId ? (
            <b className={className}>{Math.abs(change) || "\u00a0"}</b>
          ) : (
            <span className={className}>{Math.abs(change) || "\u00a0"}</span>
          );
        },
      },
      {
        header: "Driver",
        accessorKey: "driverName",
        className: "cell-driver",
        cell: ({ row }) => renderDriverChip(row.original),
      },
      {
        header: null,
        id: "make",
        accessorFn: (row) => row.car?.carId,
        className: "cell-carLogo",
        cell: ({ getValue, row }) => {
          const value = getValue();
          const img = carLogos.edges.find(
            ({ node }) => Math.floor(node.name) === value
          );
          return img ? (
            <img src={img.node.publicURL} alt={row.original.car?.carName} />
          ) : null;
        },
      },
      {
        id: "totalPoints",
        header: "Points",
        accessorFn: (row, index) => {
          const bonusPoints = row.bonuses.reduce(
            (points, { bonusPoints }) => (points += bonusPoints),
            0
          );
          const penaltyPoints = row.penalties.reduce(
            (points, { penaltyPoints }) => (points += penaltyPoints),
            0
          );
          const stagePoints = row.stages.reduce(
            (points, { stagePoints }) => (points += stagePoints),
            0
          );
          return row.racePoints + stagePoints + bonusPoints - penaltyPoints;
        },
        className: "cell-totalPoints",
        cell: ({ getValue, row }) => {
          const bonusPoints = row.original.bonuses.reduce(
            (points, { bonusPoints }) => (points += bonusPoints),
            0
          );
          const penaltyPoints = row.original.penalties.reduce(
            (points, { penaltyPoints }) => (points += penaltyPoints),
            0
          );
          const stagePoints = row.original.stages.reduce(
            (points, { stagePoints }) => (points += stagePoints),
            0
          );
          return (
            <div>
              <span>{getValue()}</span>
              <span className="adjustments">
                {bonusPoints + stagePoints > 0 && (
                  <span className="positive">{`+${
                    bonusPoints + stagePoints
                  }`}</span>
                )}
                {penaltyPoints > 0 && (
                  <span className="negative">{`-${penaltyPoints}`}</span>
                )}
              </span>
            </div>
          );
        },
      },
      {
        header: "Rating",
        accessorFn: (row) => row.loopstat?.rating,
        className: "hide-sm",
        cell: ({ getValue, table }) => {
          const { rows } = table.getRowModel();
          const value = getValue();
          if (!value) return 0;
          return value ===
            Math.max(
              ...rows.map(({ original }) => original.loopstat?.rating)
            ) ? (
            <b>{value.toFixed(1)}</b>
          ) : (
            value.toFixed(1)
          );
        },
      },
      {
        header: "Time",
        accessorKey: "interval",
        className: "hide-sm",
        cell: ({ getValue, row }) => {
          const value = getValue();
          const { finishPos, lapsCompleted, provisional, status } =
            row.original;
          return value > 0
            ? `+${getTimeFromMilliseconds(value * 10000)}`
            : finishPos === 1
            ? moment
                .utc(
                  moment
                    .duration(race.raceAvgTime * race.raceLaps, "s")
                    .as("milliseconds")
                )
                .format("HH:mm:ss")
            : status.toLowerCase() === "running"
            ? `+${race.raceLaps - lapsCompleted}L`
            : provisional === "Y"
            ? "DNS"
            : "DNF";
        },
      },
      {
        header: "Laps",
        accessorKey: "lapsCompleted",
        className: "hide-sm",
      },
      {
        header: "Led",
        accessorKey: "lapsLed",
        className: "hide-sm",
        cell: ({ getValue, table }) => {
          const { rows } = table.getRowModel();
          const value = getValue();
          return value ===
            Math.max(...rows.map(({ original }) => original.lapsLed)) ? (
            <b className={race.pointsCount === "Y" ? "positive" : ""}>
              {value}
            </b>
          ) : value >= 1 ? (
            <span className={race.pointsCount === "Y" ? "positive" : ""}>
              {value}
            </span>
          ) : (
            value
          );
        },
      },
      {
        header: `Average Position`,
        accessorFn: (row) => row.loopstat?.avgPos,
        className: "hide-sm text-wrap",
        cell: ({ getValue }) => {
          const value = getValue();
          if (!value) return 0;
          return value === bestAvgPos?.loopstat?.avgPos ? (
            <b>{(value + 1).toFixed(1)}</b>
          ) : value !== -1 ? (
            (value + 1).toFixed(1)
          ) : (
            "-"
          );
        },
      },
      {
        header: "Total Passes",
        accessorFn: (row) => row.loopstat?.passes,
        className: "hide-sm text-wrap",
        cell: ({ getValue }) => {
          const value = getValue();
          return value !== 0 && value === bestPasses?.loopstat?.passes ? (
            <b>{value}</b>
          ) : (
            value ?? 0
          );
        },
      },
      {
        header: "Quality Passes",
        accessorFn: (row) => row.loopstat?.qualityPasses,
        className: "hide-sm text-wrap",
        cell: ({ getValue }) => {
          const value = getValue();
          return value !== 0 &&
            value === bestQualityPasses?.loopstat?.qualityPasses ? (
            <b>{value}</b>
          ) : (
            value ?? 0
          );
        },
      },
      {
        header: "Closing Passes",
        accessorFn: (row) => row.loopstat?.closingPasses,
        className: "hide-sm text-wrap",
        cell: ({ getValue }) => {
          const value = getValue();
          return value !== 0 &&
            value === bestClosingPasses?.loopstat?.closingPasses ? (
            <b>{value}</b>
          ) : (
            value ?? 0
          );
        },
      },
      {
        header: "Inc",
        accessorKey: "incidents",
        className: "hide-sm",
        cell: ({ getValue, table, row }) => {
          const { rows } = table.getRowModel();
          const value = getValue();
          const { numLaps } = row.original;
          return value ===
            Math.max(...rows.map(({ original }) => original.incidents)) ? (
            value >= 8 ? (
              <b className={race.pointsCount === "Y" ? "negative" : ""}>
                {value}
              </b>
            ) : value === 0 &&
              numLaps === race.raceLaps &&
              race.pointsCount === "Y" ? (
              <b className="positive">{value}</b>
            ) : (
              <b>{value}</b>
            )
          ) : value >= 8 ? (
            <span className={race.pointsCount === "Y" ? "negative" : ""}>
              {value}
            </span>
          ) : value === 0 &&
            numLaps === race.raceLaps &&
            race.pointsCount === "Y" ? (
            <span className="positive">{value}</span>
          ) : (
            value
          );
        },
      },
      {
        header: "Fast Laps",
        accessorFn: (row) => row.loopstat?.numFastLap,
        className: "hide-sm text-wrap",
        cell: ({ getValue }) => {
          const value = getValue();
          return value !== 0 &&
            value === bestNumFastLap?.loopstat?.numFastLap ? (
            <b>{value}</b>
          ) : (
            value ?? 0
          );
        },
      },
      {
        header: "Fast Lap",
        accessorKey: "fastestLapTime",
        className: "hide-sm text-wrap",
        cell: ({ getValue, table }) => {
          const { rows } = table.getRowModel();
          const value = getValue();
          return value ===
            rows.reduce(
              (a, { original }) =>
                original.fastestLapTime > 0
                  ? Math.min(original.fastestLapTime, a)
                  : a,
              9999999999999
            ) ? (
            <b>{value}</b>
          ) : value > 0 ? (
            value
          ) : (
            "-"
          );
        },
      },
      {
        header: "Qual Lap",
        accessorKey: "qualifyTime",
        className: "hide-sm text-wrap",
        cell: ({ getValue, table }) => {
          const { rows } = table.getRowModel();
          const value = getValue();
          return moment(value, ["m:s.S", "s.S"]).isSame(
            moment.min(
              ...rows
                .filter(({ original }) => original.qualifyTime > 0)
                .map(({ original }) =>
                  moment(original.qualifyTime, ["m:s.S", "s.S"])
                )
            )
          ) ? (
            <b>{getTimeFromMilliseconds(value * 10000)}</b>
          ) : value > 0 ? (
            getTimeFromMilliseconds(value * 10000)
          ) : (
            "-"
          );
        },
      },
    ],
    [
      race,
      hardCharger,
      bestAvgPos,
      bestClosingPasses,
      bestNumFastLap,
      bestPasses,
      bestQualityPasses,
      carLogos,
    ]
  );

  return (
    <Layout {...props}>
      {race.eventMedia &&
        (race.eventMedia.length > 1 ? (
          <Carousel options={{ type: "carousel", showNav: true }}>
            {race.eventMedia.map((image) => {
              return (
                <Slide>
                  <GatsbyImage
                    alt="screenshot"
                    className={styles.media}
                    image={getImage(image)}
                  />
                </Slide>
              );
            })}
          </Carousel>
        ) : (
          race.eventMedia
            .slice(0, 1)
            .map((image) => (
              <GatsbyImage
                alt="screenshot"
                className={styles.media}
                image={getImage(image)}
              />
            ))
        ))}

      <main className="container">
        <div className="columns">
          <div className="column col-8 col-xl-10 col-lg-12 col-mx-auto content">
            <hgroup className={`columns page-header ${styles.header}`}>
              <div className="column col-8 col-sm-12">
                <h4 className="page-title">Results</h4>
                <h5 className="page-subtitle">
                  <span>
                    {moment
                      .parseZone(race.schedule.raceDate)
                      .format("DD MMM YYYY")}
                  </span>
                  <span>{race.schedule.trackConfig?.trackName}</span>
                </h5>
              </div>
              {race.schedule.trackConfig?.trackIracingId && (
                <div className="column col-4 text-right hide-sm">
                  <img
                    className={styles.logo}
                    src={`https://images-static.iracing.com/img/logos/tracks/${race.schedule.trackConfig.trackIracingId}__light.png`}
                    alt="track logo"
                  />
                </div>
              )}
            </hgroup>

            <Table
              columns={columns}
              data={race.participants}
              disableSortBy={true}
              scrolling={true}
              initialState={{
                sorting: [{ id: "finishPos", desc: false }],
                hiddenColumns: columns
                  .map(({ id, accessor }) => id || accessor)
                  .filter(
                    (column) =>
                      race.schedule.pointsCount !== true &&
                      ["racePoints", "rating"].includes(column)
                  ),
              }}
            />

            <div className="columns">
              <div className="column col-6 col-sm-12 col-mr-auto">
                <div className={styles.stats}>
                  <h3>Race Statistics</h3>
                  <dl>
                    <dt>Weather ({race.weatherType})</dt>
                    <dd>
                      {race.weatherSkies}
                      <br />
                      Temperature: {race.weatherTemp}°{race.weatherTempUnit}
                      <br />
                      Humidity: {race.weatherRh}%<br />
                      Fog: {race.weatherFog}%<br />
                      Wind: {race.weatherWindDir} @ {race.weatherWind}
                      {race.weatherWindUnit?.toLowerCase()}
                    </dd>
                    <dt>Cautions</dt>
                    <dd>
                      {getCautionsText(race.raceCautions, race.raceCautionLaps)}
                    </dd>
                    <dt>Lead Changes</dt>
                    <dd>
                      {getLeadersText(
                        race.raceLeadChanges,
                        race.participants.reduce(
                          (a, { lapsLed }) => (lapsLed > 0 ? ++a : a),
                          0
                        )
                      )}
                    </dd>
                    {bestAvgPos && (
                      <>
                        <dt>Best Average Position</dt>
                        <dd>
                          {renderDriverChip(
                            bestAvgPos,
                            `(${(bestAvgPos.loopstat?.avgPos + 1).toFixed(1)})`
                          )}
                        </dd>
                      </>
                    )}
                    {hardCharger && (
                      <>
                        <dt>Hard Charger</dt>
                        <dd>
                          {renderDriverChip(
                            hardCharger,
                            `(${
                              Math.min(hardCharger.qualifyPos, 11) -
                              hardCharger.finishPos
                            })`
                          )}
                        </dd>
                      </>
                    )}
                    {bestPasses && bestPasses.passes > 0 && (
                      <>
                        <dt>Most Passes</dt>
                        <dd>
                          {renderDriverChip(
                            bestPasses,
                            `(${bestPasses.loopstat?.passes})`
                          )}
                        </dd>
                      </>
                    )}
                    {bestQualityPasses &&
                      bestQualityPasses.loopstat?.qualityPasses > 0 && (
                        <>
                          <dt>Most Quality Passes</dt>
                          <dd>
                            {renderDriverChip(
                              bestQualityPasses,
                              `(${bestQualityPasses.loopstat?.qualityPasses})`
                            )}
                          </dd>
                        </>
                      )}
                    {bestClosingPasses &&
                      bestClosingPasses.loopstat?.closingPasses > 0 && (
                        <>
                          <dt>Most Closing Passes</dt>
                          <dd>
                            {renderDriverChip(
                              bestClosingPasses,
                              `(${bestClosingPasses.loopstat?.closingPasses})`
                            )}
                          </dd>
                        </>
                      )}
                    {bestFastLap && (
                      <>
                        <dt>Fastest Lap</dt>
                        <dd>
                          {renderDriverChip(
                            bestFastLap,
                            `(${bestFastLap.fastestLapTime})`
                          )}
                        </dd>
                      </>
                    )}
                    {bestAvgFastLap && (
                      <>
                        <dt>Fastest 3-lap Average</dt>
                        <dd>
                          {renderDriverChip(
                            bestAvgFastLap,
                            `(${getTimeFromMilliseconds(
                              bestAvgFastLap.loopstat?.avgFastLap
                            )})`
                          )}
                        </dd>
                      </>
                    )}
                    {race.raceCautions > 0 && bestRestarts && (
                      <>
                        <dt>Fastest Restarts</dt>
                        <dd>
                          {renderDriverChip(
                            bestRestarts,
                            `(${getTimeFromMilliseconds(
                              bestRestarts.loopstat?.fastestRestart
                            )})`
                          )}
                        </dd>
                      </>
                    )}
                    {bestNumFastLap && (
                      <>
                        <dt>Most Fast Laps</dt>
                        <dd>
                          {renderDriverChip(
                            bestNumFastLap,
                            `(${bestNumFastLap.loopstat?.numFastLap})`
                          )}
                        </dd>
                      </>
                    )}
                  </dl>
                </div>
              </div>
              <div className="column col-6 col-sm-12 col-ml-auto">
                {race.eventBroadcast && (
                  <Video
                    href={race.eventBroadcast}
                    className={styles.broadcast}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

const getTimeFromMilliseconds = (time) => {
  let hours = Math.floor(time / (3600 * 10000));
  time = time - hours * 3600 * 10000;
  let min = Math.floor(time / (60 * 10000));
  time = time - min * 60 * 10000;
  let secs = Math.floor(time / 10000);
  time = time - secs * 10000;
  const tenths = Math.floor(time / 1000);
  time = time - tenths * 1000;
  const hun = Math.floor(time / 100);
  time = time - hun * 100;
  const thous = Math.floor(time / 10);
  if (hours) hours += ":";
  else hours = "";
  if (hours && min < 10) min = "0" + min;
  if (min && secs < 10) secs = "0" + secs;
  return `${hours}${min > 0 ? `${min}:` : ``}${secs}.${tenths}${hun}${thous}`;
};

const getCautionsText = (raceCautions, raceCautionLaps) => {
  return raceCautions > 0
    ? `${pluralize(raceCautions, "caution")} for ${pluralize(
        raceCautionLaps,
        "lap"
      )}`
    : "none";
};

const getLeadersText = (raceLeadChanges, raceLeaders) => {
  return raceLeadChanges > 0
    ? `${pluralize(raceLeadChanges, "lead change")} among ${pluralize(
        raceLeaders,
        "driver"
      )}`
    : "none";
};

const pluralize = (count, noun, suffix = "s") => {
  return `${count} ${noun}${count !== 1 ? suffix : ""}`;
};

export const query = graphql`
  query RaceQuery($raceId: Int) {
    race: mysqlRace(race_id: { eq: $raceId }) {
      raceId: race_id
      eventBroadcast
      eventLogo {
        gatsbyImageData
      }
      eventMedia {
        gatsbyImageData(layout: FULL_WIDTH, placeholder: BLURRED)
      }
      weatherFog: weather_fog
      weatherRh: weather_rh
      weatherSkies: weather_skies
      weatherTemp: weather_temp
      weatherTempUnit: weather_tempunit
      weatherType: weather_type
      weatherWind: weather_wind
      weatherWindDir: weather_winddir
      weatherWindUnit: weather_windunit
      raceAvgTime: race_avg_time
      raceCautions: race_cautions
      raceCautionLaps: race_caution_laps
      raceLaps: race_laps
      raceLeadChanges: race_lead_changes
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
        car {
          carId: car_iracing_id
          carName: car_name
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
        provisional
        status
        loopstat {
          avgPos: avg_pos
          arp
          avgFastLap: avg_fast_lap
          numFastLap: num_fast_lap
          fastestRestart: fastest_restart
          passes
          qualityPasses: quality_passes
          closingPasses: closing_passes
          rating
        }
        bonuses {
          bonusDesc: bonus_descr
          bonusPoints: bonus_points
        }
        penalties {
          penaltyDesc: penalty_descr
          penaltyPoints: penalty_points
        }
        stages {
          stagePoints: stage_points
        }
      }
      schedule {
        eventName: event_name
        pointsCount: points_count
        raceDate: race_date
        raceTime: race_time
        trackConfig {
          trackConfigId: track_config_iracing_id
          trackConfigName: track_config_name
          trackName: track_name
          trackTypeId: track_type_id
          trackType: type_name
          trackIracingId: track_iracing_id
        }
      }
    }
    carLogos: allFile(filter: { relativePath: { glob: "cars/*.svg" } }) {
      edges {
        node {
          name
          publicURL
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
  }
`;

export default ResultsTemplate;

export const Head = (props) => {
  const { title, siteUrl } = useSiteMetadata();
  const seriesName = `${
    props.pageContext.seriesId === 6842 ? "Output" : "Reverb"
  } Series`;
  const description = `Results from the ${seriesName} ${
    props.data.race.schedule.eventName
  } at ${props.data.race.schedule.trackConfig.trackName} on ${moment
    .parseZone(props.data.race.schedule.raceDate)
    .format("DD MMM YYYY")}`;
  return (
    <>
      <title>
        {title} | {`${seriesName} Results`} |{" "}
        {props.data.race.schedule.eventName ||
          props.data.race.schedule.trackConfig.trackName}
      </title>
      <meta property="og:image" content={logo} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="Output Racing League" />
      <meta
        property="og:title"
        content={`${seriesName} Results | ${
          props.data.race.schedule.eventName ||
          props.data.race.schedule.trackConfig.trackName
        }`}
      />
      <meta property="og:type" content="website" />
      <meta
        property="og:url"
        content={`${siteUrl}${props.location.pathname}`}
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content={`${seriesName} Results | ${
          props.data.race.schedule.eventName ||
          props.data.race.schedule.trackConfig.trackName
        }`}
      />
      <meta name="twitter:image" content={logo} />
      <meta name="twitter:description" content={description} />
      <meta name="theme-color" content="#000000" />
    </>
  );
};

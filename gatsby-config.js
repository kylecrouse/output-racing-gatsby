const dotenv = require('dotenv').config()

module.exports = {
  siteMetadata: {
    siteUrl: "http://outputracing.com",
    title: "Output Racing League",
  },
  // trailingSlash: 'never',
  plugins: [
    {
      resolve: "gatsby-source-contentful",
      options: {
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
        spaceId: "38idy44jf6uy",
        enableTags: true,
      },
    },
    'gatsby-source-iracing',
    {
      resolve: `gatsby-source-mysql`,
      options: {
        connectionDetails: {
          host: process.env.MYSQL_HOST,
          port: process.env.MYSQL_PORT,
          user: process.env.MYSQL_USERNAME,
          password: process.env.MYSQL_PASSWORD,
          database: process.env.MYSQL_DATABASE
        },
        queries: [
          {
            statement: 'SELECT * FROM LEAGUE WHERE league_id = 1710',
            idFieldName: 'league_id',
            name: 'league'
          },
          {
            statement: 'SELECT * FROM SERIES WHERE league_id = 1710',
            idFieldName: 'series_id',
            name: 'series',
            parentName: 'league',
            foreignKey: 'league_id',
            cardinality: 'OneToMany'
          },
          {
            statement: 'SELECT sea.* FROM SEASON AS sea JOIN SERIES AS ser ON ser.series_id = sea.series_id WHERE ser.league_id = 1710',
            idFieldName: 'season_id',
            name: 'season',
            parentName: 'series',
            foreignKey: 'series_id',
            cardinality: 'OneToMany'
          },
          {
            statement: 'SELECT sch.* FROM SCHEDULE AS sch JOIN SEASON AS sea ON sea.season_id = sch.season_id JOIN SERIES AS ser ON ser.series_id = sea.series_id WHERE ser.league_id = 1710',
            idFieldName: 'schedule_id',
            name: 'schedule',
            parentName: 'season',
            foreignKey: 'season_id',
            cardinality: 'OneToMany'
          },
          {
            statement: 'SELECT c.* FROM CHASE as c JOIN SCHEDULE AS sch ON c.schedule_id = sch.schedule_id JOIN SEASON as sea ON sea.season_id = sch.season_id JOIN SERIES AS ser ON ser.series_id = sea.series_id WHERE ser.league_id = 1710',
            idFieldName: 'chase_id',
            name: 'chase',
            parentName: 'schedule',
            foreignKey: 'schedule_id',
            cardinality: 'OneToOne'
          },
          {
            statement: 'SELECT tc.*, t.*, tt.* FROM TRACK_CONFIG AS tc JOIN TRACK AS t ON t.track_id = tc.track_id JOIN TRACK_TYPE AS tt ON tt.track_type_id = tc.track_type_id',
            idFieldName: 'track_config_id',
            name: 'config',
          },
          {
            statement: 'SELECT r.* FROM RACE AS r JOIN SCHEDULE AS sch ON sch.schedule_id = r.schedule_id JOIN SEASON as sea ON sea.season_id = sch.season_id JOIN SERIES AS ser ON ser.series_id = sea.series_id WHERE ser.league_id = 1710',
            idFieldName: 'race_id',
            name: 'race',
            parentName: 'schedule',
            foreignKey: 'schedule_id',
            cardinality: 'OneToOne'
          },
          {
            statement: 'SELECT rp.* FROM RACE_PARTICIPANT AS rp JOIN RACE AS r ON r.race_id = rp.race_id JOIN SCHEDULE AS sch ON sch.schedule_id = r.schedule_id JOIN SEASON as sea ON sea.season_id = sch.season_id JOIN SERIES AS ser ON ser.series_id = sea.series_id WHERE ser.league_id = 1710',
            idFieldName: 'race_participant_id',
            name: 'participant',
            parentName: 'race',
            foreignKey: 'race_id',
            cardinality: 'OneToMany'
          },
          {
            statement: 'SELECT s.* FROM RACE_LOOP_STATS AS s JOIN RACE_PARTICIPANT AS rp ON rp.race_participant_id = s.race_participant_id JOIN RACE AS r ON r.race_id = rp.race_id JOIN SCHEDULE AS sch ON sch.schedule_id = r.schedule_id JOIN SEASON as sea ON sea.season_id = sch.season_id JOIN SERIES AS ser ON ser.series_id = sea.series_id WHERE ser.league_id = 1710',
            idFieldName: 'race_participant_id',
            name: 'loopstats',
            parentName: 'participant',
            foreignKey: 'race_participant_id',
            cardinality: 'OneToOne'
          },
          {
            statement: 'SELECT d.* FROM DRIVER AS d JOIN RACE_PARTICIPANT AS rp ON rp.driver_id = d.driver_id JOIN RACE AS r ON r.race_id = rp.race_id JOIN SCHEDULE AS sch ON sch.schedule_id = r.schedule_id JOIN SEASON as sea ON sea.season_id = sch.season_id JOIN SERIES AS ser ON ser.series_id = sea.series_id WHERE ser.league_id = 1710',
            idFieldName: 'driver_id',
            name: 'driver',
          },
          {
            statement: 'SELECT * FROM CAR',
            idFieldName: 'car_id',
            name: 'car',
          },
          {
            statement: 'SELECT b.* FROM RACE_BONUS AS b JOIN RACE_PARTICIPANT AS rp ON rp.race_participant_id = b.race_participant_id JOIN RACE AS r ON r.race_id = rp.race_id JOIN SCHEDULE AS sch ON sch.schedule_id = r.schedule_id JOIN SEASON as sea ON sea.season_id = sch.season_id JOIN SERIES AS ser ON ser.series_id = sea.series_id WHERE ser.league_id = 1710',
            idFieldName: 'race_bonus_id',
            name: 'bonus',
          },
          {
            statement: 'SELECT p.* FROM RACE_PENALTY AS p JOIN RACE_PARTICIPANT AS rp ON rp.race_participant_id = p.race_participant_id JOIN RACE AS r ON r.race_id = rp.race_id JOIN SCHEDULE AS sch ON sch.schedule_id = r.schedule_id JOIN SEASON as sea ON sea.season_id = sch.season_id JOIN SERIES AS ser ON ser.series_id = sea.series_id WHERE ser.league_id = 1710',
            idFieldName: 'race_penalty_id',
            name: 'penalty',
          },
        ]
      }
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
    },
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    'gatsby-plugin-sass',
    {
      resolve: `gatsby-plugin-s3`,
      options: {
        bucketName: "output-racing-gatsby",
        region: 'us-west-2',
        acl: null
      },
    },
    "gatsby-transformer-sharp",
  ],
};

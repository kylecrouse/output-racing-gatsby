const axios = require('axios')
const { default: createAuthRefreshInterceptor } = require('axios-auth-refresh')
const CryptoJS = require('crypto-js')

/**
 * Mask a secret using SHA256(secret + normalized_id) → base64
 * Per iRacing OAuth docs:
 * - Password is masked with: SHA256(password + username.toLowerCase())
 * - Client secret is masked with: SHA256(client_secret + client_id.toLowerCase())
 */
const mask = (secret, id) => {
  const hash = CryptoJS.SHA256(secret + id.toLowerCase())
  return CryptoJS.enc.Base64.stringify(hash)
}

class Client {

  constructor(username, password, clientId, clientSecret) {
    this._username = username
    this._password = password
    this._clientId = clientId
    this._clientSecret = clientSecret

    this._accessToken = null
    this._refreshToken = null
    this._tokenExpiry = null

    this._instance = axios.create({ baseURL: 'https://members-ng.iracing.com' })

    // Add Authorization header to all API requests
    this._instance.interceptors.request.use(config => {
      if (this._accessToken) {
        config.headers.Authorization = `Bearer ${this._accessToken}`
      }
      return config
    })

    // Set up auth refresh interceptor - tries refresh token first, falls back to full re-auth
    createAuthRefreshInterceptor(
      this._instance,
      (failedRequest) => this._handleAuthFailure()
    )
  }

  _authenticate() {
    const maskedPassword = mask(this._password, this._username)
    const maskedSecret = mask(this._clientSecret, this._clientId)

    return axios.post(
      'https://oauth.iracing.com/oauth2/token',
      new URLSearchParams({
        grant_type: 'password_limited',
        client_id: this._clientId,
        client_secret: maskedSecret,
        username: this._username,
        password: maskedPassword,
        scope: 'iracing.auth'
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )
    .then(({ data }) => {
      this._accessToken = data.access_token
      this._refreshToken = data.refresh_token
      this._tokenExpiry = Date.now() + (data.expires_in * 1000)
    })
  }

  _refreshAccessToken() {
    return axios.post(
      'https://oauth.iracing.com/oauth2/token',
      new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: this._clientId,
        refresh_token: this._refreshToken
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )
    .then(({ data }) => {
      this._accessToken = data.access_token
      this._refreshToken = data.refresh_token
      this._tokenExpiry = Date.now() + (data.expires_in * 1000)
    })
  }

  _handleAuthFailure() {
    // If we have a refresh token, try using it first
    if (this._refreshToken) {
      return this._refreshAccessToken()
        .catch(() => {
          // Refresh failed, do full re-authentication
          return this._authenticate()
        })
    }
    // No refresh token, do full authentication
    return this._authenticate()
  }

  _get(url) {
    return this._instance(url)
      .then(({ data: { link }}) => {
        // Use plain axios for S3 links - they have their own auth via signed URL params
        return axios.get(link)
      })
      .then(({ data }) => data)
      .catch(err => { console.dir(err) })
  }

  _getChunks(url) {
    return this._get(url)
      .then(
        ({ data }) => Promise.all(
          data.chunk_info.chunk_file_names.map(
            // Use plain axios for S3 chunk downloads - they have their own auth via signed URL params
            file => axios.get(`${data.chunk_info.base_download_url}${file}`)
            )
          )
        )
      .then(chunks => chunks.flat())
  }

  async getCars(ids = null) {
    const [cars, assets] = await Promise.all([
      this._get('/data/car/get'),
      this._get('/data/car/assets')
    ])

    return ids
      ? ( !Array.isArray(ids) && (ids = [ids]),
          cars.reduce(
            (a, car) => (!ids || (ids.includes(car.car_id)))
              ? [...a, { ...car, ...assets[car.car_id] }]
              : a,
            []
          )
        )
      : cars
  }

  getLapChart(subsessionid) {
    return this._getChunks(`/data/results/lap_chart_data?subsessionid=${subsessionid}&simsesnum=0`)
  }

  getLeague(league_id, include_licenses = false) {
    return this._get(`/data/league/get?league_id=${league_id}&include_licenses=${include_licenses}`)
  }

  getSessionEvents(subsessionid) {
    return this._getChunks(`/data/results/event_log?subsessionid=${subsessionid}&simsesnum=0`)
  }

  async getTracks(ids = null) {
    const [tracks, assets] = await Promise.all([
      this._get('/data/track/get'),
      this.getTrackAssets()
    ])

    return ids
      ? ( !Array.isArray(ids) && (ids = [ids]),
          tracks.reduce(
            (a, track) => (!ids || (ids.includes(track.track_id)))
              ? [...a, { ...track, ...assets[track.track_id] }]
              : a,
            []
          )
        )
      : tracks
  }

  getTrackAssets() {
    return this._get('/data/track/assets')
  }

}

exports.Client = Client

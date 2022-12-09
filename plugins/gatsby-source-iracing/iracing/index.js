const axios = require('axios')
const { CookieJar } = require('tough-cookie')
const { HttpCookieAgent, HttpsCookieAgent } = require('http-cookie-agent/http')
const { default: createAuthRefreshInterceptor } = require('axios-auth-refresh')
const CookieFileStore = require("tough-cookie-file-store").FileCookieStore
const CryptoJS = require('crypto-js')

class Client {
    
  constructor(email, password) {
    this._instance = axios.create({ baseURL: 'https://members-ng.iracing.com' })
    
    const jar = new CookieJar(new CookieFileStore("./.cookies "))
    this._instance.defaults.httpAgent = new HttpCookieAgent({ cookies: { jar } })
    this._instance.defaults.httpsAgent = new HttpsCookieAgent({ cookies: { jar } })
    
    let hash = CryptoJS.SHA256(password + email.toLowerCase())
    let hashInBase64 = CryptoJS.enc.Base64.stringify(hash)
    
    createAuthRefreshInterceptor(
      this._instance, 
      (failedRequest) => this._authenticate(email, hashInBase64)
    )
	}

  _authenticate(email, password) {
    return this._instance({
      method: 'post',
      url: '/auth', 
      data: serialize({ email, password }).toString()
    })
  }
  
  _get(url) {
    return this._instance(url)
      .then(({ data: { link }}) => this._instance(link))
      .then(({ data }) => data)
      .catch(err => { console.dir(err) })
  }
  
  _getChunks(url) {
    return this._get(url)
      .then(
        ({ data }) => Promise.all(
          data.chunk_info.chunk_file_names.map(
            file => this._instance(`${data.chunk_info.base_download_url}${file}`)
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
      
  getLeague(league_id) {
    return this._get(`/data/league/get?league_id=${league_id}`)
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

const serialize = (data) => {
  const params = new URLSearchParams()
  Object.entries(data).forEach(([key, value]) => {
    params.append(key, value)
  })
  return params
}

exports.Client = Client
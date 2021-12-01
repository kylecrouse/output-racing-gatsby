const axios = require('axios')
const { wrapper } = require('axios-cookiejar-support')
const { CookieJar } =  require('tough-cookie')

const jar = new CookieJar()
const client = wrapper(axios.create({ jar }))

const baseURL = 'https://members.iracing.com'

const authenticate = async (username, password) => {
	try {
		// console.log(`Authenticating as ${username}...`)
		
		const date = new Date()
		const utcoffset = Math.round(Math.abs(date.getTimezoneOffset()))

		const url = `${baseURL}/membersite/Login`
		const params = serialize({ username, password, utcoffset, todaysdate: '' })

		const response = await client.post(url, params.toString())

		// TODO: Check to make sure this wasn't a failure/redirect
		// console.log('Authenticated!')
		// console.log(response)
		return

	} catch(error) {
		console.error(error)
	} 
	
}

const request = async (url, params, options) => {	
	// console.log('Checking authentication...')
	
	// Look for authenticated session
	const cookies = await jar.getCookies(baseURL)
	if (cookies.length <= 0)
		await authenticate(options.username, options.password)
		
	params = serialize(params)
		
	// console.log('Requesting data from iRacing...')
	return client.post(url, params.toString())
}

const serialize = (data) => {
	const params = new URLSearchParams()
	Object.entries(data).forEach(([key, value]) => {
		params.append(key, value)
	})
	return params
}

exports.getLaps = async (subsessionid, options) => {
	// TODO: Constants
	const url = `${baseURL}/membersite/member/GetLapChart`
	// TODO: Allow class and session as params
	const payload = { subsessionid, carclassid: -1, simsesnum: 0 }
	
	const { data } = await request(url, payload, options)
	return data	
}

exports.getSessionEvents = async (subsessionid, options) => {
	// TODO: Constants
	const url = `${baseURL}/membersite/member/EventResult.do?&subsessionid=${subsessionid}`
	
	const { data } = await client.get(url)
	const match = data.match(/SubsessionEventLogging = (\[.*\]);/)
	
	const events = JSON.parse(match[1])
	
	return events
		.filter(event => event.eventtype === 6)
		.map(event => {
			return {
				type: event.message === 'Caution+ended.'
					? 'green'
					: 'caution',
				lap: event.lap_num
			}
		})
}
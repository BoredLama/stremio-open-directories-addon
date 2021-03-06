const commentJson = require('comment-json')

const path = require('path')
const rootDir = path.dirname(process.execPath)

const fs = require('fs')

const configFile = 'config.json'

const defaultConfig = {

	"// autoLaunch": [["// if this is set to true, the add-on will run on system start-up"]],
	"autoLaunch": false,

	"// responseTimeout": [["// for stremio add-on, in milliseconds, if timeout is reached it will respond with whatever results it already has, 0 = no timeout"]],
	"responseTimeout": 11000,

	"// addonPort": [["// port to use for stremio add-on, default is 7005"]],
	"addonPort": 7005,

	"// googleResults": [["// maximum number of results to parse from Google, default is 25"]],
	"googleResults": 25,

	"// onlyMP4": [["// normally, results are chosen with any video extension, set this to true to get only browser supported results"]],
	"onlyMP4": false,

	"// remote": [["// make add-on available remotely too, through LAN and the Internet"]],
	"remote": false,

	"// subdomain": [["// set the preferred subdomain (if available), only applicable if remote is set to true"]],
	"subdomain": false,

	"page": {

		"// readTimeout": [["// read timeout in milliseconds for http requests to jackett server, 0 = no timeout"]],
		"readTimeout": 10000,

		"// openTimeout": [["// open timeout in milliseconds for http requests to jackett server, 0 = no timeout"]],
		"openTimeout": 10000

	}
}

const readConfig = () => {

	const configFilePath = path.join(rootDir, configFile)

	if (fs.existsSync(configFilePath)) {
		var config

		try {
			config = fs.readFileSync(configFilePath)
		} catch(e) {
			// ignore read file issues
			return defaultConfig
		}

		return commentJson.parse(config.toString())
	} else {
		const configString = commentJson.stringify(defaultConfig, null, 4)

		try {
			fs.writeFileSync(configFilePath, configString)
		} catch(e) {
			// ignore write file issues
			return defaultConfig
		}

		return readConfig()
	}

}

module.exports = readConfig()

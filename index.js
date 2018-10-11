
const nameToImdb = require('name-to-imdb')

const openDirApi = require('./openDirectories')
const helper = require('./helpers')

const config = require('./config')

const pUrl = require('url')

const manifest = { 
    "id": "org.stremio.opendir",
    "version": "1.0.0",

    "name": "Stremio Open Directories Addon",
    "description": "Stremio Add-on to get streaming results from Open Directories",

    "icon": "https://logopond.com/logos/3290f64e7448ab9cf04239a070a8cc47.png",

    // set what type of resources we will return
    "resources": [
        "stream"
    ],

    // works for both movies and series
    "types": ["movie", "series"],

    // prefix of item IDs (ie: "tt0032138")
    "idPrefixes": [ "tt" ]

}

const addonSDK = require("stremio-addon-sdk")
const addon = new addonSDK(manifest)

const toStream = (newObj, type) => {
    return {
        name: pUrl.parse(newObj.href).host,
        type: type,
        url: newObj.href,
        // presume 480p if the filename has no extra tags
        title: newObj.extraTag || '480p'
    }
}

addon.defineStreamHandler(function(args, cb) {

    if (!args.id)
        return cb(null, { streams: [] })

    let results = []

    let sentResponse = false

    const respondStreams = () => {

        if (sentResponse) return
        sentResponse = true

        if (results && results.length) {

            tempResults = results

            const streams = []

            tempResults.forEach(stream => { streams.push(toStream(stream, args.type)) })

            if (streams.length) {
                if (config.onlyMP4) {
                    // use proxy to remove CORS
                    helper.proxify(streams, (err, proxiedStreams) => {
                        if (!err && proxiedStreams && proxiedStreams.length)
                            cb(null, { streams: proxiedStreams })
                        else
                            cb(null, { streams: streams })
                    })
                } else {
                    cb(null, { streams: streams })
                }
            } else {
                cb(null, { streams: [] })
            }
        } else {
            cb(null, { streams: [] })
        }
    }

    const idParts = args.id.split(':')

    const imdbId = idParts[0]

    nameToImdb({ name: imdbId, type: args.type }, (err, res, inf, data) => {

        if (err || !data || !data.name) {
            respond(res, { streams: [] })
            return
        }

        const searchQuery = {
            name: data.name,
            year: data.year,
            type: args.type
        }

        if (idParts.length == 3) {
            searchQuery.season = idParts[1]
            searchQuery.episode = idParts[2]
        }

        openDirApi.search(searchQuery,

            partialResponse = (tempResults) => {
                results = results.concat(tempResults)
            },

            endResponse = (tempResults) => {
                results = tempResults
                respondStreams()
            })


        if (config.responseTimeout)
            setTimeout(respondStreams, config.responseTimeout)

    })

})

addon.runHTTPWithOptions({ port: config.addonPort })

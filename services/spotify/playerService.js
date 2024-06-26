const axios = require('axios')
require('dotenv').config()

async function getCurrentlyPlayingEpisode(spotifyAccessToken) {
    try {
        const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing?additional_types=episode', {
            headers: {
                Authorization: `Bearer ${spotifyAccessToken}`
            }
        })
        if (!response.data || response.item?.type != "episode") {
            return null
        }
        return response.data
    }
    catch (error) {
        console.error("Error getting currently playing episode:", error)
        throw error
    }
}

async function pollEpisodesForUser(username, spotifyAccessToken) {
    try {
        const episode = await getCurrentlyPlayingEpisode(spotifyAccessToken)
        console.log(`Polling again in ${parseInt(process.env.EPISODE_POLL_INTERVAL)} milliseconds`)
        if (episode) {
            console.log(`Currently playing episode for ${username}: ${episode.item.name}`)
            await userService.addStream(username, episode.item.id)
        }
    } catch (error) {
        console.error("Error polling episodes for user:", error)
    } 
    finally {
        // Wrap setTimeout in a Promise and await it before continuing
        await new Promise(resolve => {
            setTimeout(() => {
                resolve()
            }, parseInt(process.env.POLL_INTERVAL))
        })
        // Poll episodes again after waiting for the specified interval
        pollEpisodesForUser(username, spotifyAccessToken)
    }
}



module.exports = {
    getCurrentlyPlayingEpisode,
    // pollEpisodesForUser
}
import Scores from "./models/scores"
import * as log from "loglevel"
import Songs from "./models/songs"
import Tables from "./models/difficultyTable"
import PlayStats from "./models/playStats"

export default class Api {
    host: string = process.env.VUE_APP_HOST

    /**
     * @public
     * @param {string|null} token
     * @returns {Promise<any>}
     */
    static async get_account(token: string | null) {
        if (token === null) {
            return { 'error': 'token is not set' }
        }
        const obj = new Api()
        const uri = obj.host + "/account"
        const headers: any = {
            'session-token': token,
            'access-control-request-headers': 'session-token,content-type'
        }
        const init = { headers }
        return await fetch(uri, init).then(obj.handler).catch(obj.error)
    }

    /**
     * @public
     * @param {string} token
     * @returns {[]| {error:*}}>}
     */
    static async get_user_list(token: string | null) {
        const obj = new Api()
        const url = obj.host + "/users"
        const headers: any = { 'session-token': token }
        const init = { headers }
        return await fetch(url, init).then(obj.handler).catch(obj.error)
    }

    /**
     * @public
     * @param {number} user_id
     * @param {number} table_index
     * @return string
     */
    static get_table_header_url(user_id: string, table_index: string) {
        const obj = new Api()
        return obj.host + "/recommend_table/" + user_id + "/" + table_index + "/table.html"
    }

    /**
     *
     * @param {string} date
     * @param {number} user_id
     * @param {string} token
     * @returns {Promise<null|{user_id: number, user_name: string, score: {}}>}
     */
    static async fetch_score(date: string, user_id: number, token: string | null) {
        const obj = new Api()
        const url = obj.host + "/detail/?date=" + date + "&user_id=" + user_id
        const headers: any = { 'session-token': token }
        const init = { headers }
        try {
            /**
             * @type {({user_id: number, user_name: string, score: {}, error: string})}
             */
            const json = await fetch(url, init).then(obj.handler).catch(obj.error)
            if (json.error) {
                log.debug(json)
                return null
            }
            log.debug(json)

            return new Scores(json.score, json.user_name, json.user_id)
        } catch (e) {
            log.error(e)
            return null
        }
    }

    static async fetch_score_log(user_id: number, hash: string, token: string | null) {
        const obj = new Api()
        const url = obj.host + "/score/?user_id=" + user_id + "&sha256=" + hash
        const headers: any = { 'session-token': token }
        const init = { headers }
        return await fetch(url, init).then(obj.handler).catch(obj.error)
    }

    static async fetch_ranking(token: string | null, sha256: string, date: string) {
        const obj = new Api()
        const uri = obj.host + "/ranking/?sha256=" + sha256 + "&date=" + date
        const headers: any = { 'session-token': token }
        const init = { headers }
        return await fetch(uri, init).then(obj.handler).catch(obj.error)
    }

    /**
     * @param {string} token
     * @returns {Promise<Songs>}
     */
    static async fetch_songs(token: string | null) {
        const obj = new Api()
        const uri = obj.host + "/songs"
        const headers: any = { 'session-token': token }
        const init = { headers }
        return new Songs(await fetch(uri, init).then(obj.handler).catch(obj.error))
    }

    /**
     * @param {string} token
     * @returns {Promise<Tables>}
     */
    static async fetch_tables(token: string | null) {
        const obj = new Api()
        const uri = obj.host + "/tables"
        const headers: any = { 'session-token': token }
        const init = { headers }
        return new Tables(await fetch(uri, init).then(obj.handler).catch(obj.error))
    }

    /**
     * @param {string} token
     * @param {number} user_id
     * @returns {Promise<Object>}
     */
    static async fetch_play_stats(token: string | null, user_id: number) {
        const obj = new Api()
        const uri = obj.host + "/stats/" + user_id
        const headers: any = { 'session-token': token }
        const init = { headers }
        return new PlayStats(await fetch(uri, init).then(obj.handler).catch(obj.error))
    }

    static async logout(token: string | null) {
        const obj = new Api()
        const uri = obj.host + "/logout"
        const headers: any = { 'session-token': token }
        const init = { headers }
        await fetch(uri, init).then(obj.handler).catch(obj.error)
    }

    /**
     * @param {string} token
     * @param {string} name
     * @returns {Promise<Response|{error: *}>}
     */
    static async change_user_name(token: string | null, name: string) {
        const obj = new Api()
        const uri = obj.host + "/user/name"
        const body = JSON.stringify({ 'changed_name': name })
        const headers: any = {
            'session-token': token,
            'content-type': 'application/json'
        }
        const init = {
            headers,
            method: 'POST',
            body: body
        }
        return await fetch(uri, init).then(obj.handler).catch(obj.error)
    }

    /**
     * @param {string} token
     * @param {boolean} visibility
     * @returns {Promise<Response|{error: *}>}
     */
    static async change_visibility(token: string | null, visibility: boolean) {
        const obj = new Api()
        const uri = obj.host + "/user/visibility"
        const body = JSON.stringify({ 'visibility': visibility ? "true" : "false" })
        const headers: any = {
            'session-token': token,
            'content-type': 'application/json'
        }
        const init = {
            headers,
            method: 'POST',
            body: body
        }
        return await fetch(uri, init).then(obj.handler).catch(obj.error)
    }

    static async upload_play_data(token: string | null, score: string, scorelog: string) {
        const obj = new Api()
        const uri = obj.host + "/upload/play_data"
        const formData = new FormData()
        formData.append("score", score)
        formData.append("scorelog", scorelog)
        const headers: any = {
            'session-token': token,
            'access-control-request-headers': 'session-token,content-type'
        }
        const init = {
            method: 'POST',
            headers,
            body: formData
        }
        return await fetch(uri, init).then(obj.handler).catch(obj.error)
    }

    static async upload_song_data(token: string | null, file: string) {
        const obj = new Api()
        const uri = obj.host + "/upload/song_data"
        const formData = new FormData()
        formData.append("songdata", file)
        const headers: any = {
            'session-token': token,
            'access-control-request-headers': 'session-token,content-type'
        }
        const init = {
            method: 'POST',
            headers,
            body: formData
        }
        log.debug(init);
        return await fetch(uri, init).then(obj.handler).catch(obj.error)
    }

    async handler(response: any) {
        log.debug(response)
        if (response.status === 401) {
            log.debug("Need Login")
        }
        if (!response.ok) {
            log.debug(response)
        }
        return response.json()
    }

    /**
     * @param response
     * @returns {Promise<{error}>}
     */
    async error(response: any) {
        return { 'error': response }
    }
}
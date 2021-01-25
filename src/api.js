import Scores from "./models/scores"
import * as log from "loglevel"
import Songs from "./models/songs";
import Tables from "./models/difficultyTable";

export default class Api {
    constructor() {
        this.host = process.env.VUE_APP_HOST
    }

    /**
     * @public
     * @param {string|null} token
     * @returns {Promise<any>}
     */
    static async get_account(token) {
        if (token === null) {
            return {'error': 'token is not set'}
        }
        const obj = new Api()
        const uri = obj.host + "/account"
        const init = {headers: {'session-token': token}}
        return await fetch(uri, init).then(obj.handler).catch(obj.error)
    }

    /**
     * @public
     * @param {number} user_id
     * @return string
     */
    static get_table_header_url(user_id) {
        const obj = new Api()
        return obj.host + "/recommend_table/" + user_id + "/table.html"
    }

    /**
     *
     * @param date
     * @param user_id
     * @param token
     * @returns {Promise<null|{user_id: number, user_name: string, score: {}}>}
     */
    static async fetch_score(date, user_id, token) {
        const obj = new Api()
        const url = obj.host + "/detail/?date=" + date + "&user_id=" + user_id
        const init = {headers: {'session-token': token}}
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

            return await new Scores(json.score, json.user_name, json.user_id)
        } catch (e) {
            log.error(e)
            return null
        }
    }

    /**
     * @param {string} token
     * @returns {Promise<Songs>}
     */
    static async fetch_songs(token) {
        const obj = new Api()
        const uri = obj.host + "/songs"
        const init = {headers: {'session-token': token}}
        return new Songs(await fetch(uri, init).then(obj.handler).catch(obj.error))
    }

    /**
     * @param {string} token
     * @returns {Promise<Tables>}
     */
    static async fetch_tables(token) {
        const obj = new Api()
        const uri = obj.host + "/tables"
        const init = {headers: {'session-token': token}}
        return new Tables(await fetch(uri, init).then(obj.handler).catch(obj.error))
    }

    static async logout(token) {
        const obj = new Api()
        const uri = obj.host + "/logout"
        const init = {headers: {'session-token': token}}
        await fetch(uri, init).then(obj.handler).catch(obj.error)
    }

    static async change_user_name(token, name) {
        const obj = new Api()
        const uri = obj.host + "/user/name"
        const body = JSON.stringify({'changed_name': name})
        const init = {
            headers: {
                'session-token': token,
                'content-type': 'application/json'
            },
            method: 'POST',
            body: body
        }
        return await fetch(uri, init).then(obj.handler).catch(obj.error)
    }

    static get_upload_score_url() {
        const obj = new Api()
        return obj.host + "/upload/score"
    }

    static get_upload_score_log_url() {
        const obj = new Api()
        return obj.host + "/upload/score_log"
    }

    static get_upload_song_data_url() {
        const obj = new Api()
        return obj.host + "/upload/song_data"
    }

    async handler(response) {
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
    async error(response) {
        return {'error': response}
    }
}
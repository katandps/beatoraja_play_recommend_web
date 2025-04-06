import Scores from "./models/scores"
import * as log from "loglevel"
import Songs from "./models/songs"
import Tables from "./models/difficultyTable"
import PlayStats from "./models/playStats"
import { UserInfo } from "@/store/session"
import Calendar from "@/models/calendar"

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

    static get_table_header_url(user_id: number, table_index: string): string {
        const obj = new Api()
        return obj.host + "/recommend_table/" + user_id + "/" + table_index + "/table.html"
    }

    /**
     *
     * @param {Date} date
     * @param {number} user_id
     * @param {string} token
     * @returns {Promise<null|{user_id: number, user_name: string, score: {}}>}
     */
    static async fetch_score(date: Date, user_id: number, token: string | null) {
        const obj = new Api()
        const localDate = new Date(date.toISOString())
        const timezoneOffset = localDate.getTimezoneOffset()
        // タイムゾーンの影響を小さくする
        localDate.setMinutes(localDate.getMinutes() - timezoneOffset)
        log.debug(localDate)
        const url = obj.host + "/detail/?date=" + localDate.toISOString() + "&user_id=" + user_id
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

    static async fetch_my_score(hash: string, token: string | null) {
        const obj = new Api()
        const url = obj.host + "/score/?sha256=" + hash
        const headers: any = { 'session-token': token }
        const init = { headers }
        return await fetch(url, init).then(obj.handler).catch(obj.error)
    }

    static async fetch_ranking(token: string | null, sha256: string, date: Date) {
        const obj = new Api()
        const uri = obj.host + "/ranking/?sha256=" + sha256 + "&date=" + date.toISOString()
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

    static async fetch_calendar_dates(token: string | null) {
        log.debug(token)
        // const obj = new Api()
        // const uri = obj.host + "/calendar/dates"
        // const headers: any = { 'session-token': token }
        // const init = { headers }
        // await fetch(uri, init).then(obj.handler).catch(obj.error)
        return new Calendar()
    }

    static async logout(token: string | null) {
        const obj = new Api()
        const uri = obj.host + "/logout"
        const headers: any = { 'session-token': token }
        const init = { headers }
        await fetch(uri, init).then(obj.handler).catch(obj.error)
    }

    static async change_user_name(token: string, name: string): Promise<UserInfo> {
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

    static async change_visibility(token: string, visibility: boolean): Promise<UserInfo> {
        const obj = new Api()
        const uri = obj.host + "/user/visibility"
        const body = JSON.stringify({ 'visibility': visibility ? true : false })
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

    static async upload_play_data(token: string | null, score: Uint8Array, scorelog: Uint8Array) {
        const obj = new Api()
        const uri = obj.host + "/upload/play_data"
        const formData = new FormData()
        const scoreBlob = new Blob([score], { type: 'application/octet-stream' })
        const scorelogBlob = new Blob([scorelog], { type: 'application/octet-stream' })
        formData.append("score", scoreBlob)
        formData.append("scorelog", scorelogBlob)
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

    static async upload_song_data(token: string | null, arrayBuffer: Uint8Array) {
        const obj = new Api()
        const uri = obj.host + "/upload/song_data"
        const formData = new FormData()
        const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' })
        formData.append("songdata", blob)
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

    static async reset_score(token: string | null) {
        const obj = new Api()
        const uri = obj.host + "/reset"
        const headers: any = {
            'session-token': token,
        }
        const init = {
            headers,
            method: 'POST',
        }
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
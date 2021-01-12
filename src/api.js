import Scores from "./models/song";
import * as log from "loglevel"
import SongDetail from "./models/song_detail";

export default class Api {
    constructor() {
        this.host = process.env.VUE_APP_HOST;
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
        const obj = new Api();
        const uri = obj.host + "/account";
        const init = {headers: {'session-token': token}};
        return await (await fetch(uri, init).then(obj.handler)).json();
    }

    /**
     * @public
     * @param {string} date
     * @param {string|null} token
     * @returns {Promise<null|Scores>}
     */
    static async fetch_my_score(date, token) {
        const obj = new Api();
        const url = obj.host + "/my_detail/?date=" + date;
        return obj.fetch_score(url, token)
    }

    /**
     * @param {string} date
     * @param {number} user_id
     * @param {string| null}token
     * @returns {Promise<null|Scores>}
     */
    static async fetch_others_score(date, user_id, token) {
        const obj = new Api()
        const url = obj.host + "/detail/?date=" + date + "&user_id=" + user_id
        return obj.fetch_score(url, token)
    }

    /**
     * @private
     * @param {string} url
     * @param {string} token
     * @returns {Scores}
     */
    async fetch_score(url, token) {
        const init = {headers: {'session-token': token}}
        try {
            /**
             * @type {({user_id: number, user_name: string, score: {}})}
             */
            const json = await (await fetch(url, init).then(this.handler)).json()
            if (json.error) {
                log.debug(json)
                return null
            }
            log.debug(json)
            let scores = {};
            for (const [hash, score] of Object.entries(json.score)) {
                scores[hash] = new SongDetail(score)
            }
            return new Scores(scores, json.user_name, json.user_id)
        } catch (e) {
            log.error(e)
            return null
        }
    }

    static async fetch_tables(token) {
        const obj = new Api();
        const uri = obj.host + "/tables";
        const init = {headers: {'session-token': token}};
        return await (await fetch(uri, init).then(obj.handler)).json();
    }

    static async logout(token) {
        const obj = new Api();
        const uri = obj.host + "/logout";
        const init = {headers: {'session-token': token}};
        await fetch(uri, init).then(obj.handler);
    }

    static async change_user_name(token, name) {
        const obj = new Api();
        const uri = obj.host + "/update/name";
        const body = JSON.stringify({'changed_name': name});
        const init = {
            headers: {'session-token': token, 'content-type': 'application/json'},
            method: 'POST',
            body: body
        };
        return await (await fetch(uri, init).then(obj.handler)).json();
    }

    static get_upload_score_url() {
        const obj = new Api();
        return obj.host + "/upload/score";
    }

    static get_upload_score_log_url() {
        const obj = new Api();
        return obj.host + "/upload/score_log";
    }

    static get_upload_song_data_url() {
        const obj = new Api();
        return obj.host + "/upload/song_data";
    }

    async handler(response) {
        if (response.status === 401) {
            log.debug("Need Login");
        }
        if (!response.ok) {
            log.debug(response);
        }
        return response;
    }
}
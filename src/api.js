import AllDetail from "./models/song";
import * as log from "loglevel"

export default class Api {
    constructor() {
        this.host = process.env.VUE_APP_HOST;
    }

    static async get_account(token) {
        const obj = new Api();
        const uri = obj.host + "/account";
        const init = {headers: {'session-token': token}};
        return await (await fetch(uri, init).then(obj.handler)).json();
    }

    static async fetch_my_score(date, token) {
        const obj = new Api();
        const url = obj.host + "/my_detail/?date=" + date;
        const init = {headers: {'session-token': token}};
        try {
            const json = await (await fetch(url, init).then(obj.handler)).json();
            if (!Array.isArray(json)) {
                return null;
            }
            return new AllDetail(json);
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    static async fetch_others_score(date, user_id, token) {
        const obj = new Api();
        const url = obj.host + "/detail/?date=" + date + "&user_id=" + user_id;
        const init = {headers: {'session-token': token}};
        try {
            const json = await (await fetch(url, init).then(obj.handler)).json();
            if (!Array.isArray(json)) {
                return null;
            }
            return new AllDetail(json);
        } catch (e) {
            console.log(e);
            return null;
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

    handler(response) {
        if (response.status === 401) {
            log.debug("Need Login");
        }
        if (!response.ok) {
            log.debug(response);
        }
        return response;
    }
}
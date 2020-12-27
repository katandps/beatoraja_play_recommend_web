import AllDetail from "./models/song";

export default class Api {
    constructor() {
        this.host = process.env.VUE_APP_HOST;
    }

    static async check_account(token) {
        const obj = new Api();
        const uri = obj.host + "account";
        const init = {headers: {'oauth-token': token}};
        await fetch(uri, init).then(obj.handler);
    }

    static async fetch_my_score(date, token) {
        const obj = new Api();
        const url = obj.host + "my_detail/?date=" + date;
        const init = {headers: {'oauth-token': token}};
        const json = await (await fetch(url, init).then(obj.handler)).json();
        return new AllDetail(json);
    }

    static async fetch_others_score(date, user_id) {
        if (!user_id) {
            return new AllDetail();
        }
        const obj = new Api();
        const url = obj.host + "detail/?date=" + date + "&user_id=" + user_id;
        const json = await (await fetch(url).then(obj.handler)).json();
        return new AllDetail(json);
    }

    static async fetch_tables() {
        const obj = new Api();
        const uri = obj.host + "tables/";
        return await (await fetch(uri).then(obj.handler)).json();
    }

    static get_upload_score_url() {
        const obj = new Api();
        return obj.host + "upload/score";
    }

    static get_upload_score_log_url() {
        const obj = new Api();
        return obj.host + "upload/score_log";
    }

    static get_upload_song_data_url() {
        const obj = new Api();
        return obj.host + "upload/song_data";
    }

    handler(response) {
        if (response.status === 401) {
            console.log("Need Login");
        }
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }
}
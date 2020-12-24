import AllDetail from "./models/song";

export default class Api {
    constructor() {
        this.host = process.env.VUE_APP_HOST;
    }

    static async fetch_my_score(date, token) {
        const obj = new Api();
        const url = obj.host + "my_detail/?date=" + date + "&token=" + token;
        const json = await (await fetch(url).then(obj.handler).catch(obj.error)).json();
        return new AllDetail(json);
    }

    static async fetch_others_score(date, user_id) {
        const obj = new Api();
        const url = obj.host + "detail/?date=" + date + "&user_id=" + user_id;
        const json = await (await fetch(url).then(obj.handler).catch(obj.error)).json();
        return new AllDetail(json);
    }

    static async fetch_tables() {
        const obj = new Api();
        const uri = obj.host + "tables/";
        return await (await fetch(uri).then(obj.handler).catch(obj.error)).json();
    }

    static get_upload_score_url() {
        const obj = new Api();
        return obj.host + "upload/score";
    }

    static get_upload_score_log_url() {
        const obj = new Api();
        return obj.host + "upload/score_log";
    }

    handler(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }

    error(e) {
        console.log(e)
    }
}
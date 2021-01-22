export class DateFormatter {
    /**
     * @public
     * @param {Date} date
     * @return {string}
     */
    static format(date) {
        return this.PRIORITY.reduce((res, fmt) => res.replace(fmt, this.FMT[fmt](date)), "yyyy-MM-dd")
    }

    static FMT = {
        "yyyy": function (date) {
            return date.getFullYear() + '';
        },
        "MM": function (date) {
            return ('0' + (date.getMonth() + 1)).slice(-2);
        },
        "dd": function (date) {
            return ('0' + date.getDate()).slice(-2);
        },
        "hh": function (date) {
            return ('0' + date.getHours()).slice(-2);
        },
        "mm": function (date) {
            return ('0' + date.getMinutes()).slice(-2);
        },
        "ss": function (date) {
            return ('0' + date.getSeconds()).slice(-2);
        }
    }

    static PRIORITY = ["yyyy", "MM", "dd", "hh", "mm", "ss"]
}
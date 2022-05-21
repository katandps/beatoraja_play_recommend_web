export class DateFormatter {
    /**
     * @public
     * @param {Date} date
     * @return {string}
     */
    static format(date: Date): string {
        return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' +  ('0' + date.getDate()).slice(-2)
    }
}
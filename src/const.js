export default Object.freeze({
    LAMP_TYPE: [
        "Max",
        "Perfect",
        "FullCombo",
        "ExHard",
        "Hard",
        "Normal",
        "Easy",
        "LightAssistEasy",
        "AssistEasy",
        "Failed",
        "NoPlay",
    ],

    RANK_TYPE: [
        "AAA",
        "AA",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
    ],

    SONG_FORMAT: [
        [
            {
                level: "",
                songs: [
                    {
                        level: "Lv1",
                        title: "読込中",
                        score: "2",
                        min_bp: "1",
                        max_combo: "1",
                        clear_type: "NoPlay",
                        clear_rank: "AAA",
                        updated_at: "1970-01-01T00:00:00+09:00",
                        play_count: "-1",
                        total_notes: "1",
                    }]
            }
        ]
    ],

    dateFormatter: {
        _fmt: {
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
        },
        _priority: ["yyyy", "MM", "dd", "hh", "mm", "ss"],
        format: function (date) {
            if (date && date instanceof Date) {
                return this._priority.reduce((res, fmt) => res.replace(fmt, this._fmt[fmt](date)), "yyyy-MM-dd")
            }
            return date;
        }
    },
});
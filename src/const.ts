export default Object.freeze({
    LAMP_TYPE: [
        'Max',
        'Perfect',
        'FullCombo',
        'ExHard',
        'Hard',
        'Normal',
        'Easy',
        'LightAssistEasy',
        'AssistEasy',
        'Failed',
        'NoPlay',
    ],

    LAMP_INDEX: [
        'NoPlay',
        'Failed',
        'AssistEasy',
        'LightAssistEasy',
        'Easy',
        'Normal',
        'Hard',
        'ExHard',
        'FullCombo',
        'Perfect',
        'Max',
    ],

    LAMP_GRAPH_LIST: [
        10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0
    ],

    RANK_TYPE: [
        'Max', 'AAA', 'AA', 'A', 'B', 'C', 'D', 'E', 'F',
    ],

    RANK_RATE_BY_9: [
        9, 8, 7, 6, 5, 4, 3, 2, 0
    ],

    DETAIL_RANK_TYPE: [
        'Max',
        'AAA1', 'AAA2', 'AAA3',
        'AA1', 'AA2', 'AA3',
        'A1', 'A2', 'A3',
        'B1', 'B2', 'B3',
        'C1', 'C2', 'C3',
        'D1', 'D2', 'D3',
        'E1', 'E2', 'E3',
        'F1', 'F2', 'F3',
        'F4', 'F5', 'F6',
    ],

    DETAIL_RANK_BY_27: [
        27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0,
    ],

    SONG_FORMAT: [
        [
            {
                level: '',
                songs: [
                    {
                        level: 'Lv1',
                        title: '読込中',
                        max_combo: '1',
                        clear_type: {
                            current: 'Easy',
                            before: 'NoPlay',
                            updated_at: '1990-01-01T00:00:00+09:00',
                        },
                        score: {
                            current: '123',
                            before: '0',
                            updated_at: '1980-01-01T00:00:00+09:00',
                        },
                        min_bp: {
                            current: '50',
                            before: '0',
                            updated_at: '2000-01-01T00:00:00+09:00',
                        },
                        clear_rank: 'AAA',
                        updated_at: '2000-01-01T00:00:00+09:00',
                        play_count: '4',
                        total_notes: '1',
                    }]
            }
        ]
    ],

    DETAIL_COLUMNS: [
        { key: "clear", name: "クリア", title: " ", class: "clear" },
        {
            key: "clear_date",
            name: "クリア更新日",
            title: "Date(clear)",
            class: "date"
        },
        { key: "clear_before", name: "更新前クリア", title: " ", class: "clear" },
        { key: "level", name: "難易度", title: "Lv", class: "level" },
        { key: "title", name: "曲名", title: "Title", class: "title" },
        { key: "clear_update", name: "クリア更新", title: "ClearDiff", class: "clear_update" },
        { key: "score_rank", name: "スコアランク", title: "Rank", class: "rank" },
        { key: "detail_rank", name: "細分化ランク", title: "DRank", class: "rank" },
        { key: "rank_update", name: "ランク更新", title: "RankDiff", class: "update" },
        { key: "rate", name: "スコア%", title: "Rate", class: "rate" },
        { key: "accuracy", name: "正確さ", title: "Accuracy", class: "accuracy" },
        { key: "score", name: "EXスコア", title: "Ex/Max", class: "score" },
        {
            key: "score_date",
            name: "スコア更新日",
            title: "Date(score)",
            class: "date"
        },
        {
            key: "score_before",
            name: "更新前スコア",
            title: "Ex(old)",
            class: "score"
        },
        { key: "score_update", name: "スコア更新", title: "ScoreDiff", class: "update" },
        { key: "bp", name: "ミスカウント", title: "BP", class: "bp" },
        {
            key: "bp_date",
            name: "ミスカウント更新日",
            title: "Date(BP)",
            class: "date"
        },
        {
            key: "bp_before",
            name: "更新前ミスカウント",
            title: "BP(old)",
            class: "bp"
        },
        {
            key: "bp_update",
            name: "ミスカウント更新",
            title: "BpDiff",
            class: "update"
        },
        { key: "combo", name: "最高コンボ", title: "Combo", class: "combo" },
        { key: "play", name: "プレイ回数", title: "Play", class: "play" },
        { key: "date", name: "更新日", title: "Date", class: "date" },
        { key: "clear_diff_rival", name: "ライバルとのクリア差", title: "ClearVS", class: "clear_vs" },
        { key: "score_diff_rival", name: "ライバルとのスコア差", title: "ScoreVS", class: "score_vs" },
        { key: "bp_diff_rival", name: "ライバルとのBP差", title: "BPVS", class: "bp_vs" },
        { key: "rival_date", name: "ライバルの更新日", title: "RivalDate", class: "date" },
    ]
});
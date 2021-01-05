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

    DETAIL_COLUMNS: [
        'clear',
        'clear_date',
        'clear_before',
        'level',
        'title',
        'rate',
        'score',
        'score_date',
        'score_before',
        'bp',
        'bp_date',
        'bp_before',
        'combo',
        'play',
        'date'
    ],

    DETAIL_COLUMN_NAME: {
        'clear': 'クリア',
        'clear_date': 'クリア更新日',
        'clear_before': '更新前クリア',
        'level': '難易度',
        'title': '曲名',
        'rate': 'スコア%',
        'score': 'EXスコア',
        'score_date': 'スコア更新日',
        'score_before': '更新前スコア',
        'bp': 'ミスカウント',
        'bp_date': 'ミスカウント更新日',
        'bp_before': '更新前ミスカウント',
        'combo': '最高コンボ',
        'play': 'プレイ回数',
        'date': '更新日',
    },

    DETAIL_TITLE_MAP: {
        'clear': ' ',
        'clear_date': 'Date(clear)',
        'clear_before': ' ',
        'level': 'Lv',
        'title': 'Title',
        'rate': 'Rate',
        'score': 'Ex/Max',
        'score_before': 'Ex(old)',
        'score_date': 'Date(score)',
        'bp': 'BP',
        'bp_before': 'BP(old)',
        'bp_date': 'Date(BP)',
        'combo': 'Combo',
        'play': 'Play',
        'date': 'Date'
    },

    SONG_FORMAT: [
        [
            {
                level: "",
                songs: [
                    {
                        level: "Lv1",
                        title: "読込中",
                        max_combo: "1",
                        clear_type: {
                            current: "Easy",
                            before: "NoPlay",
                            updated_at: "1990-01-01T00:00:00+09:00",
                        },
                        score: {
                            current: "123",
                            before: "0",
                            updated_at: "1980-01-01T00:00:00+09:00",
                        },
                        min_bp: {
                            current: "50",
                            before: "0",
                            updated_at: "2000-01-01T00:00:00+09:00",
                        },
                        clear_rank: "AAA",
                        updated_at: "2000-01-01T00:00:00+09:00",
                        play_count: "4",
                        total_notes: "1",
                    }]
            }
        ]
    ],
});
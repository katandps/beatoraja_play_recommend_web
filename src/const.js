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
        'AAA',
        'AA',
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
    ],

    DETAIL_COLUMNS: [
        {key: 'clear', name: 'クリア', title: ' ', class: 'clear'},
        {key: 'clear_date', name: 'クリア更新日', title: 'Date(clear)', class: 'clear_date'},
        {key: 'clear_before', name: '更新前クリア', title: ' ', class: 'clear_before'},
        {key: 'level', name: '難易度', title: 'Lv', class: 'level'},
        {key: 'title', name: '曲名', title: 'Title', class: 'title'},
        {key: 'minir', name: 'MinIR', title: 'MinIR', class: 'minir'},
        {key: 'mocha', name: 'Mocha Repository', title: 'Mocha', class: 'mocha'},
        {key: 'rate', name: 'スコア%', title: 'Rate', class: 'rate'},
        {key: 'score', name: 'EXスコア', title: 'Ex/Max', class: 'score'},
        {key: 'score_date', name: 'スコア更新日', title: 'Date(score)', class: 'score_date'},
        {key: 'score_before', name: '更新前スコア', title: 'Ex(old)', class: 'score'},
        {key: 'bp', name: 'ミスカウント', title: 'BP', class: 'bp'},
        {key: 'bp_date', name: 'ミスカウント更新日', title: 'Date(BP)', class: 'bp_date'},
        {key: 'bp_before', name: '更新前ミスカウント', title: 'BP(old)', class: 'bp'},
        {key: 'combo', name: '最高コンボ', title: 'Combo', class: 'combo'},
        {key: 'play', name: 'プレイ回数', title: 'Play', class: 'play'},
        {key: 'date', name: '更新日', title: 'Date', class: 'date'}
    ],

    RECENT_COLUMNS: [
        {key: 'clear', name: 'クリア', title: ' ', class: 'clear'},
        {key: 'level', name: '難易度', title: 'Lv', class: 'level'},
        {key: 'title', name: '曲名', title: 'Title', class: 'title'},
        {key: 'clear_update', name: 'クリア更新', title: 'Clear', class: 'update'},
        {key: 'score_update', name: 'スコア更新', title: 'Score', class: 'update'},
        {key: 'bp_update', name: 'ミスカウント更新', title: 'Bp', class: 'update'},
        {key: 'date', name: '更新日', title: 'Date', class: 'date'},
    ],

    RIVAL_COLUMNS: [
        {key: 'clear', name: 'クリア', title: ' ', class: 'clear'},
        {key: 'level', name: '難易度', title: 'Lv', class: 'level'},
        {key: 'title', name: '曲名', title: 'Title', class: 'title'},
        {key: 'date', name: '更新日', title: 'Date', class: 'date'},
        {key: 'clear_diff_rival', name: "クリア比較", title: "ClearVS", class: "clear_vs"},
        {key: 'score_diff_rival', name: "スコア比較", title: "ScoreVS", class: "score_vs"},
        {key: 'bp_diff_rival', name: "ミスカウント比較", title: "BPVS", class: "bp_vs"},
        {key: 'rival_date', name: "ライバル更新日", title: "RivalDate", class: "date"},
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
});
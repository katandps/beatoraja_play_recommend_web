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
});
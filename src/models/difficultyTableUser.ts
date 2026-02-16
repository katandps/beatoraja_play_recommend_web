import config from "@/const"
import { DateFormatter } from "@/models/date_formatter"
import SongDetail from "@/models/song_detail"
import Songs from "@/models/songs"
import Scores from "@/models/scores"
import { DifficultyTable } from "@/models/difficultyTable"

export type SummaryCard = {
    label: string
    value: string
    tooltip?: string
}

export type LampCountsRow = {
    level: string
    counts: number[]
    total: number
}

export type ScoreRateSegment = {
    len: number
    count: number
    alpha: number
    start: number
    end: number
    rank?: string
    startPercent: number
    endPercent: number
}

export type ScoreRateRow = {
    level: string
    segments: ScoreRateSegment[]
}

export type RankBoundaryLabel = {
    label: string
    left: string
}

export type TopUpdateRow = {
    title: string
    level: string
    lamp: string
    updatedLabel: string
}

export type TableRow = {
    level: string
    title: string
    titleWrapped: string
    lamp: string
    rate: string
    miss: string
    last: string
}

const formatMissCount = (value: number) => {
    if (value < 0 || value === 2147483647) {
        return "-"
    }
    return value.toLocaleString()
}

export const hardIndex = config.LAMP_INDEX.indexOf("Hard")
export const failedIndex = config.LAMP_INDEX.indexOf("Failed")
export const easyIndex = config.LAMP_INDEX.indexOf("Easy")

export const lampIndexDisplay = [...config.LAMP_INDEX].reverse()
export const lampIndexMap = (() => {
    const map: { [key: string]: number } = {}
    config.LAMP_INDEX.forEach((lamp, index) => {
        map[lamp] = index
    })
    return map
})()

const normalRanksHighToLow = config.RANK_TYPE.filter((rank) => rank !== "Max")
const normalRanksLowToHigh = [...normalRanksHighToLow].reverse()
const binsPerRank = 10
export const totalBins = normalRanksLowToHigh.length * binsPerRank + 1
const maxBinIndex = totalBins - 1
const normalRateSteps = config.RANK_RATE_BY_9.slice(1)
const stepAlphas = [0.3, 0.45, 0.6, 0.8, 1]
const normalBoundsHighToLow = normalRateSteps.map((v, index) => {
    const lower = (v / 9) * 100
    const upper = index === 0 ? 100 : (normalRateSteps[index - 1] / 9) * 100
    return { lower, upper }
})
const normalBoundsLowToHigh = [...normalBoundsHighToLow].reverse()
const normalWidthPercent = ((totalBins - 1) / totalBins) * 100

export const rankBoundaryLabels: RankBoundaryLabel[] = (() => {
    const count = normalRanksLowToHigh.length
    const labels = normalRanksLowToHigh.map((rank, index) => ({
        label: rank,
        left: `${(normalWidthPercent * (index / count)).toFixed(3)}%`
    }))
    labels.push({ label: "Max", left: "100%" })
    return labels
})()

export const isValidDate = (d: Date) => d && d.getFullYear() > 2000

export const clampRate = (rate: number) => Math.max(0, Math.min(100, rate))

export const formatEffort = (value: number) => value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
})

const levelNumber = (level: string) => {
    const parsed = parseFloat(level.replace(/[^0-9.]/g, ""))
    return Number.isFinite(parsed) ? parsed : 0
}

const lowerBound = (values: number[], target: number) => {
    let low = 0
    let high = values.length
    while (low < high) {
        const mid = Math.floor((low + high) / 2)
        if (values[mid] < target) {
            low = mid + 1
        } else {
            high = mid
        }
    }
    return low
}

const quantile = (sorted: number[], q: number) => {
    if (sorted.length === 0) {
        return 0
    }
    if (sorted.length === 1) {
        return sorted[0]
    }
    const pos = (sorted.length - 1) * q
    const base = Math.floor(pos)
    const rest = pos - base
    const next = sorted[Math.min(sorted.length - 1, base + 1)]
    return sorted[base] + (next - sorted[base]) * rest
}

export const buildTableSongs = (
    scores: Scores | null,
    songs: Songs | null,
    selectedTable: DifficultyTable | null | undefined
) => {
    if (!scores || !songs || !selectedTable) {
        return [] as SongDetail[]
    }
    const used: { [key: string]: boolean } = {}
    const list: SongDetail[] = []
    const levels = selectedTable.levels
    for (const level in levels) {
        const hashes = levels[level]
        if (!hashes) {
            continue
        }
        for (const hash of hashes) {
            if (used[hash]) {
                continue
            }
            used[hash] = true
            const detail = new SongDetail()
            detail.set_level(level)
            detail.init_score(scores.get_score(hash))
            detail.init_song(songs.get_score(hash), hash)
            list.push(detail)
        }
    }
    return list.sort(SongDetail.cmp_title)
}

export const filterSongs = (
    songs: SongDetail[],
    searchText: string,
    lampFilter: string,
    hardLampIndex: number,
    failedLampIndex: number
) => {
    const keyword = searchText.trim().toLowerCase()
    return songs.filter((song) => {
        if (keyword && !song.title.toLowerCase().includes(keyword)) {
            return false
        }
        if (lampFilter === "hard") {
            return song.clear_type >= hardLampIndex
        }
        if (lampFilter === "uncleared") {
            return song.clear_type <= failedLampIndex
        }
        return true
    })
}

export const buildSummaryCards = (songs: SongDetail[]): SummaryCard[] => {
    const total = songs.length
    const cleared = songs.filter((s) => s.clear_type !== 0)
    const playedCount = cleared.length
    const scoreEffortRaw = cleared.reduce((sum, s) => sum + clampRate(s.score_rate()), 0)
    const scoreEffort = formatEffort(scoreEffortRaw)
    const scoreEffortMax = Math.round(total * 100).toLocaleString()
    const clearEffortValue = (() => {
        if (total === 0) {
            return 0
        }
        const valid = cleared.filter((s) => s.total_notes > 0 && s.min_bp >= 0)
        if (valid.length === 0) {
            return 0
        }
        const totalScore = valid.reduce((sum, s) => {
            const base = Math.max(0, (s.total_notes - s.min_bp * 3) / s.total_notes)
            return sum + 100 * (base ** 2)
        }, 0)
        return Math.max(0, totalScore)
    })()
    const clearEffort = formatEffort(clearEffortValue)
    const clearEffortMax = Math.round(total * 100).toLocaleString()
    return [
        { label: "プレイ済み譜面数", value: `${playedCount.toLocaleString()}/${total.toLocaleString()}` },
        {
            label: "スコア頑張り度",
            value: scoreEffort,
            tooltip: `満点 ${scoreEffortMax} | 計算式: スコアレートの合計`
        },
        {
            label: "クリア頑張り度",
            value: clearEffort,
            tooltip: `満点 ${clearEffortMax} | 計算式: 100*((ノート数-ミス数*3)/ノート数)^2、0未満は0`
        }
    ]
}

export const buildScoreEffortByLevel = (songs: SongDetail[]) => {
    const map: { [key: string]: number } = {}
    songs.forEach((s) => {
        if (s.clear_type === 0) {
            return
        }
        map[s.level] = (map[s.level] || 0) + clampRate(s.score_rate())
    })
    return map
}

export const buildScoreEffortCountByLevel = (songs: SongDetail[]) => {
    const map: { [key: string]: number } = {}
    songs.forEach((s) => {
        if (s.clear_type === 0) {
            return
        }
        map[s.level] = (map[s.level] || 0) + 1
    })
    return map
}

export const buildClearEffortByLevel = (songs: SongDetail[]) => {
    const map: { [key: string]: number } = {}
    songs.forEach((s) => {
        if (s.clear_type === 0 || s.total_notes <= 0 || s.min_bp < 0) {
            return
        }
        const base = Math.max(0, (s.total_notes - s.min_bp * 3) / s.total_notes)
        const value = 100 * (base ** 2)
        map[s.level] = (map[s.level] || 0) + value
    })
    return map
}

export const buildClearEffortCountByLevel = (songs: SongDetail[]) => {
    const map: { [key: string]: number } = {}
    songs.forEach((s) => {
        if (s.clear_type === 0 || s.total_notes <= 0 || s.min_bp < 0) {
            return
        }
        map[s.level] = (map[s.level] || 0) + 1
    })
    return map
}

export const buildTopUpdates = (songs: SongDetail[], easyLampIndex: number): TopUpdateRow[] => {
    const since = new Date()
    since.setDate(since.getDate() - 30)
    since.setHours(0, 0, 0, 0)
    const byLevel = new Map<string, number[]>()
    songs.forEach((s) => {
        if (!byLevel.has(s.level)) {
            byLevel.set(s.level, [])
        }
        byLevel.get(s.level)?.push(s.clear_type)
    })
    const sortedByLevel = new Map<string, number[]>()
    byLevel.forEach((values, level) => {
        sortedByLevel.set(level, [...values].sort((a, b) => a - b))
    })

    const pickByLamp = new Map<number, {
        title: string
        level: string
        rate: number
        levelValue: number
        lamp: string
        lampIndex: number
        updatedAt: number
        updatedLabel: string
    }>()
    const candidates: {
        title: string
        level: string
        rate: number
        levelValue: number
        lamp: string
        lampIndex: number
        updatedAt: number
        updatedLabel: string
    }[] = []

    songs
        .filter((s) => s.clear_type >= easyLampIndex)
        .filter((s) => isValidDate(s.clear_updated_at) && s.clear_updated_at >= since)
        .forEach((s) => {
            const sorted = sortedByLevel.get(s.level) || [s.clear_type]
            const total = sorted.length
            const count = lowerBound(sorted, s.clear_type)
            const rate = total === 0 ? 0 : count / total
            const levelValue = levelNumber(s.level)
            const lampIndex = s.clear_type
            const entry = {
                title: s.title,
                level: s.level,
                rate,
                levelValue,
                lamp: config.LAMP_INDEX[lampIndex],
                lampIndex,
                updatedAt: s.clear_updated_at.getTime(),
                updatedLabel: isValidDate(s.clear_updated_at)
                    ? DateFormatter.format(s.clear_updated_at)
                    : "-"
            }
            candidates.push(entry)
            const current = pickByLamp.get(lampIndex)
            if (!current) {
                pickByLamp.set(lampIndex, entry)
                return
            }
            if (entry.rate > current.rate) {
                pickByLamp.set(lampIndex, entry)
                return
            }
            if (entry.rate !== current.rate) {
                return
            }
            if (entry.levelValue > current.levelValue) {
                pickByLamp.set(lampIndex, entry)
                return
            }
            if (entry.levelValue === current.levelValue && entry.updatedAt > current.updatedAt) {
                pickByLamp.set(lampIndex, entry)
            }
        })

    const base = Array.from(pickByLamp.values())
    const keyOf = (row: typeof base[number]) =>
        `${row.title}__${row.level}__${row.lampIndex}__${row.updatedAt}`
    const used = new Set(base.map(keyOf))
    const remaining = candidates
        .filter((row) => !used.has(keyOf(row)))
        .sort((a, b) => {
            if (b.rate !== a.rate) {
                return b.rate - a.rate
            }
            if (b.levelValue !== a.levelValue) {
                return b.levelValue - a.levelValue
            }
            return b.updatedAt - a.updatedAt
        })

    const merged = [...base]
    for (const row of remaining) {
        if (merged.length >= 5) {
            break
        }
        merged.push(row)
    }

    return merged
        .sort((a, b) => b.lampIndex - a.lampIndex)
        .map(({ title, level, lamp, updatedLabel }) => ({ title, level, lamp, updatedLabel }))
}

export const buildTableRows = (songs: SongDetail[]): TableRow[] => {
    return [...songs]
        .sort((a, b) => b.updated_at.getTime() - a.updated_at.getTime())
        .map((s) => ({
            level: s.level,
            title: s.title,
            titleWrapped: s.title.replace(/([/\-→（）()[\]])/g, "$1\u200B"),
            lamp: config.LAMP_INDEX[s.clear_type],
            rate: `${clampRate(s.score_rate()).toFixed(2)}%`,
            miss: formatMissCount(s.min_bp),
            last: isValidDate(s.updated_at) ? DateFormatter.format(s.updated_at) : "-"
        }))
}

export const buildLampCountsByLevel = (
    songs: SongDetail[],
    baseLevels: string[]
): LampCountsRow[] => {
    const map = new Map<string, number[]>()
    baseLevels.forEach((level) => map.set(level, config.LAMP_INDEX.map(() => 0)))
    songs.forEach((s) => {
        if (!map.has(s.level)) {
            map.set(s.level, config.LAMP_INDEX.map(() => 0))
        }
        const counts = map.get(s.level)
        if (!counts || counts[s.clear_type] === undefined) {
            return
        }
        counts[s.clear_type] += 1
    })
    return Array.from(map.entries()).map(([level, counts]) => ({
        level,
        counts,
        total: Math.max(counts.reduce((sum, v) => sum + v, 0), 1)
    }))
}

export const buildScoreRateBinsByLevel = (
    songs: SongDetail[],
    baseLevels: string[]
): ScoreRateRow[] => {
    const map = new Map<string, number[]>()
    baseLevels.forEach((level) => map.set(level, Array.from({ length: totalBins }, () => 0)))
    songs.forEach((s) => {
        if (s.clear_type === 0 || s.total_notes === 0) {
            return
        }
        if (!map.has(s.level)) {
            map.set(s.level, Array.from({ length: totalBins }, () => 0))
        }
        const bins = map.get(s.level)
        if (!bins) {
            return
        }
        const bounded = clampRate(s.score_rate())
        if (bounded >= 100) {
            bins[maxBinIndex] += 1
            return
        }
        const rankIndexHighToLow = Math.max(
            0,
            normalBoundsHighToLow.findIndex((b) => bounded >= b.lower)
        )
        const bounds = normalBoundsHighToLow[rankIndexHighToLow]
        const span = Math.max(bounds.upper - bounds.lower, 0)
        const within = span === 0 ? 0 : bounded - bounds.lower
        const binInRank = span === 0
            ? 0
            : Math.min(binsPerRank - 1, Math.floor((within / span) * binsPerRank))
        const rankIndexLowToHigh = normalRanksLowToHigh.length - 1 - rankIndexHighToLow
        const index = rankIndexLowToHigh * binsPerRank + binInRank
        bins[index] += 1
    })
    return Array.from(map.entries()).map(([level, bins]) => {
        const nonZeroCounts = bins.filter((count) => count > 0)
        const sortedCounts = [...nonZeroCounts].sort((a, b) => a - b)
        const thresholds = [0.2, 0.4, 0.6, 0.8].map((q) => quantile(sortedCounts, q))
        const alphaForCount = (count: number) => {
            if (count <= 0) {
                return 0
            }
            let step = thresholds.findIndex((t) => count <= t)
            if (step === -1) {
                step = thresholds.length
            }
            return stepAlphas[step]
        }
        const segments: ScoreRateSegment[] = []
        const binPercent = (index: number) => {
            if (index === maxBinIndex) {
                return { start: 100, end: 100 }
            }
            const rankIndex = Math.min(normalRanksLowToHigh.length - 1, Math.floor(index / binsPerRank))
            const bounds = normalBoundsLowToHigh[rankIndex]
            const step = (bounds.upper - bounds.lower) / binsPerRank
            const offset = index % binsPerRank
            return {
                start: bounds.lower + step * offset,
                end: bounds.lower + step * (offset + 1)
            }
        }
        let i = 0
        while (i < bins.length) {
            if (i === maxBinIndex) {
                const range = binPercent(i)
                const count = bins[i]
                segments.push({
                    len: 1,
                    count,
                    alpha: alphaForCount(count),
                    start: i,
                    end: i,
                    rank: "Max",
                    startPercent: range.start,
                    endPercent: range.end
                })
                i += 1
                continue
            }
            const currentRank = Math.min(normalRanksLowToHigh.length - 1, Math.floor(i / binsPerRank))
            const rankEnd = (currentRank + 1) * binsPerRank
            if (bins[i] === 0) {
                let j = i
                while (j < rankEnd && bins[j] === 0) {
                    j += 1
                }
                const run = j - i
                if (run >= 5) {
                    const startRange = binPercent(i)
                    const endRange = binPercent(j - 1)
                    segments.push({
                        len: run,
                        count: 0,
                        alpha: 0,
                        start: i,
                        end: j - 1,
                        rank: normalRanksLowToHigh[currentRank],
                        startPercent: startRange.start,
                        endPercent: endRange.end
                    })
                    i = j
                    continue
                }
            }
            const range = binPercent(i)
            const count = bins[i]
            const rank = normalRanksLowToHigh[currentRank]
            segments.push({
                len: 1,
                count,
                alpha: alphaForCount(count),
                start: i,
                end: i,
                rank,
                startPercent: range.start,
                endPercent: range.end
            })
            i += 1
        }
        return { level, segments }
    })
}

export const buildLastUpdated = (songs: SongDetail[]) => {
    const dates = songs
        .map((s) => s.updated_at)
        .filter((d) => isValidDate(d))
        .sort((a, b) => b.getTime() - a.getTime())
    return dates.length === 0 ? "-" : DateFormatter.format(dates[0])
}

export const buildViewDate = (): Date => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    d.setHours(0, 0, 0, 0)
    return d
}

export const calcRowsPerPage = (
    windowHeight: number,
    options: { base: number; rowHeight: number; minRows: number; maxRows: number }
): number => {
    const height = Math.max(windowHeight - options.base, 200)
    const autoRows = Math.max(options.minRows, Math.min(options.maxRows, Math.floor(height / options.rowHeight)))
    return autoRows
}

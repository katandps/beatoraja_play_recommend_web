const parsePositiveInt = (value: unknown): number => {
    if (Array.isArray(value)) {
        return parsePositiveInt(value[0])
    }
    if (typeof value === "number" && Number.isFinite(value)) {
        return value > 0 ? value : 0
    }
    if (typeof value === "string") {
        const parsed = parseInt(value, 10)
        return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
    }
    return 0
}

export const getUserIdFromRoute = (route: { params?: Record<string, unknown>; query?: Record<string, unknown> }, fallbackId: number): number => {
    const paramId = parsePositiveInt(route.params?.user_id)
    if (paramId > 0) {
        return paramId
    }
    const queryId = parsePositiveInt(route.query?.user_id)
    if (queryId > 0) {
        return queryId
    }
    return fallbackId
}

export const getTableIdFromRoute = (route: { query?: Record<string, unknown> }): number =>
    parsePositiveInt(route.query?.table_id)

export const buildTableUserShareUrl = (
    router: { resolve: (value: { path: string; query?: Record<string, string> }) => { href: string } },
    params: { userId: number; tableId?: number; state?: string },
    origin: string
): string => {
    const query: Record<string, string> = { state: params.state || "main" }
    if (params.tableId && params.tableId > 0) {
        query.table_id = String(params.tableId)
    }
    const resolved = router.resolve({ path: `/table-user/${params.userId}`, query })
    return new URL(resolved.href, origin).toString()
}

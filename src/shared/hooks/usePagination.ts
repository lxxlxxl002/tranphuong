import { useCallback, useEffect, useMemo, useState } from 'react'

interface Options {
  total: number
  pageSize?: number
  initialPage?: number
}

export function usePagination({ total, pageSize = 10, initialPage = 1 }: Options) {
  const [page, setPage] = useState(initialPage)
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const range = useMemo(
    () => ({
      start: total === 0 ? 0 : (page - 1) * pageSize + 1,
      end: Math.min(page * pageSize, total)
    }),
    [page, pageSize, total]
  )

  const next = useCallback(() => setPage((p) => Math.min(p + 1, totalPages)), [totalPages])
  const prev = useCallback(() => setPage((p) => Math.max(p - 1, 1)), [])
  const slice = useCallback(
    <T>(items: T[]): T[] => items.slice((page - 1) * pageSize, page * pageSize),
    [page, pageSize]
  )

  return {
    page,
    setPage,
    pageSize,
    totalPages,
    ...range,
    hasPrev: page > 1,
    hasNext: page < totalPages,
    next,
    prev,
    slice
  }
}
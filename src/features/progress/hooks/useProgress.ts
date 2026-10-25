import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { progressService } from '../services/progressService'
import { useProgressStore } from '../state/store'
import { selectSortBy } from '../state/selectors'
import { progressActions } from '../state/actions'
import { PROGRESS_QUERY_KEYS } from '../model/constants'
import { PROGRESS_CONFIG } from '../config/progress.config'

export function useProgress() {
  const query = useQuery({
    queryKey: PROGRESS_QUERY_KEYS.overview,
    queryFn: () => progressService.getProgress(),
    staleTime: PROGRESS_CONFIG.staleTime
  })
  const sortBy = useProgressStore(selectSortBy)

  const courses = useMemo(
    () => progressService.sortCourses(query.data?.courses ?? [], sortBy),
    [query.data, sortBy]
  )

  return {
    summary: query.data?.summary ?? null,
    courses,
    sortBy,
    setSortBy: progressActions.setSortBy,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  }
}
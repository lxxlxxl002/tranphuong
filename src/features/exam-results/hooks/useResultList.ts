import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { resultService } from '../services/resultService'
import { useExamResultsStore } from '../state/store'
import { selectListFilter } from '../state/selectors'
import { examResultsActions } from '../state/actions'
import { EXAM_RESULTS_QUERY_KEYS } from '../model/constants'
import { EXAM_RESULTS_CONFIG } from '../config/exam-results.config'

export function useResultList() {
  const query = useQuery({
    queryKey: EXAM_RESULTS_QUERY_KEYS.list,
    queryFn: () => resultService.getAttempts(),
    staleTime: EXAM_RESULTS_CONFIG.staleTime
  })
  const filter = useExamResultsStore(selectListFilter)

  const rows = useMemo(() => resultService.filterAttempts(query.data ?? [], filter), [query.data, filter])

  return {
    rows,
    total: query.data?.length ?? 0,
    filter,
    setFilter: examResultsActions.setListFilter,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  }
}
import { useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { resultService } from '../services/resultService'
import { useExamResultsStore } from '../state/store'
import { selectReviewFilter } from '../state/selectors'
import { examResultsActions } from '../state/actions'
import { EXAM_RESULTS_QUERY_KEYS } from '../model/constants'
import { EXAM_RESULTS_CONFIG } from '../config/exam-results.config'
import type { ReviewQuestion } from '../model/types'

const EMPTY: ReviewQuestion[] = []

export function useResultDetail(attemptId: string) {
  const query = useQuery({
    queryKey: EXAM_RESULTS_QUERY_KEYS.detail(attemptId),
    queryFn: () => resultService.getAttemptDetail(attemptId),
    enabled: !!attemptId,
    staleTime: EXAM_RESULTS_CONFIG.staleTime
  })
  const filter = useExamResultsStore(selectReviewFilter)

  useEffect(() => {
    examResultsActions.setReviewFilter('ALL')
  }, [attemptId])

  const all = query.data?.questions ?? EMPTY
  const questions = useMemo(() => resultService.filterQuestions(all, filter), [all, filter])
  const counts = useMemo(() => resultService.countOutcomes(all), [all])

  return {
    attempt: query.data ?? null,
    questions,
    counts,
    filter,
    setFilter: examResultsActions.setReviewFilter,
    answersRevealed: all.some((q) => q.correct.length > 0),
    outcomeOf: resultService.outcomeOf,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  }
}
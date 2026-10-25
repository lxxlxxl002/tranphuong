import { useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { usePagination } from '@/shared/hooks/usePagination'
import { questionService } from '../services/questionService'
import { useQuestionBankStore } from '../state/store'
import { selectEditor, selectImportOpen, selectQuestionSearch, selectTypeFilter } from '../state/selectors'
import { questionBankActions } from '../state/actions'
import { PAGE_SIZE, QUESTION_BANK_QUERY_KEYS } from '../model/constants'
import { QUESTION_BANK_CONFIG } from '../config/question-bank.config'
import type { Question } from '../model/types'

const EMPTY: Question[] = []

export function useQuestionList(courseId: string) {
  const query = useQuery({
    queryKey: QUESTION_BANK_QUERY_KEYS.questions(courseId),
    queryFn: () => questionService.getQuestions(courseId),
    enabled: !!courseId,
    staleTime: QUESTION_BANK_CONFIG.staleTime
  })
  const search = useQuestionBankStore(selectQuestionSearch)
  const typeFilter = useQuestionBankStore(selectTypeFilter)
  const editor = useQuestionBankStore(selectEditor)
  const importOpen = useQuestionBankStore(selectImportOpen)

  useEffect(() => {
    questionBankActions.resetFilters()
  }, [courseId])

  const all = query.data?.questions ?? EMPTY
  const filtered = useMemo(() => questionService.filter(all, typeFilter, search), [all, typeFilter, search])
  const counts = useMemo(() => questionService.countByType(all), [all])
  const pagination = usePagination({ total: filtered.length, pageSize: PAGE_SIZE })
  const { setPage } = pagination

  useEffect(() => {
    setPage(1)
  }, [search, typeFilter, setPage])

  const editingQuestion = useMemo(
    () => (editor.questionId ? all.find((q) => q.id === editor.questionId) ?? null : null),
    [all, editor.questionId]
  )

  return {
    courseTitle: query.data?.course.title ?? '',
    all,
    items: pagination.slice(filtered),
    filteredCount: filtered.length,
    counts,
    pagination,
    search,
    typeFilter,
    editor,
    editingQuestion,
    importOpen,
    ...questionBankActions,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  }
}
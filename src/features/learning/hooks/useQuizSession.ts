import { useEffect, useMemo } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from '@/app/providers/ToastProvider'
import { ApiError, getErrorMessage } from '@/shared/api/errors'
import { lessonService } from '../services/lessonService'
import { quizService } from '../services/quizService'
import { scoringService } from '../services/scoringService'
import { useQuizStore } from '../state/store'
import { selectAnswers, selectCurrent, selectFlagged, selectResult, selectSession } from '../state/selectors'
import { quizActions } from '../state/actions'
import { LEARNING_CONFIG } from '../config/learning.config'
import { LEARNING_QUERY_KEYS } from '../model/constants'
import type { Eligibility, QuizQuestion } from '../model/types'

const EMPTY: QuizQuestion[] = []
const NO_ELIGIBILITY: Eligibility = { ok: false, reason: null }

export function useQuizSession(courseId: string) {
  const content = useQuery({
    queryKey: LEARNING_QUERY_KEYS.course(courseId),
    queryFn: () => lessonService.getCourseContent(courseId),
    enabled: !!courseId,
    staleTime: LEARNING_CONFIG.staleTime
  })

  const session = useQuizStore(selectSession)
  const answers = useQuizStore(selectAnswers)
  const flagged = useQuizStore(selectFlagged)
  const current = useQuizStore(selectCurrent)
  const result = useQuizStore(selectResult)

  useEffect(() => {
    if (courseId) quizActions.restore(courseId)
  }, [courseId])

  const isActive = !!session && session.courseId === courseId
  const questions = isActive && session ? session.questions : EMPTY
  const answeredCount = useMemo(() => scoringService.countAnswered(questions, answers), [questions, answers])
  const eligibility = useMemo(
    () => (content.data ? quizService.checkEligibility(content.data) : NO_ELIGIBILITY),
    [content.data]
  )
  const quiz = content.data?.quiz ?? null

  const start = useMutation({
    mutationFn: () => {
      if (!quiz) return Promise.reject(new ApiError('NOT_FOUND', 'Khóa học chưa có bài kiểm tra'))
      return quizService.start(courseId, quiz)
    },
    onSuccess: (s) => quizActions.start(s),
    onError: (err) => toast.error(getErrorMessage(err))
  })

  return {
    quiz,
    courseTitle: content.data?.title ?? '',
    eligibility,
    isActive,
    questions,
    total: questions.length,
    current,
    currentQuestion: questions[current] ?? null,
    answers,
    flagged,
    answeredCount,
    unansweredCount: questions.length - answeredCount,
    deadline: isActive ? (session?.deadline ?? null) : null,
    result: result && result.courseId === courseId ? result : null,
    start: () => start.mutate(),
    isStarting: start.isPending,
    answer: quizActions.answer,
    toggleFlag: quizActions.toggleFlag,
    goTo: quizActions.goTo,
    next: quizActions.next,
    prev: quizActions.prev,
    closeResult: quizActions.closeResult,
    isLoading: content.isLoading,
    isError: content.isError,
    error: content.error,
    refetch: content.refetch
  }
}
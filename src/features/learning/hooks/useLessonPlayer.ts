import { useCallback, useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router'
import { toast } from '@/app/providers/ToastProvider'
import { getErrorMessage } from '@/shared/api/errors'
import { lessonService } from '../services/lessonService'
import { quizService } from '../services/quizService'
import { LEARNING_CONFIG } from '../config/learning.config'
import { LEARNING_QUERY_KEYS, RELATED_QUERY_ROOTS } from '../model/constants'
import { quizPath } from '../lib/utils'
import type { CourseContent, Eligibility, Lesson } from '../model/types'

const EMPTY: Lesson[] = []
const NO_ELIGIBILITY: Eligibility = { ok: false, reason: null }

export function useLessonPlayer(courseId: string) {
  const queryClient = useQueryClient()
  const [params, setParams] = useSearchParams()
  const key = LEARNING_QUERY_KEYS.course(courseId)

  const query = useQuery({
    queryKey: key,
    queryFn: () => lessonService.getCourseContent(courseId),
    enabled: !!courseId,
    staleTime: LEARNING_CONFIG.staleTime
  })

  const content = query.data
  const lessons = content?.lessons ?? EMPTY
  const requestedId = params.get(LEARNING_CONFIG.lessonParam)

  const lesson = useMemo(
    () => lessons.find((l) => l.id === requestedId) ?? lessonService.pickInitialLesson(lessons),
    [lessons, requestedId]
  )
  const { prev, next } = useMemo(() => lessonService.neighbors(lessons, lesson?.id ?? null), [lessons, lesson])
  const progress = useMemo(() => lessonService.computeProgress(lessons), [lessons])
  const eligibility = useMemo(() => (content ? quizService.checkEligibility(content) : NO_ELIGIBILITY), [content])

  const select = useCallback(
    (id: string) => {
      setParams((current) => {
        const nextParams = new URLSearchParams(current)
        nextParams.set(LEARNING_CONFIG.lessonParam, id)
        return nextParams
      })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [setParams]
  )

  const { mutate: completeMutate, isPending: isCompleting } = useMutation({
    mutationFn: (lessonId: string) => lessonService.completeLesson(courseId, lessonId),
    onMutate: async (lessonId) => {
      await queryClient.cancelQueries({ queryKey: key })
      const snapshot = queryClient.getQueryData<CourseContent>(key)
      queryClient.setQueryData<CourseContent>(key, (d) => (d ? lessonService.markCompleted(d, lessonId) : d))
      return { snapshot }
    },
    onError: (err, _lessonId, ctx) => {
      if (ctx?.snapshot) queryClient.setQueryData(key, ctx.snapshot)
      toast.error(getErrorMessage(err))
    },
    onSettled: () => {
      RELATED_QUERY_ROOTS.forEach((root) => void queryClient.invalidateQueries({ queryKey: [root] }))
    }
  })

  const completeCurrent = useCallback(() => {
    if (!lesson || lesson.completed) return
    const target = next
    completeMutate(lesson.id, {
      onSuccess: () => {
        toast.success('Đã hoàn thành bài học')
        if (LEARNING_CONFIG.autoNextOnComplete && target) select(target.id)
      }
    })
  }, [lesson, next, completeMutate, select])

  return {
    content,
    lessons,
    lesson,
    prev,
    next,
    progress,
    eligibility,
    select,
    completeCurrent,
    isCompleting,
    quizPath: quizPath(courseId),
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  }
}
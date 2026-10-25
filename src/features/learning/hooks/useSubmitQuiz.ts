import { useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/app/providers/ToastProvider'
import { ApiError, getErrorMessage } from '@/shared/api/errors'
import { quizService } from '../services/quizService'
import { useQuizStore } from '../state/store'
import { quizActions } from '../state/actions'
import { LEARNING_QUERY_KEYS, RELATED_QUERY_ROOTS, SUBMIT_MUTATION_KEY } from '../model/constants'

export function useSubmitQuiz(courseId: string) {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationKey: SUBMIT_MUTATION_KEY,
    mutationFn: () => {
      const { session, answers } = useQuizStore.getState()
      if (!session) return Promise.reject(new ApiError('VALIDATION', 'Không có bài làm để nộp'))
      return quizService.submit(session, answers)
    },
    onSuccess: (result) => {
      quizActions.setResult(result)
      void queryClient.invalidateQueries({ queryKey: LEARNING_QUERY_KEYS.course(courseId) })
      RELATED_QUERY_ROOTS.forEach((root) => void queryClient.invalidateQueries({ queryKey: [root] }))
    },
    onError: (err) => toast.error(getErrorMessage(err))
  })

  /** Chống nộp 2 lần (bấm nộp + hết giờ cùng lúc) */
  const submit = useCallback(() => {
    if (queryClient.isMutating({ mutationKey: SUBMIT_MUTATION_KEY }) > 0) return
    if (!useQuizStore.getState().session) return
    mutate()
  }, [mutate, queryClient])

  return { submit, isSubmitting: isPending }
}
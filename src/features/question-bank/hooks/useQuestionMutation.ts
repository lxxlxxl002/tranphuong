import { useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/app/providers/ToastProvider'
import { getErrorMessage } from '@/shared/api/errors'
import { questionService } from '../services/questionService'
import { questionImportService } from '../services/questionImportService'
import { QUESTION_BANK_QUERY_KEYS, RELATED_QUERY_ROOTS } from '../model/constants'
import type { QuestionInput } from '../model/types'

export function useQuestionMutation(courseId: string) {
  const qc = useQueryClient()

  const refresh = useCallback(() => {
    void qc.invalidateQueries({ queryKey: QUESTION_BANK_QUERY_KEYS.all })
    RELATED_QUERY_ROOTS.forEach((root) => void qc.invalidateQueries({ queryKey: [root] }))
  }, [qc])

  const onError = (err: unknown) => toast.error(getErrorMessage(err))

  const create = useMutation({
    mutationFn: (input: QuestionInput) => questionService.create(courseId, input),
    onSuccess: () => {
      toast.success('Đã thêm câu hỏi')
      refresh()
    },
    onError
  })

  const update = useMutation({
    mutationFn: (v: { questionId: string; input: QuestionInput }) => questionService.update(v.questionId, v.input),
    onSuccess: () => {
      toast.success('Đã lưu câu hỏi')
      refresh()
    },
    onError
  })

  const remove = useMutation({
    mutationFn: (questionId: string) => questionService.remove(questionId),
    onSuccess: () => {
      toast.success('Đã xóa câu hỏi')
      refresh()
    },
    onError
  })

  const bulk = useMutation({
    mutationFn: (inputs: QuestionInput[]) => questionService.bulkCreate(courseId, inputs),
    onSuccess: (n) => {
      toast.success(`Đã nhập ${n} câu hỏi`)
      refresh()
    },
    onError
  })

  const downloadTemplate = useCallback(async () => {
    try {
      await questionImportService.downloadTemplate()
    } catch (err) {
      onError(err)
    }
  }, [])

  return {
    createQuestion: create.mutateAsync,
    updateQuestion: update.mutateAsync,
    deleteQuestion: remove.mutateAsync,
    importQuestions: bulk.mutateAsync,
    parseFile: questionImportService.parseFile,
    summarize: questionImportService.summarize,
    downloadTemplate,
    isSaving: create.isPending || update.isPending,
    isDeleting: remove.isPending,
    isImporting: bulk.isPending
  }
}
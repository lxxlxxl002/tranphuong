import { questionBankClient } from './client'
import { QUESTION_BANK_ENDPOINTS as E } from './endpoints'

export const createQuestionRequest = (courseId: string, input: Record<string, unknown>) =>
  questionBankClient.mutate<unknown>(E.create, { courseId, input })

export const updateQuestionRequest = (questionId: string, input: Record<string, unknown>) =>
  questionBankClient.mutate<unknown>(E.update, { questionId, input })

export const deleteQuestionRequest = (questionId: string) => questionBankClient.mutate<void>(E.remove, { questionId })

/** Nhập hàng loạt — trả về số câu đã tạo */
export const bulkCreateQuestionsRequest = (courseId: string, inputs: Record<string, unknown>[]) =>
  questionBankClient.mutate<unknown>(E.bulkCreate, { courseId, inputs })
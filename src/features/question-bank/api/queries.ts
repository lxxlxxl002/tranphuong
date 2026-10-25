import { questionBankClient } from './client'
import { QUESTION_BANK_ENDPOINTS } from './endpoints'

export const fetchBanks = () => questionBankClient.query<unknown>(QUESTION_BANK_ENDPOINTS.banks)

export const fetchBankQuestions = (courseId: string) =>
  questionBankClient.query<unknown>(QUESTION_BANK_ENDPOINTS.questions, { courseId })
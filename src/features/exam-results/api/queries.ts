import { examResultsClient } from './client'
import { EXAM_RESULTS_ENDPOINTS } from './endpoints'

export const fetchAttempts = () => examResultsClient.query<unknown>(EXAM_RESULTS_ENDPOINTS.list)

export const fetchAttemptDetail = (attemptId: string) =>
  examResultsClient.query<unknown>(EXAM_RESULTS_ENDPOINTS.detail, { attemptId })
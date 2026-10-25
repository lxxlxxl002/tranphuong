import type { QuizAnswers } from '../model/types'
import { learningClient } from './client'
import { LEARNING_ENDPOINTS } from './endpoints'

export const completeLessonRequest = (courseId: string, lessonId: string) =>
  learningClient.mutate<void>(LEARNING_ENDPOINTS.completeLesson, { courseId, lessonId })

/** Tạo lượt làm bài mới — backend kiểm tra điều kiện + trả đề (không kèm đáp án) */
export const startQuizRequest = (courseId: string) =>
  learningClient.mutate<unknown>(LEARNING_ENDPOINTS.quizStart, { courseId })

export const submitQuizRequest = (payload: {
  attemptId: string
  courseId: string
  answers: QuizAnswers
  timeSpentSec: number
}) => learningClient.mutate<unknown>(LEARNING_ENDPOINTS.quizSubmit, payload)
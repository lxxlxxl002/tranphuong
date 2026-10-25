import { learningClient } from './client'
import { LEARNING_ENDPOINTS } from './endpoints'

export const fetchCourseContent = (courseId: string) =>
  learningClient.query<unknown>(LEARNING_ENDPOINTS.course, { courseId })
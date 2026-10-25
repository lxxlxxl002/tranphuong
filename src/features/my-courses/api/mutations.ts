import { myCoursesClient } from './client'
import { MY_COURSES_ENDPOINTS } from './endpoints'

/** Ghi nhận học viên bắt đầu học khóa */
export const startCourseRequest = (courseId: string) =>
  myCoursesClient.mutate<void>(MY_COURSES_ENDPOINTS.start, { courseId })
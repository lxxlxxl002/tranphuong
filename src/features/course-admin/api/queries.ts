import { courseAdminClient } from './client'
import { COURSE_ADMIN_ENDPOINTS } from './endpoints'

export const fetchAdminCourses = () => courseAdminClient.query<unknown>(COURSE_ADMIN_ENDPOINTS.list)

export const fetchAdminCourseDetail = (courseId: string) =>
  courseAdminClient.query<unknown>(COURSE_ADMIN_ENDPOINTS.detail, { courseId })
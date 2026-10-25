import { myCoursesClient } from './client'
import { MY_COURSES_ENDPOINTS } from './endpoints'

export const fetchMyCourses = () => myCoursesClient.query<unknown>(MY_COURSES_ENDPOINTS.list)
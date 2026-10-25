import { lazy } from 'react'
import { HOME_CRUMB, PATHS, type Crumb, type FeatureRoute } from '@/app/router/paths'

const CoursePlayerPage = lazy(() => import('./ui/pages/CoursePlayer'))
const QuizPage = lazy(() => import('./ui/pages/Quiz'))

const MY_COURSES_CRUMB: Crumb = { label: 'Khóa học của tôi', to: PATHS.myCourses }

export const learningRoutes: FeatureRoute[] = [
  {
    path: PATHS.learn,
    Component: CoursePlayerPage,
    meta: { title: 'Học bài', crumbs: [HOME_CRUMB, MY_COURSES_CRUMB, { label: 'Học bài' }], permission: 'my-courses:view' }
  },
  {
    path: PATHS.quiz,
    Component: QuizPage,
    meta: { title: 'Bài kiểm tra', crumbs: [HOME_CRUMB, MY_COURSES_CRUMB, { label: 'Bài kiểm tra' }], permission: 'my-courses:view' }
  }
]
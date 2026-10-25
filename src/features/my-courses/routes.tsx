import { lazy } from 'react'
import { HOME_CRUMB, PATHS, type FeatureRoute } from '@/app/router/paths'

const ListPage = lazy(() => import('./ui/pages/List'))

export const myCoursesRoutes: FeatureRoute[] = [
  {
    path: PATHS.myCourses,
    Component: ListPage,
    meta: { title: 'Khóa học của tôi', crumbs: [HOME_CRUMB, { label: 'Khóa học của tôi' }], permission: 'my-courses:view' }
  }
]
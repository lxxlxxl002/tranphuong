import { lazy } from 'react'
import { ADMIN_CRUMB, HOME_CRUMB, PATHS, type Crumb, type FeatureRoute } from '@/app/router/paths'

const ListPage = lazy(() => import('./ui/pages/List'))
const DetailPage = lazy(() => import('./ui/pages/Detail'))
const FormPage = lazy(() => import('./ui/pages/Form'))

const COURSES_CRUMB: Crumb = { label: 'Khóa học', to: PATHS.courseAdmin }

export const courseAdminRoutes: FeatureRoute[] = [
  {
    path: PATHS.courseAdmin,
    Component: ListPage,
    meta: { title: 'Quản lý khóa học', crumbs: [HOME_CRUMB, ADMIN_CRUMB, { label: 'Khóa học' }], permission: 'course-admin:view' }
  },
  {
    path: PATHS.courseAdminNew,
    Component: FormPage,
    meta: { title: 'Tạo khóa học', crumbs: [HOME_CRUMB, ADMIN_CRUMB, COURSES_CRUMB, { label: 'Tạo mới' }], permission: 'course-admin:create' }
  },
  {
    path: PATHS.courseAdminDetail,
    Component: DetailPage,
    meta: { title: 'Quản lý bài học', crumbs: [HOME_CRUMB, ADMIN_CRUMB, COURSES_CRUMB, { label: 'Quản lý bài học' }], permission: 'course-admin:view' }
  },
  {
    path: PATHS.courseAdminEdit,
    Component: FormPage,
    meta: { title: 'Chỉnh sửa khóa học', crumbs: [HOME_CRUMB, ADMIN_CRUMB, COURSES_CRUMB, { label: 'Chỉnh sửa' }], permission: 'course-admin:update' }
  }
]
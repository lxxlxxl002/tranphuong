import { lazy } from 'react'
import { ADMIN_CRUMB, HOME_CRUMB, PATHS, type Crumb, type FeatureRoute } from '@/app/router/paths'

const ListPage = lazy(() => import('./ui/pages/List'))
const FormPage = lazy(() => import('./ui/pages/Form'))

const USERS_CRUMB: Crumb = { label: 'Người dùng', to: PATHS.users }

export const usersRoutes: FeatureRoute[] = [
  {
    path: PATHS.users,
    Component: ListPage,
    meta: { title: 'Quản trị người dùng', crumbs: [HOME_CRUMB, ADMIN_CRUMB, { label: 'Người dùng' }], permission: 'users:view' }
  },
  {
    path: PATHS.userNew,
    Component: FormPage,
    meta: { title: 'Thêm người dùng', crumbs: [HOME_CRUMB, ADMIN_CRUMB, USERS_CRUMB, { label: 'Thêm mới' }], permission: 'users:create' }
  },
  {
    path: PATHS.userEdit,
    Component: FormPage,
    meta: { title: 'Chỉnh sửa người dùng', crumbs: [HOME_CRUMB, ADMIN_CRUMB, USERS_CRUMB, { label: 'Chỉnh sửa' }], permission: 'users:update' }
  }
]
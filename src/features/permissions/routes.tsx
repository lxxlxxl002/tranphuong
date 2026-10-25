import { lazy } from 'react'
import { ADMIN_CRUMB, HOME_CRUMB, PATHS, type FeatureRoute } from '@/app/router/paths'

const MatrixPage = lazy(() => import('./ui/pages/Matrix'))

export const permissionsRoutes: FeatureRoute[] = [
  {
    path: PATHS.permissions,
    Component: MatrixPage,
    meta: { title: 'Phân quyền', crumbs: [HOME_CRUMB, ADMIN_CRUMB, { label: 'Phân quyền' }], permission: 'permissions:view' }
  }
]
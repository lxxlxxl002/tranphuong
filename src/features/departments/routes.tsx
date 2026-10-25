import { lazy } from 'react'
import { ADMIN_CRUMB, HOME_CRUMB, PATHS, type FeatureRoute } from '@/app/router/paths'

const ListPage = lazy(() => import('./ui/pages/List'))

export const departmentsRoutes: FeatureRoute[] = [
  {
    path: PATHS.departments,
    Component: ListPage,
    meta: { title: 'Phòng / Ban', crumbs: [HOME_CRUMB, ADMIN_CRUMB, { label: 'Phòng / Ban' }], permission: 'departments:view' }
  }
]
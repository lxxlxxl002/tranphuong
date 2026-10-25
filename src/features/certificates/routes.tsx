import { lazy } from 'react'
import { HOME_CRUMB, PATHS, type FeatureRoute } from '@/app/router/paths'

const ListPage = lazy(() => import('./ui/pages/List'))

export const certificatesRoutes: FeatureRoute[] = [
  {
    path: PATHS.certificates,
    Component: ListPage,
    meta: { title: 'Chứng chỉ', crumbs: [HOME_CRUMB, { label: 'Chứng chỉ' }], permission: 'certificates:view' }
  }
]
import { lazy } from 'react'
import { ADMIN_CRUMB, HOME_CRUMB, PATHS, type FeatureRoute } from '@/app/router/paths'

const OverviewPage = lazy(() => import('./ui/pages/Overview'))

export const reportsRoutes: FeatureRoute[] = [
  {
    path: PATHS.reports,
    Component: OverviewPage,
    meta: { title: 'Báo cáo thống kê', crumbs: [HOME_CRUMB, ADMIN_CRUMB, { label: 'Báo cáo thống kê' }], permission: 'reports:view' }
  }
]
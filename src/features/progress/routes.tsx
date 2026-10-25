import { lazy } from 'react'
import { HOME_CRUMB, PATHS, type FeatureRoute } from '@/app/router/paths'

const OverviewPage = lazy(() => import('./ui/pages/Overview'))

export const progressRoutes: FeatureRoute[] = [
  {
    path: PATHS.progress,
    Component: OverviewPage,
    meta: { title: 'Tiến độ học tập', crumbs: [HOME_CRUMB, { label: 'Tiến độ học tập' }], permission: 'progress:view' }
  }
]
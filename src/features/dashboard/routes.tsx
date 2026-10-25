import { lazy } from 'react'
import { PATHS, type FeatureRoute } from '@/app/router/paths'

const HomePage = lazy(() => import('./ui/pages/Home'))

export const dashboardRoutes: FeatureRoute[] = [
  { path: PATHS.home, Component: HomePage, meta: { title: 'Trang chủ', permission: 'dashboard:view' } }
]
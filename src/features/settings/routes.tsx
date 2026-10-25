import { lazy } from 'react'
import { ADMIN_CRUMB, HOME_CRUMB, PATHS, type FeatureRoute } from '@/app/router/paths'

const SettingsPage = lazy(() => import('./ui/pages/Settings'))

export const settingsRoutes: FeatureRoute[] = [
  {
    path: PATHS.settings,
    Component: SettingsPage,
    meta: { title: 'Cài đặt hệ thống', crumbs: [HOME_CRUMB, ADMIN_CRUMB, { label: 'Cài đặt hệ thống' }], permission: 'settings:view' }
  }
]
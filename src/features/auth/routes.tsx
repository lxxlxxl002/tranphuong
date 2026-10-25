import { lazy } from 'react'
import { PATHS, type FeatureRoute } from '@/app/router/paths'

const LoginPage = lazy(() => import('./ui/pages/Login'))

export const authRoutes: FeatureRoute[] = [
  { path: PATHS.login, Component: LoginPage, meta: { title: 'Đăng nhập' }, public: true }
]
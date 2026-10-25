import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { selectIsAuthenticated, useAuthStore } from '@/features/auth'
import { PATHS } from './paths'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuth = useAuthStore(selectIsAuthenticated)
  const location = useLocation()
  if (!isAuth) {
    return <Navigate to={PATHS.login} replace state={{ from: location.pathname + location.search }} />
  }
  return <>{children}</>
}

export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const isAuth = useAuthStore(selectIsAuthenticated)
  const location = useLocation()
  if (isAuth) {
    const from = (location.state as { from?: string } | null)?.from ?? PATHS.home
    return <Navigate to={from} replace />
  }
  return <>{children}</>
}
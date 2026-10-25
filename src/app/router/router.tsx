import { Suspense } from 'react'
import { createBrowserRouter, Link, type RouteObject } from 'react-router'
import { Loader2, SearchX } from 'lucide-react'
import { AppLayout } from '@/app/layout/AppLayout'
import { Card } from '@/shared/ui/Card'
import { EmptyState } from '@/shared/ui/EmptyState'
import { PATHS, type FeatureRoute } from './paths'
import { privateRoutes, publicRoutes } from './routeRegistry'
import { ProtectedRoute, PublicOnlyRoute } from './ProtectedRoute'
import { ForbiddenView, RoleGuard } from './RoleGuard'

function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-ink-faint">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  )
}

function NotFound() {
  return (
    <Card>
      <EmptyState
        icon={SearchX}
        title="Không tìm thấy trang"
        description="Đường dẫn không tồn tại hoặc đã bị thay đổi."
        action={
          <Link to={PATHS.home} className="text-sm font-semibold text-brand-600 hover:underline">
            Về trang chủ
          </Link>
        }
      />
    </Card>
  )
}

const toPrivate = (r: FeatureRoute): RouteObject => ({
  path: r.path,
  handle: r.meta,
  element: (
    <RoleGuard permission={r.meta.permission}>
      <Suspense fallback={<PageLoader />}>
        <r.Component />
      </Suspense>
    </RoleGuard>
  )
})

const toPublic = (r: FeatureRoute): RouteObject => ({
  path: r.path,
  handle: r.meta,
  element: (
    <PublicOnlyRoute>
      <Suspense fallback={<PageLoader />}>
        <r.Component />
      </Suspense>
    </PublicOnlyRoute>
  )
})

export const router = createBrowserRouter([
  ...publicRoutes.map(toPublic),
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      ...privateRoutes.map(toPrivate),
      { path: PATHS.forbidden, element: <ForbiddenView />, handle: { title: 'Không có quyền truy cập' } },
      { path: '*', element: <NotFound />, handle: { title: 'Không tìm thấy trang' } }
    ]
  }
])
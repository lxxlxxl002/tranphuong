import { lazy } from 'react'
import { HOME_CRUMB, PATHS, type Crumb, type FeatureRoute } from '@/app/router/paths'

const ListPage = lazy(() => import('./ui/pages/List'))
const DetailPage = lazy(() => import('./ui/pages/Detail'))

const RESULTS_CRUMB: Crumb = { label: 'Kết quả kiểm tra', to: PATHS.examResults }

export const examResultsRoutes: FeatureRoute[] = [
  {
    path: PATHS.examResults,
    Component: ListPage,
    meta: { title: 'Kết quả kiểm tra', crumbs: [HOME_CRUMB, { label: 'Kết quả kiểm tra' }], permission: 'exam-results:view' }
  },
  {
    path: PATHS.examResultDetail,
    Component: DetailPage,
    meta: { title: 'Chi tiết bài làm', crumbs: [HOME_CRUMB, RESULTS_CRUMB, { label: 'Chi tiết bài làm' }], permission: 'exam-results:view' }
  }
]
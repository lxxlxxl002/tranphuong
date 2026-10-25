import { lazy } from 'react'
import { ADMIN_CRUMB, HOME_CRUMB, PATHS, type Crumb, type FeatureRoute } from '@/app/router/paths'

const ListPage = lazy(() => import('./ui/pages/List'))
const DetailPage = lazy(() => import('./ui/pages/Detail'))

const BANK_CRUMB: Crumb = { label: 'Ngân hàng câu hỏi', to: PATHS.questionBank }

export const questionBankRoutes: FeatureRoute[] = [
  {
    path: PATHS.questionBank,
    Component: ListPage,
    meta: { title: 'Ngân hàng câu hỏi', crumbs: [HOME_CRUMB, ADMIN_CRUMB, { label: 'Ngân hàng câu hỏi' }], permission: 'question-bank:view' }
  },
  {
    path: PATHS.questionBankDetail,
    Component: DetailPage,
    meta: { title: 'Quản lý câu hỏi', crumbs: [HOME_CRUMB, ADMIN_CRUMB, BANK_CRUMB, { label: 'Quản lý câu hỏi' }], permission: 'question-bank:view' }
  }
]
import type { ComponentType, LazyExoticComponent } from 'react'
import type { PermissionKey } from '@/shared/constants/permissions'

export const PATHS = {
  login: '/dang-nhap',
  home: '/',
  forbidden: '/403',

  myCourses: '/khoa-hoc-cua-toi',
  learn: '/hoc/:courseId',
  quiz: '/hoc/:courseId/kiem-tra',
  progress: '/tien-do-hoc-tap',
  examResults: '/ket-qua-kiem-tra',
  examResultDetail: '/ket-qua-kiem-tra/:attemptId',
  certificates: '/chung-chi',

  courseAdmin: '/quan-tri/khoa-hoc',
  courseAdminNew: '/quan-tri/khoa-hoc/tao-moi',
  courseAdminDetail: '/quan-tri/khoa-hoc/:courseId',
  courseAdminEdit: '/quan-tri/khoa-hoc/:courseId/chinh-sua',
  questionBank: '/quan-tri/ngan-hang-cau-hoi',
  questionBankDetail: '/quan-tri/ngan-hang-cau-hoi/:courseId',
  reports: '/quan-tri/bao-cao-thong-ke',
  users: '/quan-tri/nguoi-dung',
  userNew: '/quan-tri/nguoi-dung/them-moi',
  userEdit: '/quan-tri/nguoi-dung/:userId/chinh-sua',
  departments: '/quan-tri/phong-ban',
  permissions: '/quan-tri/phan-quyen',
  settings: '/quan-tri/cai-dat'
} as const

export interface Crumb {
  label: string
  to?: string
}

export interface RouteMeta {
  title: string
  crumbs?: Crumb[]
  permission?: PermissionKey
}

export interface FeatureRoute {
  path: string
  Component: ComponentType | LazyExoticComponent<ComponentType>
  meta: RouteMeta
  /** true: không cần đăng nhập, không có layout */
  public?: boolean
}

export const HOME_CRUMB: Crumb = { label: 'Trang chủ', to: PATHS.home }
export const ADMIN_CRUMB: Crumb = { label: 'Quản trị' }

export const buildPath = (pattern: string, params: Record<string, string | number>): string =>
  pattern.replace(/:(\w+)/g, (_, key: string) => encodeURIComponent(String(params[key] ?? '')))
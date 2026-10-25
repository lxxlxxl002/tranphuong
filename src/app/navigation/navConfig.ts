import {
  Award,
  BarChart3,
  BookOpen,
  Building2,
  ClipboardCheck,
  Database,
  GraduationCap,
  LayoutGrid,
  Settings,
  ShieldCheck,
  TrendingUp,
  Users,
  type LucideIcon
} from 'lucide-react'
import { PATHS } from '@/app/router/paths'
import type { PermissionKey } from '@/shared/constants/permissions'

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
  permission?: PermissionKey
  end?: boolean
}

export interface NavGroup {
  key: string
  title?: string
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    key: 'learner',
    items: [
      { label: 'Trang chủ', to: PATHS.home, icon: LayoutGrid, permission: 'dashboard:view', end: true },
      { label: 'Khóa học của tôi', to: PATHS.myCourses, icon: BookOpen, permission: 'my-courses:view' },
      { label: 'Tiến độ học tập', to: PATHS.progress, icon: TrendingUp, permission: 'progress:view' },
      { label: 'Kết quả kiểm tra', to: PATHS.examResults, icon: ClipboardCheck, permission: 'exam-results:view' },
      { label: 'Chứng chỉ', to: PATHS.certificates, icon: Award, permission: 'certificates:view' }
    ]
  },
  {
    key: 'teaching',
    title: 'Giảng dạy',
    items: [
      { label: 'Quản lý khóa học', to: PATHS.courseAdmin, icon: GraduationCap, permission: 'course-admin:view' },
      { label: 'Ngân hàng câu hỏi', to: PATHS.questionBank, icon: Database, permission: 'question-bank:view' }
    ]
  },
  {
    key: 'report',
    title: 'Báo cáo',
    items: [{ label: 'Báo cáo thống kê', to: PATHS.reports, icon: BarChart3, permission: 'reports:view' }]
  },
  {
    key: 'system',
    title: 'Quản trị hệ thống',
    items: [
      { label: 'Quản trị người dùng', to: PATHS.users, icon: Users, permission: 'users:view' },
      { label: 'Phòng / Ban', to: PATHS.departments, icon: Building2, permission: 'departments:view' },
      { label: 'Phân quyền', to: PATHS.permissions, icon: ShieldCheck, permission: 'permissions:view' },
      { label: 'Cài đặt hệ thống', to: PATHS.settings, icon: Settings, permission: 'settings:view' }
    ]
  }
]
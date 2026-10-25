import type { DashboardStats, DeptStat } from '../model/types'

const stats: DashboardStats = {
  totalUsers: 9,
  totalCourses: 3,
  totalEnrollments: 8,
  totalCertificates: 4,
  roleDistribution: [
    { role: 'ADMIN', count: 1 },
    { role: 'DEPT_LEAD', count: 1 },
    { role: 'LECTURER', count: 2 },
    { role: 'LEARNER', count: 5 }
  ]
}

const deptStats: DeptStat[] = [
  { departmentId: 'P1', departmentName: 'Phòng Tổng hợp và chính sách', staffCount: 3, activeRate: 0, completionRate: 100 },
  { departmentId: 'P2', departmentName: 'Phòng Quản lý, giám sát NHTMNN', staffCount: 1, activeRate: 0, completionRate: 33 },
  { departmentId: 'P3', departmentName: 'Phòng QLGS NHNNg, TCTD hợp tác và tổ chức khác', staffCount: 1, activeRate: 0, completionRate: 0 },
  { departmentId: 'P4', departmentName: 'Phòng Quản lý, giám sát NHTMCP1', staffCount: 1, activeRate: 0, completionRate: 0 },
  { departmentId: 'P5', departmentName: 'Phòng Quản lý, giám sát NHTMCP2', staffCount: 1, activeRate: 0, completionRate: 0 },
  { departmentId: 'P6', departmentName: 'Phòng Quản lý, giám sát TCTD phi NH', staffCount: 1, activeRate: 0, completionRate: 0 }
]

export const DASHBOARD_CONFIG = {
  timeout: 20_000,
  staleTime: 60_000,
  demoDelayMs: 300,
  /** Ảnh hero thật (đặt trong /public) — để trống dùng minh họa vẽ bằng code */
  heroImageUrl: (import.meta.env.VITE_HERO_IMAGE_URL as string | undefined) || '/hero-banner.jpg',
  demo: { stats, deptStats }
}

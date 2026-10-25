import type { ReportStats, StaffReport } from '../model/types'
import type { Role } from '@/shared/constants/roles'

const S = (
  userId: string,
  fullName: string,
  email: string,
  departmentId: string | null,
  departmentName: string,
  role: Role,
  completedCourses: number,
  averageScore: number | null,
  completionRate: number
): StaffReport => ({ userId, fullName, email, departmentId, departmentName, role, completedCourses, enrolledCourses: 3, averageScore, completionRate })

const staff: StaffReport[] = [
  S('u-admin', 'Quản trị viên', 'admin@sbv.gov.vn', null, '', 'ADMIN', 1, 94, 33),
  S('u-phuong', 'Trần Phương', 'phuongtran195@gmail.com', 'P1', 'Phòng Tổng hợp và chính sách', 'DEPT_LEAD', 1, 100, 100),
  S('u-tu', 'Phạm Minh Tú', 'tu.phamminh@sbv.gov.vn', 'P2', 'Phòng Quản lý, giám sát NHTMNN', 'LEARNER', 1, 82, 33),
  S('u-duong', 'Ngô Đức Dương', 'duong.ngoduc@sbv.gov.vn', 'P3', 'Phòng QLGS NHNNg, TCTD hợp tác và tổ chức khác', 'LECTURER', 0, null, 0),
  S('u-thien', 'Vũ Tuấn Thiên', 'thien.vu@sbv.gov.vn', 'P4', 'Phòng Quản lý, giám sát NHTMCP1', 'LEARNER', 0, null, 0),
  S('u-thanh', 'Vũ Hoài Thanh', 'thanh.vuhoai@sbv.gov.vn', 'P1', 'Phòng Tổng hợp và chính sách', 'LEARNER', 3, 88, 100),
  S('u-linh', 'Trần Thảo Linh', 'linh.tranthao@sbv.gov.vn', 'P1', 'Phòng Tổng hợp và chính sách', 'LEARNER', 0, null, 0),
  S('u-my', 'Nguyễn Hà My', 'my.nguyenha@sbv.gov.vn', 'P5', 'Phòng Quản lý, giám sát NHTMCP2', 'LEARNER', 0, null, 0),
  S('u-chi', 'Nguyễn Phương Chi', 'chi.nguyenphuong@sbv.gov.vn', 'P6', 'Phòng Quản lý, giám sát TCTD phi NH', 'LECTURER', 0, null, 0)
]

const stats: ReportStats = { totalUsers: 9, totalCourses: 3, totalEnrollments: 8, totalCertificates: 4 }

export const REPORTS_CONFIG = {
  timeout: 30_000,
  staleTime: 60_000,
  demoDelayMs: 300,
  orgName: 'Cục Quản lý, Giám sát Tổ chức Tín dụng',
  reportTitle: 'BÁO CÁO KẾT QUẢ ĐÀO TẠO TRỰC TUYẾN',
  demo: { stats, staff }
}
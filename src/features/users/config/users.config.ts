import type { Role } from '@/shared/constants/roles'
import type { AdminUser, DepartmentOption } from '../model/types'

const departments: DepartmentOption[] = [
  { id: 'P1', code: 'P1', name: 'Phòng Tổng hợp và chính sách' },
  { id: 'P2', code: 'P2', name: 'Phòng Quản lý, giám sát NHTMNN' },
  { id: 'P3', code: 'P3', name: 'Phòng QLGS NHNNg, TCTD hợp tác và tổ chức khác' },
  { id: 'P4', code: 'P4', name: 'Phòng Quản lý, giám sát NHTMCP1' },
  { id: 'P5', code: 'P5', name: 'Phòng Quản lý, giám sát NHTMCP2' },
  { id: 'P6', code: 'P6', name: 'Phòng Quản lý, giám sát TCTD phi NH' }
]

const dept = (id: string | null) => departments.find((d) => d.id === id)?.name ?? null

const U = (id: string, fullName: string, email: string, departmentId: string | null, role: Role, code: string, createdAt: string): AdminUser => ({
  id,
  code,
  fullName,
  email,
  phone: null,
  departmentId,
  departmentName: dept(departmentId),
  role,
  status: 'ACTIVE',
  createdAt,
  lastLoginAt: null
})

const users: AdminUser[] = [
  U('744bdefa-fb91-4431-9955-6c10cc92bdb5', 'Vũ Hoài Thanh', 'thanh.vuhoai@sbv.gov.vn', 'P1', 'LEARNER', 'CB009', '2026-06-20'),
  U('0433b03f-cc9c-4d90-bdb6-af661e617ca8', 'Trần Thảo Linh', 'linh.tranthao@sbv.gov.vn', 'P1', 'LEARNER', 'CB008', '2026-06-19'),
  U('d40b176d-38a3-422a-aff9-1e50607a740d', 'Nguyễn Phương Chi', 'chi.nguyenphuong@sbv.gov.vn', 'P6', 'LECTURER', 'CB007', '2026-06-18'),
  U('e9b20a1e-e033-4493-a808-e7723976919a', 'Nguyễn Hà My', 'my.nguyenha@sbv.gov.vn', 'P5', 'LEARNER', 'CB006', '2026-06-17'),
  U('770fa12e-02c0-45ec-8489-e3da4fcc6d6f', 'Vũ Tuấn Thiên', 'thien.vu@sbv.gov.vn', 'P4', 'LEARNER', 'CB005', '2026-06-16'),
  U('fbad5873-86dc-486f-b9c5-a7a9ca825efe', 'Ngô Đức Dương', 'duong.ngoduc@sbv.gov.vn', 'P3', 'LECTURER', 'CB004', '2026-06-15'),
  U('3c1e9a47-5b2d-4f6e-9a8c-1d2e3f4a5b6c', 'Phạm Minh Tú', 'tu.phamminh@sbv.gov.vn', 'P2', 'LEARNER', 'CB003', '2026-06-14'),
  U('8f7e6d5c-4b3a-4291-8a7b-6c5d4e3f2a1b', 'Trần Phương', 'phuongtran195@gmail.com', 'P1', 'DEPT_LEAD', 'CB002', '2026-06-13'),
  U('1a2b3c4d-5e6f-4a8b-9c0d-e1f2a3b4c5d6', 'Quản trị viên', 'admin@sbv.gov.vn', null, 'ADMIN', 'CB001', '2026-06-01')
]

export const USERS_CONFIG = {
  timeout: 30_000,
  staleTime: 30_000,
  demoDelayMs: 300,
  demo: { users, departments }
}
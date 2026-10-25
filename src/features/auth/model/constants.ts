import type { Role } from '@/shared/constants/roles'

export const AUTH_QUERY_KEYS = {
  all: ['auth'] as const,
  me: ['auth', 'me'] as const
}

/** Các cách backend có thể ghi vai trò → mã chuẩn */
export const ROLE_ALIASES: Record<string, Role> = {
  QUAN_TRI_VIEN: 'ADMIN',
  QUAN_TRI: 'ADMIN',
  QUAN_TRI_HE_THONG: 'ADMIN',
  ADMINISTRATOR: 'ADMIN',
  LANH_DAO_PHONG: 'DEPT_LEAD',
  LANH_DAO: 'DEPT_LEAD',
  TRUONG_PHONG: 'DEPT_LEAD',
  MANAGER: 'DEPT_LEAD',
  GIANG_VIEN: 'LECTURER',
  TEACHER: 'LECTURER',
  INSTRUCTOR: 'LECTURER',
  HOC_VIEN: 'LEARNER',
  STUDENT: 'LEARNER',
  CONG_CHUC: 'LEARNER'
}
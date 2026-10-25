export const PERMISSIONS_QUERY_KEYS = {
  all: ['permissions'] as const,
  roles: ['permissions', 'roles'] as const
}

export const ADMIN_KEY = 'ADMIN'

/** Tên hiển thị vai trò hệ thống trên trang phân quyền */
export const SYSTEM_ROLE_NAMES: Record<string, string> = {
  ADMIN: 'Quản trị hệ thống',
  DEPT_LEAD: 'Lãnh đạo phòng',
  LECTURER: 'Giảng viên',
  LEARNER: 'Học viên'
}

export const SYSTEM_ROLE_DESCRIPTIONS: Record<string, string> = {
  ADMIN: 'Toàn quyền quản trị hệ thống',
  DEPT_LEAD: 'Theo dõi kết quả học tập của phòng',
  LECTURER: 'Soạn khóa học, bài học và câu hỏi',
  LEARNER: 'Tham gia học tập, làm bài kiểm tra'
}

export const RESERVED_KEYS = ['ADMIN', 'DEPT_LEAD', 'LECTURER', 'LEARNER']
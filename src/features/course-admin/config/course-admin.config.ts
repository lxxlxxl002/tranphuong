import type { AdminCourse, AdminLesson, AdminLessonType } from '../model/types'

const C = (
  id: string,
  title: string,
  description: string,
  questionCount: number,
  enrollmentCount: number,
  durationMin: number,
  createdAt: string
): AdminCourse => ({
  id,
  title,
  description,
  coverUrl: null,
  status: 'PUBLISHED',
  lessonCount: 0,
  questionCount,
  enrollmentCount,
  passScore: 70,
  durationMin,
  maxAttempts: 3,
  createdAt,
  updatedAt: createdAt
})

const L = (id: string, courseId: string, order: number, title: string, type: AdminLessonType, durationSec: number): AdminLesson => ({
  id,
  courseId,
  order,
  title,
  type,
  durationSec,
  videoUrl: null,
  documentUrl: null,
  content: null
})

const courses: AdminCourse[] = [
  C('basel-2', 'TÌM HIỂU VỀ BASEL II', 'Khung an toàn vốn Basel II và lộ trình áp dụng tại Việt Nam.', 0, 3, 15, '2026-06-15'),
  C('cong-tac-giam-sat', 'CÔNG TÁC GIÁM SÁT', 'Nghiệp vụ quản lý, giám sát tổ chức tín dụng.', 1, 3, 10, '2026-06-10'),
  C('chuyen-doi-so', 'CHUYỂN ĐỔI SỐ', 'Công nghệ số – động lực tăng trưởng – kiến tạo tương lai.', 15, 2, 20, '2026-06-01')
]

const lessons: AdminLesson[] = [
  L('b2-l1', 'basel-2', 1, 'Tổng quan về Ủy ban Basel và các Hiệp ước vốn', 'VIDEO', 900),
  L('b2-l2', 'basel-2', 2, 'Trụ cột 1 – Yêu cầu vốn tối thiểu', 'VIDEO', 1200),
  L('b2-l3', 'basel-2', 3, 'Trụ cột 2 – Quy trình đánh giá giám sát', 'TEXT', 600),
  L('b2-l4', 'basel-2', 4, 'Trụ cột 3 – Kỷ luật thị trường', 'TEXT', 480),
  L('gs-l1', 'cong-tac-giam-sat', 1, 'Khái quát về giám sát ngân hàng', 'VIDEO', 840),
  L('gs-l2', 'cong-tac-giam-sat', 2, 'Giám sát từ xa và thanh tra tại chỗ', 'TEXT', 720),
  L('gs-l3', 'cong-tac-giam-sat', 3, 'Hệ thống cảnh báo sớm', 'DOCUMENT', 600)
]

export const COURSE_ADMIN_CONFIG = {
  timeout: 30_000,
  staleTime: 30_000,
  demoDelayMs: 300,
  defaults: { passScore: 70, durationMin: 15, maxAttempts: 3 },
  demo: { courses, lessons }
}
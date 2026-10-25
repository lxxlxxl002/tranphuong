import type { MyCourse } from '../model/types'

const demo: MyCourse[] = [
  {
    id: 'basel-2',
    title: 'TÌM HIỂU VỀ BASEL II',
    description: 'Khung an toàn vốn Basel II và lộ trình áp dụng tại Việt Nam.',
    coverUrl: null,
    status: 'NOT_STARTED',
    progress: 0,
    lessonsTotal: 0,
    lessonsDone: 0,
    enrolledAt: '2026-07-01',
    completedAt: null,
    lastAccessedAt: null,
    score: null,
    hasCertificate: false
  },
  {
    id: 'cong-tac-giam-sat',
    title: 'CÔNG TÁC GIÁM SÁT',
    description: 'Nghiệp vụ quản lý, giám sát tổ chức tín dụng.',
    coverUrl: null,
    status: 'NOT_STARTED',
    progress: 0,
    lessonsTotal: 0,
    lessonsDone: 0,
    enrolledAt: '2026-07-01',
    completedAt: null,
    lastAccessedAt: null,
    score: null,
    hasCertificate: false
  },
  {
    id: 'chuyen-doi-so',
    title: 'CHUYỂN ĐỔI SỐ',
    description: 'Công nghệ số – động lực tăng trưởng – kiến tạo tương lai.',
    coverUrl: null,
    status: 'COMPLETED',
    progress: 100,
    lessonsTotal: 0,
    lessonsDone: 0,
    enrolledAt: '2026-06-20',
    completedAt: '2026-07-02',
    lastAccessedAt: '2026-07-02',
    score: 94,
    hasCertificate: true
  }
]

export const MY_COURSES_CONFIG = {
  timeout: 20_000,
  staleTime: 30_000,
  demoDelayMs: 300,
  demo
}
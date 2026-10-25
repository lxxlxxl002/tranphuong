import type { CourseProgress, ProgressSortBy } from '../model/types'

const courses: CourseProgress[] = [
  { courseId: 'basel-2', title: 'TÌM HIỂU VỀ BASEL II', status: 'NOT_STARTED', percent: 0, lessonsDone: 0, lessonsTotal: 0, studySec: 0, lastAccessedAt: null, bestScore: null },
  { courseId: 'cong-tac-giam-sat', title: 'CÔNG TÁC GIÁM SÁT', status: 'NOT_STARTED', percent: 0, lessonsDone: 0, lessonsTotal: 0, studySec: 0, lastAccessedAt: null, bestScore: null },
  { courseId: 'chuyen-doi-so', title: 'CHUYỂN ĐỔI SỐ', status: 'COMPLETED', percent: 100, lessonsDone: 0, lessonsTotal: 0, studySec: 0, lastAccessedAt: '2026-07-02', bestScore: 94 }
]

export const PROGRESS_CONFIG = {
  timeout: 20_000,
  staleTime: 30_000,
  demoDelayMs: 300,
  defaultSort: 'status' as ProgressSortBy,
  demo: { courses }
}
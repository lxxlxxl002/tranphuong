import { isDemoMode } from '@/features/auth'
import { ApiError } from '@/shared/api/errors'
import { normalizeText } from '@/shared/lib/format'
import { fetchMyCourses } from '../api/queries'
import { startCourseRequest } from '../api/mutations'
import { toMyCourses } from '../adapters/myCourseAdapter'
import { MY_COURSES_CONFIG } from '../config/my-courses.config'
import { learnPath } from '../lib/utils'
import type { MyCourse, StatusFilter } from '../model/types'

const demo = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), MY_COURSES_CONFIG.demoDelayMs))

export const myCourseService = {
  async getMyCourses(): Promise<MyCourse[]> {
    if (isDemoMode()) return demo(MY_COURSES_CONFIG.demo)
    const raw = await fetchMyCourses()
    try {
      return toMyCourses(raw)
    } catch {
      throw new ApiError('SERVER', 'Dữ liệu khóa học không hợp lệ')
    }
  },

  filter(list: MyCourse[], status: StatusFilter, search = ''): MyCourse[] {
    const q = normalizeText(search)
    return list.filter(
      (c) => (status === 'ALL' || c.status === status) && (!q || normalizeText(c.title).includes(q))
    )
  },

  countByStatus(list: MyCourse[]): Record<StatusFilter, number> {
    const counts: Record<StatusFilter, number> = { ALL: list.length, NOT_STARTED: 0, IN_PROGRESS: 0, COMPLETED: 0 }
    for (const c of list) counts[c.status]++
    return counts
  },

  /** Ghi nhận bắt đầu (nếu cần) rồi trả về đường dẫn vào học — lỗi ghi nhận không chặn việc học */
  async startCourse(course: MyCourse): Promise<string> {
    if (course.status === 'NOT_STARTED' && !isDemoMode()) {
      try {
        await startCourseRequest(course.id)
      } catch {
        /* bỏ qua */
      }
    }
    return learnPath(course.id)
  }
}
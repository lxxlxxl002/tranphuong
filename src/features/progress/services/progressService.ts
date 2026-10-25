import { isDemoMode } from '@/features/auth'
import { ApiError } from '@/shared/api/errors'
import { fetchProgressOverview } from '../api/queries'
import { toProgressPayload } from '../adapters/progressAdapter'
import { PROGRESS_CONFIG } from '../config/progress.config'
import { average } from '../lib/utils'
import { STATUS_RANK } from '../model/constants'
import type { RawSummary } from '../model/schemas'
import type { CourseProgress, ProgressData, ProgressSortBy, ProgressSummary } from '../model/types'

const delay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), PROGRESS_CONFIG.demoDelayMs))

export const progressService = {
  async getProgress(): Promise<ProgressData> {
    if (isDemoMode()) {
      const courses = await delay(PROGRESS_CONFIG.demo.courses)
      return { courses, summary: progressService.computeSummary(courses) }
    }
    const raw = await fetchProgressOverview()
    let payload: ReturnType<typeof toProgressPayload>
    try {
      payload = toProgressPayload(raw)
    } catch {
      throw new ApiError('SERVER', 'Dữ liệu tiến độ không hợp lệ')
    }
    return {
      courses: payload.courses,
      summary: progressService.mergeSummary(progressService.computeSummary(payload.courses), payload.summary)
    }
  },

  /** Tự tổng hợp khi backend không trả summary */
  computeSummary(courses: CourseProgress[]): ProgressSummary {
    const total = courses.length
    const completed = courses.filter((c) => c.status === 'COMPLETED').length
    const studySec = courses.reduce((s, c) => s + c.studySec, 0)
    const scored = courses.filter((c) => c.bestScore != null)
    return {
      overallPercent: total ? Math.round((completed / total) * 100) : 0,
      totalStudySec: studySec > 0 ? studySec : null,
      lessonsDone: courses.reduce((s, c) => s + c.lessonsDone, 0),
      lessonsTotal: courses.reduce((s, c) => s + c.lessonsTotal, 0),
      quizzesTaken: scored.length,
      quizzesPassed: scored.filter((c) => c.status === 'COMPLETED').length,
      averageScore: average(scored.map((c) => c.bestScore as number))
    }
  },

  /** Số liệu backend (nếu có) ưu tiên hơn số tự tính */
  mergeSummary(computed: ProgressSummary, raw: RawSummary | null): ProgressSummary {
    if (!raw) return computed
    return {
      overallPercent: raw.overall_percent ?? computed.overallPercent,
      totalStudySec: raw.total_study_sec ?? computed.totalStudySec,
      lessonsDone: raw.lessons_done ?? computed.lessonsDone,
      lessonsTotal: raw.lessons_total ?? computed.lessonsTotal,
      quizzesTaken: raw.quizzes_taken ?? computed.quizzesTaken,
      quizzesPassed: raw.quizzes_passed ?? computed.quizzesPassed,
      averageScore: raw.average_score ?? computed.averageScore
    }
  },

  sortCourses(list: CourseProgress[], sortBy: ProgressSortBy): CourseProgress[] {
    const byName = (a: CourseProgress, b: CourseProgress) => a.title.localeCompare(b.title, 'vi')
    return [...list].sort((a, b) => {
      if (sortBy === 'percent') return b.percent - a.percent || byName(a, b)
      if (sortBy === 'name') return byName(a, b)
      return STATUS_RANK[a.status] - STATUS_RANK[b.status] || byName(a, b)
    })
  }
}
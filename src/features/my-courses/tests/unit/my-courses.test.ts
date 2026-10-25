import { describe, expect, it } from 'vitest'
import { toCourseStatus, toMyCourses } from '../../adapters/myCourseAdapter'
import { myCourseService } from '../../services/myCourseService'
import { MY_COURSES_CONFIG } from '../../config/my-courses.config'

describe('myCourseAdapter', () => {
  it('map trạng thái tiếng Việt / suy ra từ tiến độ', () => {
    expect(toCourseStatus('Hoàn thành', 0)).toBe('COMPLETED')
    expect(toCourseStatus('chua bat dau', 0)).toBe('NOT_STARTED')
    expect(toCourseStatus(null, 40)).toBe('IN_PROGRESS')
    expect(toCourseStatus(undefined, 100)).toBe('COMPLETED')
  })

  it('chuẩn hóa khóa học từ Google Sheets', () => {
    const [c] = toMyCourses([
      { course_id: 7, title: '  CHUYỂN ĐỔI SỐ ', status: 'HOAN_THANH', progress: '0', lessons_total: '4', lessons_done: 9, score: '94', has_certificate: 'x' }
    ])
    expect(c.id).toBe('7')
    expect(c.title).toBe('CHUYỂN ĐỔI SỐ')
    expect(c.progress).toBe(100)
    expect(c.lessonsDone).toBe(4)
    expect(c.score).toBe(94)
    expect(c.hasCertificate).toBe(true)
  })

  it('từ chối bản ghi thiếu mã khóa học', () => {
    expect(() => toMyCourses([{ title: 'X' }])).toThrow()
  })
})

describe('myCourseService', () => {
  const list = MY_COURSES_CONFIG.demo

  it('lọc theo trạng thái', () => {
    expect(myCourseService.filter(list, 'COMPLETED').map((c) => c.id)).toEqual(['chuyen-doi-so'])
  })

  it('tìm kiếm không dấu', () => {
    expect(myCourseService.filter(list, 'ALL', 'chuyen doi').length).toBe(1)
    expect(myCourseService.filter(list, 'ALL', 'basel').length).toBe(1)
  })

  it('đếm theo trạng thái', () => {
    expect(myCourseService.countByStatus(list)).toEqual({ ALL: 3, NOT_STARTED: 2, IN_PROGRESS: 0, COMPLETED: 1 })
  })
})
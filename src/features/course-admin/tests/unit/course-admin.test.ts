import { describe, expect, it } from 'vitest'
import { toAdminCourses, toCourseDetail, toCoursePayload } from '../../adapters/courseAdapter'
import { toLessonPayload } from '../../adapters/lessonAdapter'
import { courseService } from '../../services/courseService'
import { lessonService } from '../../services/lessonService'
import { validateCourseInput, validateLessonInput } from '../../lib/validators'
import { COURSE_ADMIN_CONFIG } from '../../config/course-admin.config'

describe('courseAdapter', () => {
  it('trạng thái tiếng Việt + ép kiểu số', () => {
    const [c] = toAdminCourses([{ id: 1, title: ' BASEL ', status: 'Đã xuất bản', lesson_count: '4', pass_score: '80', max_attempts: '' }])
    expect(c).toMatchObject({ id: '1', title: 'BASEL', status: 'PUBLISHED', lessonCount: 4, passScore: 80, maxAttempts: 0 })
    expect(toAdminCourses([{ id: 2, title: 'X', status: '???' }])[0].status).toBe('DRAFT')
  })

  it('chi tiết: sắp bài theo thứ tự + đếm bài', () => {
    const d = toCourseDetail({
      course: { id: 'c', title: 'C' },
      lessons: [
        { id: 'b', course_id: 'c', order: 2, title: 'B', document_url: 'https://x.vn/a.pdf' },
        { id: 'a', course_id: 'c', order: 1, title: 'A' }
      ]
    })
    expect(d.lessons.map((l) => l.id)).toEqual(['a', 'b'])
    expect(d.lessons[1].type).toBe('DOCUMENT')
    expect(d.course.lessonCount).toBe(2)
  })

  it('payload gửi backend', () => {
    expect(toCoursePayload({ ...courseService.emptyInput(), title: '  Mới ', coverUrl: '' })).toMatchObject({ title: 'Mới', cover_url: null, status: 'DRAFT', pass_score: 70 })
    expect(toLessonPayload({ title: 'L', type: 'TEXT', durationMin: 10, videoUrl: 'https://youtu.be/x', documentUrl: '', content: '' })).toEqual({
      title: 'L',
      type: 'TEXT',
      duration_sec: 600,
      video_url: null,
      document_url: null,
      content: null
    })
  })
})

describe('validators', () => {
  it('khóa học: bắt buộc tên, điểm 0–100', () => {
    const errs = validateCourseInput({ ...courseService.emptyInput(), title: ' ', passScore: 150 })
    expect(errs.title).toBe('Vui lòng nhập tên khóa học')
    expect(errs.passScore).toBe('Từ 0 đến 100')
  })

  it('bài học: link sai định dạng', () => {
    const errs = validateLessonInput({ ...lessonService.emptyInput(), title: 'A', videoUrl: 'abc' })
    expect(errs.videoUrl).toBe('Link video không hợp lệ')
    expect(validateLessonInput({ ...lessonService.emptyInput(), title: 'A', videoUrl: 'https://youtu.be/dQw4w9WgXcQ' })).toEqual({})
  })
})

describe('services thuần', () => {
  const lessons = COURSE_ADMIN_CONFIG.demo.lessons.filter((l) => l.courseId === 'basel-2')

  it('dời bài lên/xuống', () => {
    expect(lessonService.move(lessons, 'b2-l2', -1)).toEqual(['b2-l2', 'b2-l1', 'b2-l3', 'b2-l4'])
    expect(lessonService.move(lessons, 'b2-l1', -1)).toEqual(['b2-l1', 'b2-l2', 'b2-l3', 'b2-l4'])
    expect(lessonService.applyOrder(lessons, ['b2-l4', 'b2-l1']).map((l) => [l.id, l.order])).toEqual([['b2-l4', 1], ['b2-l1', 2]])
  })

  it('lọc + đếm khóa học', () => {
    const courses = COURSE_ADMIN_CONFIG.demo.courses
    expect(courseService.filter(courses, 'ALL', 'giam sat')).toHaveLength(1)
    expect(courseService.filter(courses, 'DRAFT', '')).toHaveLength(0)
    expect(courseService.countByStatus(courses)).toEqual({ ALL: 3, DRAFT: 0, PUBLISHED: 3, ARCHIVED: 0 })
  })
})
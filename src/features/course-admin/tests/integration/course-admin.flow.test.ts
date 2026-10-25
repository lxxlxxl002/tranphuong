import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/features/auth', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/features/auth')>()),
  isDemoMode: vi.fn(() => true)
}))

vi.mock('../../api/mutations', () => ({
  createCourseRequest: vi.fn(async (input: Record<string, unknown>) => ({ id: 99, ...input })),
  updateCourseRequest: vi.fn(),
  deleteCourseRequest: vi.fn(),
  setCourseStatusRequest: vi.fn(),
  uploadCoverRequest: vi.fn(),
  createLessonRequest: vi.fn(),
  updateLessonRequest: vi.fn(),
  deleteLessonRequest: vi.fn(),
  reorderLessonsRequest: vi.fn()
}))

import { isDemoMode } from '@/features/auth'
import { createCourseRequest } from '../../api/mutations'
import { courseService, resetDemoDb } from '../../services/courseService'
import { lessonService } from '../../services/lessonService'

describe('Luồng Quản lý khóa học', () => {
  beforeEach(() => {
    resetDemoDb()
    vi.mocked(isDemoMode).mockReturnValue(true)
  })

  it('demo: tạo khóa → thêm 2 bài → đổi thứ tự → xóa bài → xuất bản → xóa khóa', async () => {
    const created = await courseService.create({ ...courseService.emptyInput(), title: 'QUẢN TRỊ RỦI RO' })
    expect((await courseService.list())[0].id).toBe(created.id)

    const l1 = await lessonService.create(created.id, { ...lessonService.emptyInput(), title: 'Bài 1' })
    const l2 = await lessonService.create(created.id, { ...lessonService.emptyInput(), title: 'Bài 2', type: 'TEXT' })
    await lessonService.reorder(created.id, [l2.id, l1.id])
    let d = await courseService.detail(created.id)
    expect(d.lessons.map((l) => l.title)).toEqual(['Bài 2', 'Bài 1'])
    expect(d.course.lessonCount).toBe(2)

    await lessonService.remove(l2.id)
    d = await courseService.detail(created.id)
    expect(d.lessons.map((l) => [l.title, l.order])).toEqual([['Bài 1', 1]])

    await courseService.setStatus(created.id, 'PUBLISHED')
    expect((await courseService.detail(created.id)).course.status).toBe('PUBLISHED')

    await courseService.remove(created.id)
    await expect(courseService.detail(created.id)).rejects.toMatchObject({ code: 'NOT_FOUND' })
  })

  it('API: tạo khóa gửi payload snake_case', async () => {
    vi.mocked(isDemoMode).mockReturnValue(false)
    const c = await courseService.create({ ...courseService.emptyInput(), title: 'X', passScore: 80 })
    expect(createCourseRequest).toHaveBeenCalledWith(expect.objectContaining({ title: 'X', pass_score: 80, cover_url: null }))
    expect(c).toMatchObject({ id: '99', title: 'X', passScore: 80, status: 'DRAFT' })
  })
})
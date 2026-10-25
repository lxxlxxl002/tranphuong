import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/features/auth', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/features/auth')>()),
  isDemoMode: vi.fn(() => false)
}))

vi.mock('../../api/queries', () => ({
  fetchMyCourses: vi.fn(async () => [
    { id: 'c1', title: 'TÌM HIỂU VỀ BASEL II', status: 'NOT_STARTED', progress: 0, lessons_total: 5, lessons_done: 0 },
    { id: 'c2', title: 'CHUYỂN ĐỔI SỐ', status: 'COMPLETED', progress: 100, lessons_total: 4, lessons_done: 4 }
  ])
}))

vi.mock('../../api/mutations', () => ({
  startCourseRequest: vi.fn(async () => undefined)
}))

import { isDemoMode } from '@/features/auth'
import { fetchMyCourses } from '../../api/queries'
import { startCourseRequest } from '../../api/mutations'
import { myCourseService } from '../../services/myCourseService'

describe('Luồng Khóa học của tôi', () => {
  beforeEach(() => {
    vi.mocked(isDemoMode).mockReturnValue(false)
    vi.mocked(fetchMyCourses).mockClear()
    vi.mocked(startCourseRequest).mockClear()
  })

  it('tải danh sách từ API', async () => {
    const list = await myCourseService.getMyCourses()
    expect(fetchMyCourses).toHaveBeenCalledOnce()
    expect(list.map((c) => c.status)).toEqual(['NOT_STARTED', 'COMPLETED'])
  })

  it('bắt đầu khóa chưa học → ghi nhận + trả đường dẫn', async () => {
    const [c1] = await myCourseService.getMyCourses()
    expect(await myCourseService.startCourse(c1)).toBe('/hoc/c1')
    expect(startCourseRequest).toHaveBeenCalledWith('c1')
  })

  it('xem lại khóa đã xong → không ghi nhận', async () => {
    const [, c2] = await myCourseService.getMyCourses()
    expect(await myCourseService.startCourse(c2)).toBe('/hoc/c2')
    expect(startCourseRequest).not.toHaveBeenCalled()
  })

  it('ghi nhận lỗi vẫn cho vào học', async () => {
    vi.mocked(startCourseRequest).mockRejectedValueOnce(new Error('down'))
    const [c1] = await myCourseService.getMyCourses()
    expect(await myCourseService.startCourse(c1)).toBe('/hoc/c1')
  })

  it('phiên demo → dữ liệu mẫu, không gọi API', async () => {
    vi.mocked(isDemoMode).mockReturnValue(true)
    const list = await myCourseService.getMyCourses()
    expect(fetchMyCourses).not.toHaveBeenCalled()
    expect(list).toHaveLength(3)
  })
})
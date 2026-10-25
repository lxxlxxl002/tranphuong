import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/features/auth', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/features/auth')>()),
  isDemoMode: vi.fn(() => true)
}))

vi.mock('../../api/mutations', () => ({
  createDepartmentRequest: vi.fn(async (input: Record<string, unknown>) => ({ id: 'd-1', staff_count: 0, ...input })),
  updateDepartmentRequest: vi.fn(),
  deleteDepartmentRequest: vi.fn()
}))

import { isDemoMode } from '@/features/auth'
import { createDepartmentRequest } from '../../api/mutations'
import { departmentService, resetDemoDepartments } from '../../services/departmentService'

describe('Luồng Phòng / Ban', () => {
  beforeEach(() => {
    resetDemoDepartments()
    vi.mocked(isDemoMode).mockReturnValue(true)
  })

  it('demo: số công chức lấy từ dữ liệu người dùng (khớp màn hình)', async () => {
    const list = await departmentService.list()
    expect(list.map((d) => [d.code, d.staffCount])).toEqual([
      ['P1', 3],
      ['P2', 1],
      ['P3', 1],
      ['P4', 1],
      ['P5', 1],
      ['P6', 1]
    ])
    expect(departmentService.totalStaff(list)).toBe(8)
  })

  it('demo: thêm → chặn trùng mã → gán lãnh đạo → xóa (phòng trống)', async () => {
    const created = await departmentService.create({ code: 'p7', name: 'Phòng Thanh tra', leaderId: '', description: '' })
    expect(created).toMatchObject({ code: 'P7', staffCount: 0 })

    await expect(departmentService.create({ code: 'P7', name: 'Trùng', leaderId: '', description: '' })).rejects.toMatchObject({ code: 'CONFLICT' })

    const updated = await departmentService.update(created.id, {
      code: 'P7',
      name: 'Phòng Thanh tra',
      leaderId: '8f7e6d5c-4b3a-4291-8a7b-6c5d4e3f2a1b',
      description: ''
    })
    expect(updated.leaderName).toBe('Trần Phương')

    await departmentService.remove(updated)
    expect((await departmentService.list()).some((d) => d.id === created.id)).toBe(false)
  })

  it('demo: chặn xóa phòng còn công chức', async () => {
    const [p1] = await departmentService.list()
    await expect(departmentService.remove(p1)).rejects.toMatchObject({ code: 'VALIDATION' })
  })

  it('API: payload chuẩn hóa', async () => {
    vi.mocked(isDemoMode).mockReturnValue(false)
    const d = await departmentService.create({ code: 'p8', name: ' Phòng Z ', leaderId: '', description: '' })
    expect(createDepartmentRequest).toHaveBeenCalledWith({ code: 'P8', name: 'Phòng Z', leader_id: null, description: null })
    expect(d).toMatchObject({ id: 'd-1', code: 'P8' })
  })
})
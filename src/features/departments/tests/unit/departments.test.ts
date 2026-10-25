import { describe, expect, it } from 'vitest'
import { toDepartmentPayload, toDepartments } from '../../adapters/departmentAdapter'
import { departmentService } from '../../services/departmentService'
import { validateDepartmentInput } from '../../lib/validators'
import { DEPARTMENTS_CONFIG } from '../../config/departments.config'

describe('departmentAdapter', () => {
  it('chuẩn hóa mã + ép kiểu số công chức', () => {
    const [d] = toDepartments([{ id: 9, code: ' p 9 ', name: ' Phòng X ', staff_count: '4', leader_id: '' }])
    expect(d).toMatchObject({ id: '9', code: 'P9', name: 'Phòng X', staffCount: 4, leaderId: null })
  })

  it('payload', () => {
    expect(toDepartmentPayload({ code: 'p7', name: ' Phòng Y ', leaderId: '', description: ' ' })).toEqual({
      code: 'P7',
      name: 'Phòng Y',
      leader_id: null,
      description: null
    })
  })
})

describe('validateDepartmentInput', () => {
  it('bắt mã sai định dạng / trùng / thiếu tên', () => {
    expect(validateDepartmentInput({ code: 'p 1@', name: '', leaderId: '', description: '' })).toEqual({
      code: 'Chỉ gồm chữ in hoa, số, "-" hoặc "_"',
      name: 'Vui lòng nhập tên phòng/ban'
    })
    expect(validateDepartmentInput({ code: 'p1', name: 'A', leaderId: '', description: '' }, ['P1']).code).toBe('Mã P1 đã tồn tại')
    expect(validateDepartmentInput({ code: 'P7', name: 'A', leaderId: '', description: '' }, ['P1'])).toEqual({})
  })
})

describe('departmentService (thuần)', () => {
  const list = DEPARTMENTS_CONFIG.demo

  it('mã tiếp theo + sắp xếp tự nhiên', () => {
    expect(departmentService.nextCode(list)).toBe('P7')
    const sorted = departmentService.sortByCode([{ ...list[0], code: 'P10' }, list[1], list[0]])
    expect(sorted.map((d) => d.code)).toEqual(['P1', 'P2', 'P10'])
  })

  it('không xóa được phòng còn công chức', () => {
    expect(departmentService.canDelete({ ...list[0], staffCount: 3 })).toEqual({
      ok: false,
      reason: 'Còn 3 công chức — chuyển công chức sang phòng khác trước khi xóa'
    })
    expect(departmentService.canDelete(list[0]).ok).toBe(true)
  })

  it('danh sách lãnh đạo: Lãnh đạo phòng lên đầu', () => {
    const opts = departmentService.leaderOptions([
      { id: 'a', fullName: 'An', role: 'LEARNER', departmentId: null },
      { id: 'b', fullName: 'Bình', role: 'DEPT_LEAD', departmentId: null }
    ])
    expect(opts.map((o) => o.value)).toEqual(['', 'b', 'a'])
    expect(opts[1].label).toBe('Bình · Lãnh đạo phòng')
  })
})
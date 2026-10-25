import { describe, expect, it } from 'vitest'
import { toUserPayload, toUsers } from '../../adapters/userAdapter'
import { userService } from '../../services/userService'
import { userImportService } from '../../services/userImportService'
import { generatePassword, percentOf } from '../../lib/utils'
import { validateUserInput } from '../../lib/validators'
import { USERS_CONFIG } from '../../config/users.config'

const users = USERS_CONFIG.demo.users
const ctx = { departments: USERS_CONFIG.demo.departments, existingEmails: new Set(['admin@sbv.gov.vn']) }

describe('userAdapter', () => {
  it('trạng thái + vai trò tiếng Việt, email chữ thường', () => {
    const [u] = toUsers([{ id: 7, full_name: ' An ', email: 'AN@SBV.GOV.VN', role: 'Giảng viên', status: 'Đã khóa', department_id: '' }])
    expect(u).toMatchObject({ id: '7', fullName: 'An', email: 'an@sbv.gov.vn', role: 'LECTURER', status: 'LOCKED', departmentId: null })
    expect(toUsers([{ id: 1, full_name: 'B', email: 'b@x.vn', status: 'Hoạt động' }])[0].status).toBe('ACTIVE')
  })

  it('payload: chuỗi rỗng → null', () => {
    expect(toUserPayload({ ...userService.emptyInput(), fullName: 'A', email: 'A@x.vn' })).toEqual({
      full_name: 'A',
      email: 'a@x.vn',
      code: null,
      phone: null,
      department_id: null,
      role: 'LEARNER',
      status: 'ACTIVE'
    })
  })
})

describe('validators + tiện ích', () => {
  it('form người dùng', () => {
    const e = validateUserInput({ ...userService.emptyInput(), email: 'sai', phone: 'abc' })
    expect(e).toMatchObject({ fullName: 'Vui lòng nhập họ và tên', email: 'Email không hợp lệ', phone: 'Số điện thoại không hợp lệ' })
  })

  it('mật khẩu tạm đủ độ mạnh, % 1 chữ số thập phân', () => {
    const pw = generatePassword()
    expect(pw).toHaveLength(10)
    expect(pw).toMatch(/[A-Z]/)
    expect(pw).toMatch(/[a-z]/)
    expect(pw).toMatch(/\d/)
    expect(pw).toMatch(/[@#$%&*]/)
    expect(percentOf(9, 9)).toBe('100.0%')
    expect(percentOf(0, 0)).toBe('0.0%')
  })
})

describe('userService (thuần)', () => {
  it('thống kê + lọc + tìm theo mã CC / mã CB', () => {
    expect(userService.stats(users)).toEqual({ total: 9, active: 9, pending: 0, locked: 0 })
    expect(userService.filter(users, { role: 'LECTURER', status: 'ALL', search: '' })).toHaveLength(2)
    expect(userService.filter(users, { role: 'ALL', status: 'ALL', search: '744bdefa' })[0].fullName).toBe('Vũ Hoài Thanh')
    expect(userService.filter(users, { role: 'ALL', status: 'ALL', search: 'cb002' })[0].fullName).toBe('Trần Phương')
    expect(userService.filter(users, { role: 'ALL', status: 'ALL', search: 'duong' })).toHaveLength(1)
  })
})

describe('userImportService.rowToImport', () => {
  it('phòng theo mã hoặc tên + vai trò tiếng Việt', () => {
    const seen = new Set<string>()
    const a = userImportService.rowToImport(2, { fullName: 'A', email: 'a@sbv.gov.vn', department: 'p2', role: 'Lãnh đạo phòng' }, ctx, seen)
    expect(a.input).toMatchObject({ departmentId: 'P2', role: 'DEPT_LEAD' })
    const b = userImportService.rowToImport(3, { fullName: 'B', email: 'b@sbv.gov.vn', department: 'Phòng Quản lý, giám sát NHTMCP2' }, ctx, seen)
    expect(b.input?.departmentId).toBe('P5')
  })

  it('bắt trùng email, vai trò & phòng sai', () => {
    const seen = new Set<string>()
    userImportService.rowToImport(2, { fullName: 'A', email: 'x@sbv.gov.vn' }, ctx, seen)
    expect(userImportService.rowToImport(3, { fullName: 'B', email: 'X@sbv.gov.vn' }, ctx, seen).errors).toContain('Email bị trùng trong tệp')
    expect(userImportService.rowToImport(4, { fullName: 'C', email: 'admin@sbv.gov.vn' }, ctx, seen).errors).toContain('Email đã tồn tại trong hệ thống')
    const bad = userImportService.rowToImport(5, { fullName: 'D', email: 'd@sbv.gov.vn', role: 'Giám đốc', department: 'P9' }, ctx, seen)
    expect(bad.errors).toEqual(['Vai trò "Giám đốc" không hợp lệ', 'Không tìm thấy phòng/ban "P9"'])
  })
})
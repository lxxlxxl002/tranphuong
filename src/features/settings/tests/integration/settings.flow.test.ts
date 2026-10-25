import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/features/auth', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/features/auth')>()),
  isDemoMode: vi.fn(() => true)
}))

vi.mock('../../api/mutations', () => ({ updateSettingsRequest: vi.fn(async () => undefined) }))
vi.mock('../../api/queries', () => ({ fetchSettings: vi.fn(async () => [{ key: 'support.name', value: 'Phòng CNTT' }]) }))

import { isDemoMode } from '@/features/auth'
import { courseService } from '@/features/course-admin'
import { updateSettingsRequest } from '../../api/mutations'
import { settingsService } from '../../services/settingsService'
import { getAppSettings } from '../../state/actions'

describe('Luồng Cài đặt hệ thống', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.mocked(isDemoMode).mockReturnValue(true)
  })

  it('demo: lưu → áp dụng ngay + còn sau khi tải lại', async () => {
    const s = await settingsService.get()
    s.support.phone = '024 1234 5678'
    s.general.defaultPassScore = 80
    await settingsService.save(s)
    expect(getAppSettings().support.phone).toBe('024 1234 5678')
    expect(courseService.emptyInput().passScore).toBe(80)

    const reloaded = await settingsService.get()
    expect(reloaded.support.phone).toBe('024 1234 5678')
    expect(reloaded.updatedAt).not.toBeNull()
  })

  it('chặn lưu dữ liệu sai, trả lỗi theo từng ô', async () => {
    const s = await settingsService.get()
    s.certificate.issuePlace = ''
    await expect(settingsService.save(s)).rejects.toMatchObject({ code: 'VALIDATION', details: { 'certificate.issuePlace': 'Vui lòng nhập nơi cấp' } })
  })

  it('API: đọc sheet key/value + gửi payload phẳng', async () => {
    vi.mocked(isDemoMode).mockReturnValue(false)
    const s = await settingsService.get()
    expect(s.support.name).toBe('Phòng CNTT')
    await settingsService.save(s)
    expect(updateSettingsRequest).toHaveBeenCalledWith(expect.objectContaining({ 'support.name': 'Phòng CNTT', 'general.defaultPassScore': 70 }))
  })
})
import { describe, expect, it } from 'vitest'
import { toAppSettings, toSettingsPayload } from '../../adapters/settingsAdapter'
import { DEFAULT_SETTINGS } from '../../config/settings.config'
import { flatten, sameSettings, toFlatMap } from '../../lib/utils'
import { sectionsWithErrors, validateSettings } from '../../lib/validators'
import { getCertificateSettings, getCourseDefaults, settingsActions } from '../../state/actions'

describe('settingsAdapter', () => {
  it('đọc mảng key/value của sheet Settings', () => {
    const s = toAppSettings(
      [
        { key: 'support.phone', value: '024 3936 6306' },
        { key: 'general.defaultPassScore', value: '80' },
        { key: 'general.defaultDurationMin', value: 'abc' },
        { key: 'khoa.la', value: 'x' }
      ],
      DEFAULT_SETTINGS
    )
    expect(s.support.phone).toBe('024 3936 6306')
    expect(s.general.defaultPassScore).toBe(80)
    expect(s.general.defaultDurationMin).toBe(DEFAULT_SETTINGS.general.defaultDurationMin)
  })

  it('đọc object lồng nhau + khóa phẳng', () => {
    expect(toAppSettings({ certificate: { signerName: 'Nguyễn Văn B' } }, DEFAULT_SETTINGS).certificate.signerName).toBe('Nguyễn Văn B')
    expect(toAppSettings({ 'support.email': ' hotro@sbv.gov.vn ' }, DEFAULT_SETTINGS).support.email).toBe('hotro@sbv.gov.vn')
  })

  it('payload phẳng + flatten khứ hồi', () => {
    const payload = toSettingsPayload(DEFAULT_SETTINGS)
    expect(payload['certificate.issuePlace']).toBe('Hà Nội')
    expect(Object.keys(payload)).toHaveLength(13)
    expect(sameSettings(toAppSettings(payload, DEFAULT_SETTINGS), DEFAULT_SETTINGS)).toBe(true)
    expect(toFlatMap({ a: { b: 1 } }).get('a.b')).toBe(1)
    expect(Object.keys(flatten(DEFAULT_SETTINGS))).toContain('general.orgName')
  })
})

describe('validateSettings', () => {
  it('bắt lỗi theo khóa phẳng + nhóm có lỗi', () => {
    const bad = structuredClone(DEFAULT_SETTINGS)
    bad.general.orgName = ' '
    bad.general.defaultPassScore = 150
    bad.support.email = 'sai'
    const e = validateSettings(bad)
    expect(e['general.orgName']).toBe('Vui lòng nhập tên đơn vị')
    expect(e['general.defaultPassScore']).toBe('Từ 0 đến 100')
    expect(e['support.email']).toBe('Email không hợp lệ')
    expect([...sectionsWithErrors(e)].sort()).toEqual(['general', 'support'])
    expect(validateSettings(DEFAULT_SETTINGS)).toEqual({})
  })
})

describe('getter cho feature khác', () => {
  it('phản ánh cài đặt đang áp dụng', () => {
    const s = structuredClone(DEFAULT_SETTINGS)
    s.certificate.signerName = 'Trần Văn C'
    s.general.defaultPassScore = 85
    settingsActions.setApplied(s)
    expect(getCertificateSettings()).toMatchObject({ signerName: 'Trần Văn C', issuePlace: 'Hà Nội' })
    expect(getCourseDefaults()).toEqual({ passScore: 85, durationMin: 15, maxAttempts: 3 })
    settingsActions.setApplied(DEFAULT_SETTINGS)
  })
})
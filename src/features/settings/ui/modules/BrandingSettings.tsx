import { useCan } from '@/app/router/RoleGuard'
import { Card, CardHeader } from '@/shared/ui/Card'
import { Input } from '@/shared/ui/Input'
import logo from '@/assets/logo-quoc-huy.png'
import { useSettings } from '../../hooks/useSettings'
import { SettingField } from '../components/SettingField'

export function BrandingSettings() {
  const can = useCan()
  const { values, errors, setField } = useSettings()
  const c = values.certificate
  const g = values.general
  const ro = !can('settings:update')
  const today = new Date()

  return (
    <Card>
      <CardHeader title="Chứng chỉ & nhận diện" subtitle="Thông tin in trên chứng chỉ PDF học viên tải về" />
      <div className="grid gap-6 p-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="divide-y divide-surface-line">
          <SettingField label="Nơi cấp" required htmlFor="s-place" description="Dòng “…, ngày … tháng … năm …”" error={errors['certificate.issuePlace']}>
            <Input id="s-place" disabled={ro} value={c.issuePlace} onChange={(e) => setField('certificate', 'issuePlace', e.target.value)} />
          </SettingField>
          <SettingField label="Chức danh người ký" required htmlFor="s-title" error={errors['certificate.signerTitle']}>
            <Input id="s-title" disabled={ro} value={c.signerTitle} onChange={(e) => setField('certificate', 'signerTitle', e.target.value)} />
          </SettingField>
          <SettingField label="Họ tên người ký" htmlFor="s-signer" description="Để trống nếu ký tay sau khi in" error={errors['certificate.signerName']}>
            <Input id="s-signer" disabled={ro} value={c.signerName} onChange={(e) => setField('certificate', 'signerName', e.target.value)} />
          </SettingField>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-faint">Xem trước</p>
          <div className="relative overflow-hidden rounded-xl border-2 border-[#b8862b] bg-gradient-to-b from-white to-[#f3f6ff] p-4 text-center">
            <p className="text-[9px] font-bold uppercase text-brand-900">{g.parentOrg}</p>
            <p className="text-[10px] font-extrabold uppercase text-brand-900">{g.orgName}</p>
            <img src={logo} alt="" className="mx-auto mt-2 h-8 w-8" />
            <p className="mt-1 text-lg font-extrabold uppercase tracking-[0.14em] text-[#b8862b]">Chứng chỉ</p>
            <p className="mt-1 text-[10px] italic text-slate-500">Chứng nhận Ông/Bà</p>
            <p className="text-sm font-bold text-brand-900" style={{ fontFamily: 'Georgia, serif' }}>
              Nguyễn Văn A
            </p>
            <div className="mt-4 flex justify-end">
              <div className="text-center">
                <p className="text-[9px] italic text-slate-500">
                  {c.issuePlace || '…'}, ngày {String(today.getDate()).padStart(2, '0')} tháng {String(today.getMonth() + 1).padStart(2, '0')} năm {today.getFullYear()}
                </p>
                <p className="text-[10px] font-extrabold uppercase text-brand-900">{c.signerTitle || '…'}</p>
                <div className="h-5" />
                <p className="text-[10px] font-bold text-ink" style={{ fontFamily: 'Georgia, serif' }}>
                  {c.signerName || '\u00a0'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
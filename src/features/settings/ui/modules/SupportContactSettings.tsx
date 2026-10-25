import { Headphones } from 'lucide-react'
import { useCan } from '@/app/router/RoleGuard'
import { Card, CardHeader } from '@/shared/ui/Card'
import { Input } from '@/shared/ui/Input'
import { useSettings } from '../../hooks/useSettings'
import { SettingField } from '../components/SettingField'

export function SupportContactSettings() {
  const can = useCan()
  const { values, errors, setField } = useSettings()
  const s = values.support
  const ro = !can('settings:update')

  return (
    <Card>
      <CardHeader title="Liên hệ hỗ trợ" subtitle="Hiển thị ở góc dưới thanh bên cho mọi người dùng" />
      <div className="grid gap-6 p-5 xl:grid-cols-[minmax(0,1fr)_260px]">
        <div className="divide-y divide-surface-line">
          <SettingField label="Đầu mối hỗ trợ" htmlFor="s-sname" description="VD: Liên hệ Phòng 1" error={errors['support.name']}>
            <Input id="s-sname" disabled={ro} value={s.name} onChange={(e) => setField('support', 'name', e.target.value)} />
          </SettingField>
          <SettingField label="Số điện thoại" htmlFor="s-phone" error={errors['support.phone']}>
            <Input id="s-phone" disabled={ro} value={s.phone} onChange={(e) => setField('support', 'phone', e.target.value)} />
          </SettingField>
          <SettingField label="Email" htmlFor="s-mail" error={errors['support.email']}>
            <Input id="s-mail" type="email" disabled={ro} value={s.email} onChange={(e) => setField('support', 'email', e.target.value)} placeholder="hotro@sbv.gov.vn" />
          </SettingField>
          <SettingField label="Giờ làm việc" htmlFor="s-hours" error={errors['support.workingHours']}>
            <Input id="s-hours" disabled={ro} value={s.workingHours} onChange={(e) => setField('support', 'workingHours', e.target.value)} />
          </SettingField>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-faint">Xem trước</p>
          <div className="rounded-2xl bg-sidebar p-3">
            <div className="rounded-xl bg-white/10 px-4 py-3 text-white">
              <p className="flex items-center gap-2 text-sm font-bold">
                <Headphones className="h-4 w-4" />
                Hỗ trợ hệ thống
              </p>
              {s.name && <p className="mt-1 pl-6 text-xs text-white/80">{s.name}</p>}
              {s.phone && <p className="pl-6 text-xs font-semibold text-white/90">{s.phone}</p>}
              {s.email && <p className="truncate pl-6 text-xs text-white/80">{s.email}</p>}
            </div>
          </div>
          {s.workingHours && <p className="mt-2 text-center text-xs text-ink-muted">{s.workingHours}</p>}
        </div>
      </div>
    </Card>
  )
}
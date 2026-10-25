import { useCan } from '@/app/router/RoleGuard'
import { Card, CardHeader } from '@/shared/ui/Card'
import { Input } from '@/shared/ui/Input'
import { useSettings } from '../../hooks/useSettings'
import { SettingField } from '../components/SettingField'

export function GeneralSettings() {
  const can = useCan()
  const { values, errors, setField } = useSettings()
  const g = values.general
  const ro = !can('settings:update')

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader title="Thông tin chung" subtitle="Hiển thị trên thanh bên, tiêu đề trang và chứng chỉ" />
        <div className="divide-y divide-surface-line px-5">
          <SettingField label="Tên hệ thống" required htmlFor="s-sys" description="Dòng phụ dưới tên đơn vị ở thanh bên" error={errors['general.systemName']}>
            <Input id="s-sys" disabled={ro} value={g.systemName} onChange={(e) => setField('general', 'systemName', e.target.value)} />
          </SettingField>
          <SettingField label="Tên đơn vị" required htmlFor="s-org" description="In hoa trên thanh bên, in trên chứng chỉ" error={errors['general.orgName']}>
            <Input id="s-org" disabled={ro} value={g.orgName} onChange={(e) => setField('general', 'orgName', e.target.value)} />
          </SettingField>
          <SettingField label="Cơ quan chủ quản" htmlFor="s-parent" description="Dòng trên cùng của chứng chỉ" error={errors['general.parentOrg']}>
            <Input id="s-parent" disabled={ro} value={g.parentOrg} onChange={(e) => setField('general', 'parentOrg', e.target.value)} />
          </SettingField>
        </div>
      </Card>

      <Card>
        <CardHeader title="Mặc định cho khóa học mới" subtitle="Tự điền khi tạo khóa học, vẫn chỉnh được theo từng khóa" />
        <div className="divide-y divide-surface-line px-5">
          <SettingField label="Điểm đạt" htmlFor="s-pass" description="Thang 100" error={errors['general.defaultPassScore']}>
            <Input id="s-pass" type="number" min={0} max={100} disabled={ro} value={g.defaultPassScore} onChange={(e) => setField('general', 'defaultPassScore', e.target.valueAsNumber)} className="w-32" />
          </SettingField>
          <SettingField label="Thời gian làm bài (phút)" htmlFor="s-dur" description="0 = không giới hạn" error={errors['general.defaultDurationMin']}>
            <Input id="s-dur" type="number" min={0} disabled={ro} value={g.defaultDurationMin} onChange={(e) => setField('general', 'defaultDurationMin', e.target.valueAsNumber)} className="w-32" />
          </SettingField>
          <SettingField label="Số lượt thi tối đa" htmlFor="s-att" description="0 = không giới hạn" error={errors['general.defaultMaxAttempts']}>
            <Input id="s-att" type="number" min={0} disabled={ro} value={g.defaultMaxAttempts} onChange={(e) => setField('general', 'defaultMaxAttempts', e.target.valueAsNumber)} className="w-32" />
          </SettingField>
        </div>
      </Card>
    </div>
  )
}
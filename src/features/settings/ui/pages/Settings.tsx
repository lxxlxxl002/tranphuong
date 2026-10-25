import { AlertTriangle, Award, Headphones, RefreshCw, RotateCcw, Save, Settings2 } from 'lucide-react'
import { useCan } from '@/app/router/RoleGuard'
import { getErrorMessage } from '@/shared/api/errors'
import { cn } from '@/shared/lib/cn'
import { formatDateTime } from '@/shared/lib/date'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { EmptyState } from '@/shared/ui/EmptyState'
import { PageHeader } from '@/shared/ui/PageHeader'
import { Skeleton } from '@/shared/ui/Skeleton'
import { useSettings } from '../../hooks/useSettings'
import { useSettingsMutation } from '../../hooks/useSettingsMutation'
import { TABS } from '../../model/constants'
import type { SettingsTab } from '../../model/types'
import { BrandingSettings } from '../modules/BrandingSettings'
import { GeneralSettings } from '../modules/GeneralSettings'
import { SupportContactSettings } from '../modules/SupportContactSettings'

const ICONS: Record<SettingsTab, typeof Settings2> = { general: Settings2, support: Headphones, certificate: Award }

export default function SettingsPage() {
  const can = useCan()
  const s = useSettings()
  const { save, isSaving } = useSettingsMutation()

  if (s.isError) {
    return (
      <>
        <PageHeader title="Cài đặt hệ thống" />
        <Card>
          <EmptyState
            icon={AlertTriangle}
            title="Không tải được cài đặt"
            description={getErrorMessage(s.error)}
            action={
              <Button variant="secondary" size="sm" leftIcon={<RefreshCw />} onClick={() => void s.refetch()}>
                Thử lại
              </Button>
            }
          />
        </Card>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Cài đặt hệ thống"
        description={s.applied.updatedAt ? `Cập nhật lần cuối ${formatDateTime(s.applied.updatedAt)}` : 'Cấu hình chung áp dụng cho toàn hệ thống'}
      />

      <div className="grid gap-5 lg:grid-cols-[250px_minmax(0,1fr)]">
        <nav aria-label="Nhóm cài đặt" className="space-y-1.5 lg:sticky lg:top-20 lg:self-start">
          {TABS.map((t) => {
            const Icon = ICONS[t.key]
            const active = s.tab === t.key
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => s.setTab(t.key)}
                className={cn(
                  'flex w-full items-start gap-3 rounded-xl px-3.5 py-3 text-left transition',
                  active ? 'bg-white shadow-card ring-1 ring-brand-200' : 'hover:bg-white/70'
                )}
              >
                <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', active ? 'text-brand-600' : 'text-ink-faint')} />
                <span className="min-w-0 flex-1">
                  <span className={cn('flex items-center gap-1.5 text-sm font-semibold', active ? 'text-brand-700' : 'text-ink-soft')}>
                    {t.label}
                    {s.errorSections.has(t.key) && <span className="h-2 w-2 rounded-full bg-rose-500" title="Có lỗi" />}
                  </span>
                  <span className="mt-0.5 block text-xs text-ink-muted">{t.description}</span>
                </span>
              </button>
            )
          })}
        </nav>

        <div className="min-w-0 pb-24">
          {s.isLoading ? (
            <Skeleton className="h-[420px] w-full rounded-2xl" />
          ) : s.tab === 'general' ? (
            <GeneralSettings />
          ) : s.tab === 'support' ? (
            <SupportContactSettings />
          ) : (
            <BrandingSettings />
          )}
        </div>
      </div>

      {s.isDirty && can('settings:update') && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-surface-line bg-white/95 px-4 py-3 shadow-[0_-8px_24px_-12px_rgba(15,23,42,0.25)] backdrop-blur lg:pl-[290px]">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-amber-700">Bạn có thay đổi chưa lưu</p>
            <div className="flex gap-2">
              <Button variant="secondary" leftIcon={<RotateCcw />} onClick={s.discard}>
                Hủy thay đổi
              </Button>
              <Button leftIcon={<Save />} loading={isSaving} onClick={() => save(s.values)}>
                Lưu cài đặt
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
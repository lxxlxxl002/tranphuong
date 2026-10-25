import { useState } from 'react'
import { Link2, Upload } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import type { UploadKind, UploadResult } from '@/shared/api/uploads'
import { FileUpload } from './FileUpload'
import { Input } from './Input'

type Tab = 'upload' | 'link'

interface MediaFieldProps {
  kind: UploadKind
  value: string
  onChange: (url: string) => void
  disabled?: boolean
  error?: string
  linkPlaceholder?: string
  linkHint?: string
  previewClassName?: string
}

/** Ảnh bìa / video / tài liệu: tải file lên hoặc dán link có sẵn */
export function MediaField({ kind, value, onChange, disabled, error, linkPlaceholder, linkHint, previewClassName }: MediaFieldProps) {
  const isData = value.startsWith('blob:') || value.startsWith('data:')
  const [tab, setTab] = useState<Tab>(value && !isData ? 'link' : 'upload')

  const tabs: { key: Tab; label: string; icon: typeof Upload }[] = [
    { key: 'upload', label: 'Tải lên', icon: Upload },
    { key: 'link', label: 'Dán link', icon: Link2 }
  ]

  return (
    <div>
      <div className="mb-2.5 inline-flex rounded-lg bg-slate-100 p-0.5">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            disabled={disabled}
            onClick={() => setTab(t.key)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition',
              tab === t.key ? 'bg-white text-brand-700 shadow-sm' : 'text-ink-muted hover:text-ink'
            )}
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'upload' ? (
        <FileUpload
          kind={kind}
          value={isData ? value : ''}
          disabled={disabled}
          previewClassName={previewClassName}
          onUploaded={(r: UploadResult) => onChange(r.url)}
          onClear={() => onChange('')}
        />
      ) : (
        <Input
          value={isData ? '' : value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          placeholder={linkPlaceholder}
          error={error}
          hint={linkHint}
        />
      )}
    </div>
  )
}

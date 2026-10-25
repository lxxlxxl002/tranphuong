import { useCallback, useEffect, useRef, useState, type DragEvent } from 'react'
import { FileText, Film, ImageIcon, Loader2, UploadCloud, X } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { ACCEPT, formatBytes, uploadFile, validateUploadType, type UploadKind, type UploadResult } from '@/shared/api/uploads'
import { Button } from './Button'
import { ProgressBar } from './ProgressBar'

interface FileUploadProps {
  kind: UploadKind
  value: string
  onUploaded: (result: UploadResult) => void
  onClear: () => void
  disabled?: boolean
  className?: string
  /** Chiều cao vùng xem trước ảnh/video */
  previewClassName?: string
}

const ICONS: Record<UploadKind, typeof ImageIcon> = { image: ImageIcon, video: Film, document: FileText }
const HINTS: Record<UploadKind, string> = {
  image: 'PNG, JPG, WEBP, GIF',
  video: 'MP4, WEBM, MOV',
  document: 'PDF, Word, PowerPoint, Excel'
}

export function FileUpload({ kind, value, onUploaded, onClear, disabled, className, previewClassName }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [meta, setMeta] = useState<{ name: string; size: number } | null>(null)
  const Icon = ICONS[kind]

  useEffect(() => () => abortRef.current?.abort(), [])

  const handleFile = useCallback(
    async (file: File | undefined) => {
      if (!file) return
      const typeErr = validateUploadType(file, kind)
      if (typeErr) {
        setError(typeErr)
        return
      }
      setError(null)
      setMeta({ name: file.name, size: file.size })
      setUploading(true)
      setProgress(0)
      const controller = new AbortController()
      abortRef.current = controller
      try {
        const result = await uploadFile(file, kind, { onProgress: setProgress, signal: controller.signal })
        onUploaded(result)
      } catch (e) {
        if ((e as DOMException).name !== 'AbortError') setError(e instanceof Error ? e.message : 'Tải lên thất bại')
      } finally {
        setUploading(false)
        abortRef.current = null
        if (inputRef.current) inputRef.current.value = ''
      }
    },
    [kind, onUploaded]
  )

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
    if (!disabled && !uploading) void handleFile(e.dataTransfer.files?.[0])
  }

  const clear = () => {
    abortRef.current?.abort()
    setMeta(null)
    setError(null)
    setProgress(0)
    onClear()
  }

  if (value && !uploading) {
    return (
      <div className={cn('overflow-hidden rounded-xl border border-surface-line', className)}>
        {kind === 'image' ? (
          <img src={value} alt="" className={cn('w-full bg-slate-50 object-cover', previewClassName ?? 'h-44')} />
        ) : kind === 'video' ? (
          <video src={value} controls className={cn('w-full bg-slate-950', previewClassName ?? 'h-52')} />
        ) : (
          <div className="flex items-center gap-3 p-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <FileText className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{meta?.name ?? 'Tài liệu đã tải lên'}</p>
              {meta && <p className="text-xs text-ink-muted">{formatBytes(meta.size)}</p>}
            </div>
            <a href={value} target="_blank" rel="noreferrer" className="text-sm font-semibold text-brand-600 hover:underline">
              Xem
            </a>
          </div>
        )}
        <div className="flex items-center justify-between gap-2 border-t border-surface-line px-3 py-2">
          <span className="truncate text-xs text-ink-muted">{meta?.name ?? 'Đã tải lên'}</span>
          <Button size="sm" variant="ghost" leftIcon={<X />} disabled={disabled} onClick={clear}>
            Xóa / thay file
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <input ref={inputRef} type="file" accept={ACCEPT[kind]} className="hidden" onChange={(e) => void handleFile(e.target.files?.[0])} />
      <button
        type="button"
        disabled={disabled || uploading}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled && !uploading) setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          'flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition disabled:cursor-not-allowed',
          dragging ? 'border-brand-500 bg-brand-50 ring-4 ring-brand-500/10' : 'border-surface-line hover:border-brand-300 hover:bg-slate-50'
        )}
      >
        {uploading ? (
          <>
            <Loader2 className="h-9 w-9 animate-spin text-brand-500" />
            <div className="w-full max-w-xs">
              <p className="mb-1.5 truncate text-sm font-medium text-ink">Đang tải {meta?.name}</p>
              <ProgressBar value={progress} showLabel />
            </div>
          </>
        ) : (
          <>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-500">
              <UploadCloud className="h-6 w-6" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">
                Kéo thả {kind === 'image' ? 'ảnh' : kind === 'video' ? 'video' : 'tài liệu'} vào đây
              </p>
              <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-ink-muted">
                <Icon className="h-3.5 w-3.5" />
                hoặc bấm để chọn · {HINTS[kind]}
              </p>
            </div>
          </>
        )}
      </button>
      {error && <p className="mt-2 text-xs text-rose-500">{error}</p>}
    </div>
  )
}
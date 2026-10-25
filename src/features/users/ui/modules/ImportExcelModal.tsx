import { useRef, useState, type DragEvent } from 'react'
import { CheckCircle2, FileDown, FileSpreadsheet, Loader2, UploadCloud, XCircle } from 'lucide-react'
import { toast } from '@/app/providers/ToastProvider'
import { getErrorMessage } from '@/shared/api/errors'
import { cn } from '@/shared/lib/cn'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'
import { useUserList } from '../../hooks/useUserList'
import { useUserMutation } from '../../hooks/useUserMutation'
import { IMPORT_ACCEPT } from '../../model/constants'
import type { ImportUserRow, UserInput } from '../../model/types'

export function ImportExcelModal() {
  const { importOpen, closeImport, departments, all } = useUserList()
  const m = useUserMutation()
  const fileRef = useRef<HTMLInputElement>(null)
  const [rows, setRows] = useState<ImportUserRow[] | null>(null)
  const [fileName, setFileName] = useState('')
  const [parsing, setParsing] = useState(false)
  const [dragging, setDragging] = useState(false)

  const reset = () => {
    setRows(null)
    setFileName('')
    if (fileRef.current) fileRef.current.value = ''
  }
  const close = () => {
    reset()
    closeImport()
  }

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    setParsing(true)
    setFileName(file.name)
    try {
      setRows(await m.parseFile(file, { departments, existingEmails: new Set(all.map((u) => u.email)) }))
    } catch (err) {
      toast.error(getErrorMessage(err))
      reset()
    } finally {
      setParsing(false)
    }
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
    void handleFile(e.dataTransfer.files?.[0])
  }

  const summary = rows ? m.summarize(rows) : null
  const valid: UserInput[] = rows?.flatMap((r) => (r.input ? [r.input] : [])) ?? []

  const submit = async () => {
    try {
      await m.importUsers(valid)
      close()
    } catch {
      /* toast */
    }
  }

  return (
    <Modal
      open={importOpen}
      onClose={close}
      size="xl"
      title="Nhập người dùng từ Excel"
      description="Tài khoản mới được kích hoạt ngay. Mật khẩu tạm do hệ thống gửi qua email công vụ."
      footer={
        <>
          <Button variant="ghost" leftIcon={<FileDown />} className="mr-auto" onClick={() => void m.downloadTemplate(departments)}>
            Tải file mẫu
          </Button>
          <Button variant="secondary" onClick={close}>
            Hủy
          </Button>
          {rows && (
            <Button variant="secondary" onClick={reset}>
              Chọn tệp khác
            </Button>
          )}
          <Button disabled={!valid.length} loading={m.isImporting} onClick={() => void submit()}>
            Nhập {valid.length || ''} người dùng
          </Button>
        </>
      }
    >
      <input ref={fileRef} type="file" accept={IMPORT_ACCEPT} className="hidden" onChange={(e) => void handleFile(e.target.files?.[0])} />
      {!rows ? (
        <button
          type="button"
          disabled={parsing}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            'flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-14 text-center transition',
            dragging ? 'border-brand-500 bg-brand-50' : 'border-surface-line hover:border-brand-300 hover:bg-slate-50'
          )}
        >
          {parsing ? <Loader2 className="h-10 w-10 animate-spin text-brand-500" /> : <UploadCloud className="h-10 w-10 text-brand-500" />}
          <div>
            <p className="font-semibold text-ink">{parsing ? `Đang đọc ${fileName}...` : 'Kéo thả tệp Excel vào đây'}</p>
            <p className="mt-1 text-sm text-ink-muted">hoặc bấm để chọn tệp · .xlsx · Tối đa 500 người</p>
          </div>
        </button>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-ink">
              <FileSpreadsheet className="h-4 w-4 text-green-600" />
              {fileName}
            </span>
            <Badge tone="success">{summary?.valid} hợp lệ</Badge>
            {!!summary?.invalid && <Badge tone="danger">{summary.invalid} lỗi</Badge>}
          </div>
          <div className="max-h-[50vh] overflow-auto rounded-xl border border-surface-line scrollbar-thin">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-slate-50">
                <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                  <th className="px-3 py-2.5">Dòng</th>
                  <th className="px-3 py-2.5">Họ và tên</th>
                  <th className="px-3 py-2.5">Email</th>
                  <th className="px-3 py-2.5">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.row} className={cn('border-t border-surface-line align-top', !r.input && 'bg-rose-50/40')}>
                    <td className="px-3 py-2.5 tabular-nums text-ink-muted">{r.row}</td>
                    <td className="px-3 py-2.5 text-ink-soft">{r.preview}</td>
                    <td className="break-all px-3 py-2.5 text-ink-soft">{r.email || '—'}</td>
                    <td className="px-3 py-2.5">
                      {r.input ? (
                        <span className="inline-flex items-center gap-1 text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                          Hợp lệ
                        </span>
                      ) : (
                        <ul className="space-y-0.5 text-xs text-rose-600">
                          {r.errors.map((e) => (
                            <li key={e} className="flex gap-1">
                              <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                              {e}
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Modal>
  )
}
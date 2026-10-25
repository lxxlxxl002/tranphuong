import type { ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Modal } from './Modal'
import { Button } from './Button'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title?: ReactNode
  message?: ReactNode
  confirmText?: string
  cancelText?: string
  tone?: 'danger' | 'primary'
  loading?: boolean
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Xác nhận',
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  tone = 'danger',
  loading
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={loading ? () => {} : onClose}
      size="sm"
      hideClose
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} loading={loading} onClick={() => void onConfirm()}>
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="flex gap-4">
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-full',
            tone === 'danger' ? 'bg-rose-50 text-rose-500' : 'bg-brand-50 text-brand-600'
          )}
        >
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-ink">{title}</h3>
          {message && <p className="mt-1.5 text-sm text-ink-muted">{message}</p>}
        </div>
      </div>
    </Modal>
  )
}
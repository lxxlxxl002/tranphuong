import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { create } from 'zustand'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

type ToastType = 'success' | 'error' | 'info'

interface ToastItem {
  id: number
  type: ToastType
  message: string
  duration: number
}

interface ToastState {
  items: ToastItem[]
  push: (t: Omit<ToastItem, 'id'>) => void
  dismiss: (id: number) => void
}

let seq = 0

const useToastStore = create<ToastState>((set) => ({
  items: [],
  push: (t) => set((s) => ({ items: [...s.items.slice(-4), { ...t, id: ++seq }] })),
  dismiss: (id) => set((s) => ({ items: s.items.filter((x) => x.id !== id) }))
}))

const show =
  (type: ToastType) =>
  (message: string, duration = 3500) =>
    useToastStore.getState().push({ type, message, duration })

/** Gọi ở bất kỳ đâu: toast.success('Đã lưu') */
export const toast = { success: show('success'), error: show('error'), info: show('info') }

const ICONS = { success: CheckCircle2, error: AlertCircle, info: Info }
const COLORS = { success: 'text-green-600', error: 'text-rose-500', info: 'text-brand-600' }

function ToastCard({ item }: { item: ToastItem }) {
  const dismiss = useToastStore((s) => s.dismiss)
  useEffect(() => {
    const t = setTimeout(() => dismiss(item.id), item.duration)
    return () => clearTimeout(t)
  }, [item.id, item.duration, dismiss])
  const Icon = ICONS[item.type]
  return (
    <div role="status" className="pointer-events-auto flex w-80 items-start gap-3 rounded-xl border border-surface-line bg-white p-4 shadow-pop">
      <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', COLORS[item.type])} />
      <p className="flex-1 text-sm text-ink-soft">{item.message}</p>
      <button type="button" aria-label="Đóng" onClick={() => dismiss(item.id)} className="text-ink-faint hover:text-ink">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const items = useToastStore((s) => s.items)
  return (
    <>
      {children}
      {createPortal(
        <div className="pointer-events-none fixed right-4 top-4 z-[60] flex flex-col gap-2">
          {items.map((i) => (
            <ToastCard key={i.id} item={i} />
          ))}
        </div>,
        document.body
      )}
    </>
  )
}
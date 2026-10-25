import type { Key, ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import { Skeleton } from './Skeleton'
import { EmptyState } from './EmptyState'

export interface Column<T> {
  key: string
  header: ReactNode
  render?: (row: T, index: number) => ReactNode
  align?: 'left' | 'center' | 'right'
  width?: string
  className?: string
  headerClassName?: string
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  rowKey: (row: T) => Key
  loading?: boolean
  skeletonRows?: number
  empty?: ReactNode
  onRowClick?: (row: T) => void
  selectedKey?: Key | null
  dense?: boolean
  className?: string
}

const ALIGN = { left: 'text-left', center: 'text-center', right: 'text-right' } as const

export function Table<T>({
  columns,
  data,
  rowKey,
  loading,
  skeletonRows = 5,
  empty,
  onRowClick,
  selectedKey,
  dense,
  className
}: TableProps<T>) {
  const cellPad = dense ? 'px-4 py-3' : 'px-4 py-4'
  return (
    <div className={cn('overflow-x-auto scrollbar-thin [scrollbar-gutter:stable] [-webkit-overflow-scrolling:touch]', className)}>
      <table className="w-full min-w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-surface-line">
            {columns.map((c) => (
              <th
                key={c.key}
                style={c.width ? { width: c.width } : undefined}
                className={cn(
                  'whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-ink-faint',
                  ALIGN[c.align ?? 'left'],
                  c.headerClassName
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: skeletonRows }).map((_, i) => (
              <tr key={i} className="border-b border-surface-line last:border-0">
                {columns.map((c) => (
                  <td key={c.key} className={cellPad}>
                    <Skeleton className="h-4 w-full max-w-[160px]" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4">
                {empty ?? <EmptyState title="Chưa có dữ liệu" compact />}
              </td>
            </tr>
          ) : (
            data.map((row, i) => {
              const k = rowKey(row)
              return (
                <tr
                  key={k}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    'border-b border-surface-line transition-colors last:border-0',
                    onRowClick && 'cursor-pointer hover:bg-slate-50/70',
                    selectedKey === k && 'bg-brand-50/60'
                  )}
                >
                  {columns.map((c) => (
                    <td key={c.key} className={cn(cellPad, 'align-middle text-ink-soft', ALIGN[c.align ?? 'left'], c.className)}>
                      {c.render ? c.render(row, i) : String((row as unknown as Record<string, unknown>)[c.key] ?? '')}
                    </td>
                  ))}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

import { Database } from 'lucide-react'
import { CourseCover } from '@/features/my-courses'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { Skeleton } from '@/shared/ui/Skeleton'
import type { QuestionBank } from '../../model/types'

export function BankCard({ bank, onManage }: { bank: QuestionBank; onManage: () => void }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-surface-line bg-white shadow-card transition hover:shadow-pop">
      <CourseCover course={{ id: bank.courseId, title: bank.courseTitle, coverUrl: bank.coverUrl }} className="h-[180px]" />
      <div className="flex flex-1 flex-col p-4">
        <div>
          <Badge tone={bank.questionCount > 0 ? 'success' : 'warning'}>{bank.questionCount} câu hỏi</Badge>
        </div>
        <h3 className="mt-3 line-clamp-2 text-[15px] font-semibold uppercase leading-5 text-ink" title={bank.courseTitle}>
          {bank.courseTitle}
        </h3>
        <Button className="mt-5" fullWidth leftIcon={<Database />} onClick={onManage}>
          Quản lý câu hỏi
        </Button>
      </div>
    </article>
  )
}

export function BankCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-surface-line bg-white shadow-card">
      <Skeleton className="h-[180px] w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  )
}
import { Award, BookOpen, ClipboardCheck, Clock } from 'lucide-react'
import { formatDuration } from '@/shared/lib/date'
import { Card } from '@/shared/ui/Card'
import { Skeleton } from '@/shared/ui/Skeleton'
import { useProgress } from '../../hooks/useProgress'
import { formatAverage } from '../../lib/utils'
import { MetricTile } from '../components/MetricTile'
import { ProgressRing } from '../components/ProgressRing'

export function OverviewCard() {
  const { summary, isLoading } = useProgress()

  const tiles = [
    { icon: Clock, label: 'Tổng thời gian học', value: formatDuration(summary?.totalStudySec) },
    { icon: BookOpen, label: 'Bài đã học', value: `${summary?.lessonsDone ?? 0}/${summary?.lessonsTotal ?? 0}` },
    { icon: ClipboardCheck, label: 'Bài kiểm tra', value: `${summary?.quizzesPassed ?? 0}/${summary?.quizzesTaken ?? 0}` },
    { icon: Award, label: 'Điểm trung bình', value: formatAverage(summary?.averageScore ?? null) }
  ]

  return (
    <Card className="flex flex-col items-center gap-6 p-6 lg:flex-row">
      {isLoading ? <Skeleton className="h-[150px] w-[150px] shrink-0 rounded-full" /> : <ProgressRing value={summary?.overallPercent ?? 0} />}
      <div className="grid w-full flex-1 grid-cols-2 gap-4 xl:grid-cols-4">
        {tiles.map((t) => (
          <MetricTile key={t.label} icon={t.icon} label={t.label} value={t.value} loading={isLoading} />
        ))}
      </div>
    </Card>
  )
}
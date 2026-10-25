import { PageHeader } from '@/shared/ui/PageHeader'
import { CourseProgressList } from '../modules/CourseProgressList'
import { OverviewCard } from '../modules/OverviewCard'

export default function ProgressOverview() {
  return (
    <>
      <PageHeader title="Tiến độ học tập" description="Theo dõi tiến độ học tập trên từng khóa học" />
      <div className="space-y-5">
        <OverviewCard />
        <CourseProgressList />
      </div>
    </>
  )
}
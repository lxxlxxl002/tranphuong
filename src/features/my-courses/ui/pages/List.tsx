import { PageHeader } from '@/shared/ui/PageHeader'
import { CourseGrid } from '../modules/CourseGrid'

export default function MyCoursesList() {
  return (
    <>
      <PageHeader title="Khóa học của tôi" description="Danh sách các khóa học bạn đang tham gia" />
      <CourseGrid />
    </>
  )
}
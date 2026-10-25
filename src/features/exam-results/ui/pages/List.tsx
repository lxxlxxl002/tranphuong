import { PageHeader } from '@/shared/ui/PageHeader'
import { ResultTable } from '../modules/ResultTable'

export default function ExamResultsList() {
  return (
    <>
      <PageHeader title="Kết quả kiểm tra" />
      <ResultTable />
    </>
  )
}
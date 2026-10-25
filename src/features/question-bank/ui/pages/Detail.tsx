import { useNavigate, useParams } from 'react-router'
import { ArrowLeft, CircleDot, FileDown, FileUp, ListChecks, Plus, SquareCheckBig } from 'lucide-react'
import { useCan } from '@/app/router/RoleGuard'
import { PATHS } from '@/app/router/paths'
import { Button } from '@/shared/ui/Button'
import { PageHeader } from '@/shared/ui/PageHeader'
import { StatCard } from '@/shared/ui/StatCard'
import { useQuestionList } from '../../hooks/useQuestionList'
import { useQuestionMutation } from '../../hooks/useQuestionMutation'
import { ImportQuestionModal } from '../modules/ImportQuestionModal'
import { QuestionForm } from '../modules/QuestionForm'
import { QuestionTable } from '../modules/QuestionTable'

export default function QuestionBankDetail() {
  const { courseId = '' } = useParams()
  const navigate = useNavigate()
  const can = useCan()
  const list = useQuestionList(courseId)
  const m = useQuestionMutation(courseId)
  const canCreate = can('question-bank:create')

  return (
    <>
      <PageHeader
        title={list.courseTitle || 'Ngân hàng câu hỏi'}
        description="Quản lý câu hỏi kiểm tra cuối khóa"
        actions={
          <>
            <Button variant="secondary" leftIcon={<ArrowLeft />} onClick={() => navigate(PATHS.questionBank)}>
              Quay lại
            </Button>
            {canCreate && (
              <>
                <Button variant="secondary" leftIcon={<FileDown />} onClick={() => void m.downloadTemplate()}>
                  Tải file mẫu
                </Button>
                <Button variant="secondary" leftIcon={<FileUp />} onClick={list.openImport}>
                  Import Excel
                </Button>
                <Button leftIcon={<Plus />} onClick={list.openCreate}>
                  Thêm câu hỏi
                </Button>
              </>
            )}
          </>
        }
      />

      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <StatCard icon={ListChecks} label="Tổng số câu" value={list.counts.ALL} unit="câu" unitInline tone="blue" loading={list.isLoading} />
        <StatCard icon={CircleDot} label="Một đáp án" value={list.counts.SINGLE} unit="câu" unitInline tone="green" loading={list.isLoading} />
        <StatCard icon={SquareCheckBig} label="Nhiều đáp án" value={list.counts.MULTIPLE} unit="câu" unitInline tone="purple" loading={list.isLoading} />
      </div>

      <QuestionTable courseId={courseId} />
      <QuestionForm courseId={courseId} />
      <ImportQuestionModal courseId={courseId} />
    </>
  )
}
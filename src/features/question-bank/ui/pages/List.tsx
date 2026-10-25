import { useNavigate } from 'react-router'
import { AlertTriangle, Database, RefreshCw } from 'lucide-react'
import { getErrorMessage } from '@/shared/api/errors'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { EmptyState } from '@/shared/ui/EmptyState'
import { PageHeader } from '@/shared/ui/PageHeader'
import { SearchInput } from '@/shared/ui/SearchInput'
import { useQuestionBanks } from '../../hooks/useQuestionBanks'
import { bankDetailPath } from '../../lib/utils'
import { BankCard, BankCardSkeleton } from '../components/BankCard'

const GRID = 'grid gap-5 md:grid-cols-2 xl:grid-cols-3'

export default function QuestionBankList() {
  const navigate = useNavigate()
  const { banks, total, search, setSearch, isLoading, isError, error, refetch } = useQuestionBanks()

  return (
    <>
      <PageHeader title="Ngân hàng câu hỏi" actions={<SearchInput value={search} onChange={setSearch} placeholder="Tìm khóa học..." className="w-72" />} />
      {isError ? (
        <Card>
          <EmptyState
            icon={AlertTriangle}
            title="Không tải được ngân hàng câu hỏi"
            description={getErrorMessage(error)}
            action={
              <Button variant="secondary" size="sm" leftIcon={<RefreshCw />} onClick={() => void refetch()}>
                Thử lại
              </Button>
            }
          />
        </Card>
      ) : isLoading ? (
        <div className={GRID}>
          {Array.from({ length: 3 }).map((_, i) => (
            <BankCardSkeleton key={i} />
          ))}
        </div>
      ) : banks.length === 0 ? (
        <Card>
          <EmptyState icon={Database} title={total === 0 ? 'Chưa có khóa học nào' : 'Không tìm thấy khóa học phù hợp'} />
        </Card>
      ) : (
        <div className={GRID}>
          {banks.map((b) => (
            <BankCard key={b.courseId} bank={b} onManage={() => navigate(bankDetailPath(b.courseId))} />
          ))}
        </div>
      )}
    </>
  )
}
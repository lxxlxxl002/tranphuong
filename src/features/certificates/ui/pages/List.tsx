import { PageHeader } from '@/shared/ui/PageHeader'
import { SearchInput } from '@/shared/ui/SearchInput'
import { useCertificates } from '../../hooks/useCertificates'
import { CertificateGrid } from '../modules/CertificateGrid'

export default function CertificatesList() {
  const { total, search, setSearch } = useCertificates()
  return (
    <>
      <PageHeader
        title="Chứng chỉ"
        description="Các chứng chỉ bạn đã đạt được khi hoàn thành khóa học"
        actions={total > 0 && <SearchInput value={search} onChange={setSearch} placeholder="Tìm theo khóa học, mã số..." className="w-72" />}
      />
      <CertificateGrid />
    </>
  )
}
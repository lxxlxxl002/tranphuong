import { SearchInput } from '@/shared/ui/SearchInput'
import { Select } from '@/shared/ui/Select'
import { useCourseList } from '../../hooks/useCourseList'
import { STATUS_FILTER_OPTIONS } from '../../model/constants'

export function Filters() {
  const { status, setStatus, search, setSearch } = useCourseList()
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Select
        aria-label="Lọc theo trạng thái"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        options={STATUS_FILTER_OPTIONS}
        containerClassName="sm:w-52"
      />
      <SearchInput value={search} onChange={setSearch} placeholder="Tìm khóa học..." className="w-full sm:w-72" />
    </div>
  )
}
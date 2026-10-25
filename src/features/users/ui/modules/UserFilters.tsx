import { SearchInput } from '@/shared/ui/SearchInput'
import { Select } from '@/shared/ui/Select'
import { ROLE_ORDER, roleLabel } from '@/shared/constants/roles'
import { useUserList } from '../../hooks/useUserList'
import { STATUS_FILTER_OPTIONS } from '../../model/constants'

const ROLE_OPTIONS = [{ value: 'ALL', label: 'Tất cả vai trò' }, ...ROLE_ORDER.map((r) => ({ value: r, label: roleLabel(r) }))]

export function UserFilters() {
  const { filters, setRole, setStatus, setSearch } = useUserList()
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <Select aria-label="Lọc vai trò" value={filters.role} onChange={(e) => setRole(e.target.value)} options={ROLE_OPTIONS} containerClassName="lg:w-44" />
      <Select aria-label="Lọc trạng thái" value={filters.status} onChange={(e) => setStatus(e.target.value)} options={STATUS_FILTER_OPTIONS} containerClassName="lg:w-44" />
      <SearchInput value={filters.search} onChange={setSearch} placeholder="Tìm theo tên, email, mã CB..." className="lg:ml-auto lg:w-72" />
    </div>
  )
}
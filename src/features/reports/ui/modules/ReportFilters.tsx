import { Select } from '@/shared/ui/Select'
import { useReport } from '../../hooks/useReport'
import { RATE_OPTIONS } from '../../model/constants'

export function ReportFilters() {
  const { filters, departmentOptions, roleOptions, setDepartment, setRole, setRate } = useReport()
  return (
    <div className="flex flex-col gap-3 md:flex-row">
      <Select aria-label="Lọc phòng ban" value={filters.departmentId} onChange={(e) => setDepartment(e.target.value)} options={departmentOptions} containerClassName="md:flex-1" />
      <Select aria-label="Lọc vai trò" value={filters.role} onChange={(e) => setRole(e.target.value)} options={roleOptions} containerClassName="md:w-44" />
      <Select aria-label="Lọc tỷ lệ hoàn thành" value={filters.rate} onChange={(e) => setRate(e.target.value)} options={RATE_OPTIONS} containerClassName="md:w-48" />
    </div>
  )
}
import { isDemoMode } from '@/features/auth'
import { roleLabel } from '@/shared/constants/roles'
import { formatDateTime } from '@/shared/lib/date'
import { logExportRequest } from '../api/mutations'
import { REPORTS_CONFIG } from '../config/reports.config'
import { downloadBlob, exportFileName, toArrayBuffer } from '../lib/utils'
import { EXPORT_COLORS, NO_DEPT_LABEL } from '../model/constants'
import type { ExportInput } from '../model/types'

type ExcelNS = typeof import('exceljs')
type Worksheet = import('exceljs').Worksheet

const loadExcel = async (): Promise<ExcelNS> => {
  const mod = await import('exceljs')
  return ((mod as unknown as { default?: ExcelNS }).default ?? mod) as ExcelNS
}

const styleHeader = (ws: Worksheet, rowNumber: number) => {
  const row = ws.getRow(rowNumber)
  row.height = 26
  row.eachCell((c) => {
    c.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: EXPORT_COLORS.header } }
    c.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
  })
}

const zebra = (ws: Worksheet, from: number, to: number) => {
  for (let r = from; r <= to; r++) {
    if ((r - from) % 2 === 1) {
      ws.getRow(r).eachCell((c) => {
        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: EXPORT_COLORS.zebra } }
      })
    }
  }
}

export const exportService = {
  async buildWorkbookBuffer(input: ExportInput): Promise<ArrayBuffer> {
    const ExcelJS = await loadExcel()
    const wb = new ExcelJS.Workbook()
    wb.creator = REPORTS_CONFIG.orgName
    wb.created = input.generatedAt

    /* --- Tổng hợp --- */
    const sum = wb.addWorksheet('Tong hop')
    sum.columns = [{ width: 34 }, { width: 20 }]
    sum.mergeCells('A1:B1')
    sum.getCell('A1').value = REPORTS_CONFIG.reportTitle
    sum.getCell('A1').font = { bold: true, size: 15, color: { argb: EXPORT_COLORS.title } }
    sum.getCell('A2').value = REPORTS_CONFIG.orgName
    sum.getCell('A2').font = { bold: true }
    sum.getCell('A3').value = `Thời điểm xuất: ${formatDateTime(input.generatedAt)}`
    input.filterSummary.forEach((line, i) => (sum.getCell(`A${4 + i}`).value = line))
    const start = 5 + input.filterSummary.length
    sum.getRow(start).values = ['Chỉ số', 'Giá trị']
    styleHeader(sum, start)
    const metrics: [string, number][] = [
      ['Tổng người dùng', input.stats.totalUsers],
      ['Khóa học', input.stats.totalCourses],
      ['Lượt ghi danh', input.stats.totalEnrollments],
      ['Chứng chỉ đã cấp', input.stats.totalCertificates],
      ['Số công chức trong báo cáo', input.staff.length]
    ]
    metrics.forEach(([k, v], i) => (sum.getRow(start + 1 + i).values = [k, v]))

    /* --- Công chức --- */
    const ws = wb.addWorksheet('Cong chuc', { views: [{ state: 'frozen', ySplit: 1 }] })
    ws.columns = [
      { header: 'STT', width: 6 },
      { header: 'Họ tên', width: 26 },
      { header: 'Email', width: 32 },
      { header: 'Phòng / Ban', width: 44 },
      { header: 'Vai trò', width: 18 },
      { header: 'Khóa hoàn thành', width: 16 },
      { header: 'Khóa được giao', width: 15 },
      { header: 'Điểm TB', width: 10 },
      { header: 'Tỷ lệ hoàn thành (%)', width: 20 }
    ]
    styleHeader(ws, 1)
    input.staff.forEach((s, i) =>
      ws.addRow([
        i + 1,
        s.fullName,
        s.email,
        s.departmentId ? s.departmentName : NO_DEPT_LABEL,
        roleLabel(s.role),
        s.completedCourses,
        s.enrolledCourses,
        s.averageScore ?? 0,
        s.completionRate
      ])
    )
    zebra(ws, 2, input.staff.length + 1)
    if (input.staff.length) ws.autoFilter = { from: 'A1', to: `I${input.staff.length + 1}` }

    /* --- Phòng ban --- */
    const dp = wb.addWorksheet('Phong ban', { views: [{ state: 'frozen', ySplit: 1 }] })
    dp.columns = [
      { header: 'STT', width: 6 },
      { header: 'Phòng / Ban', width: 50 },
      { header: 'Số công chức', width: 14 },
      { header: 'Tỷ lệ hoàn thành (%)', width: 20 }
    ]
    styleHeader(dp, 1)
    input.departments.forEach((d, i) => dp.addRow([i + 1, d.departmentName, d.staffCount, d.completionRate]))
    zebra(dp, 2, input.departments.length + 1)

    return toArrayBuffer((await wb.xlsx.writeBuffer()) as ArrayBuffer)
  },

  /** Tạo + tải file, ghi nhật ký (lỗi ghi nhật ký không chặn việc tải) */
  async exportExcel(input: ExportInput): Promise<string> {
    const fileName = exportFileName(input.generatedAt)
    const buffer = await exportService.buildWorkbookBuffer(input)
    downloadBlob(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), fileName)
    if (!isDemoMode()) {
      logExportRequest({ fileName, rows: input.staff.length, filters: input.filterSummary }).catch(() => undefined)
    }
    return fileName
  }
}
import { ApiError } from '@/shared/api/errors'
import { roleLabel, ROLE_ORDER } from '@/shared/constants/roles'
import { normalizeText } from '@/shared/lib/format'
import { cellText, downloadBlob, readFileAsArrayBuffer, toArrayBuffer } from '../lib/utils'
import { isEmail, validateUserInput } from '../lib/validators'
import { MAX_IMPORT_ROWS, ROLE_INPUT_ALIASES, TEMPLATE_FILE_NAME, TEMPLATE_HEADERS, TEMPLATE_WIDTHS } from '../model/constants'
import type { DepartmentOption, ImportUserRow, UserInput } from '../model/types'

type ExcelNS = typeof import('exceljs')

const loadExcel = async (): Promise<ExcelNS> => {
  const mod = await import('exceljs')
  return ((mod as unknown as { default?: ExcelNS }).default ?? mod) as ExcelNS
}

type Field = 'fullName' | 'email' | 'code' | 'phone' | 'department' | 'role'

const headerToField = (header: string): Field | null => {
  const h = normalizeText(header)
  if (h === 'ho va ten' || h === 'ho ten') return 'fullName'
  if (h === 'email') return 'email'
  if (h.startsWith('ma can bo') || h === 'ma cb') return 'code'
  if (h.includes('dien thoai')) return 'phone'
  if (h.startsWith('phong')) return 'department'
  if (h.startsWith('vai tro')) return 'role'
  return null
}

export interface ImportContext {
  departments: DepartmentOption[]
  existingEmails: Set<string>
}

export const userImportService = {
  async buildTemplateBuffer(departments: DepartmentOption[]): Promise<ArrayBuffer> {
    const ExcelJS = await loadExcel()
    const wb = new ExcelJS.Workbook()
    const ws = wb.addWorksheet('Nguoi dung', { views: [{ state: 'frozen', ySplit: 1 }] })
    ws.columns = TEMPLATE_HEADERS.map((header, i) => ({ header, width: TEMPLATE_WIDTHS[i] }))
    const head = ws.getRow(1)
    head.height = 28
    head.eachCell((c) => {
      c.font = { bold: true, color: { argb: 'FFFFFFFF' } }
      c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } }
      c.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    })
    ws.addRow(['1', 'Nguyễn Văn An', 'an.nguyenvan@sbv.gov.vn', 'CB101', '0912345678', departments[0]?.code ?? '', 'Học viên'])
    ws.addRow(['2', 'Lê Thị Bình', 'binh.lethi@sbv.gov.vn', 'CB102', '', departments[1]?.name ?? '', 'Giảng viên'])
    const roles = ROLE_ORDER.map(roleLabel).join(',')
    for (let r = 2; r <= MAX_IMPORT_ROWS + 1; r++) {
      ws.getCell(`G${r}`).dataValidation = { type: 'list', allowBlank: true, formulae: [`"${roles}"`] }
    }

    const dp = wb.addWorksheet('Phong ban')
    dp.columns = [
      { header: 'Mã', width: 10 },
      { header: 'Tên phòng/ban', width: 55 }
    ]
    dp.getRow(1).font = { bold: true }
    departments.forEach((d) => dp.addRow([d.code, d.name]))

    return toArrayBuffer((await wb.xlsx.writeBuffer()) as ArrayBuffer)
  },

  async downloadTemplate(departments: DepartmentOption[]): Promise<void> {
    const buffer = await userImportService.buildTemplateBuffer(departments)
    downloadBlob(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), TEMPLATE_FILE_NAME)
  },

  rowToImport(row: number, cells: Partial<Record<Field, string>>, ctx: ImportContext, seen: Set<string>): ImportUserRow {
    const errors: string[] = []
    const email = (cells.email ?? '').trim().toLowerCase()

    let role: UserInput['role'] = 'LEARNER'
    if (cells.role) {
      const mapped = ROLE_INPUT_ALIASES[normalizeText(cells.role).replace(/[_-]+/g, ' ')]
      if (mapped) role = mapped
      else errors.push(`Vai trò "${cells.role}" không hợp lệ`)
    }

    let departmentId = ''
    if (cells.department) {
      const key = normalizeText(cells.department)
      const d = ctx.departments.find((x) => normalizeText(x.code) === key || normalizeText(x.name) === key)
      if (d) departmentId = d.id
      else errors.push(`Không tìm thấy phòng/ban "${cells.department}"`)
    }

    const input: UserInput = {
      fullName: (cells.fullName ?? '').trim(),
      email,
      code: (cells.code ?? '').trim(),
      phone: (cells.phone ?? '').trim(),
      departmentId,
      role,
      status: 'ACTIVE'
    }
    for (const msg of Object.values(validateUserInput(input))) if (msg && !errors.includes(msg)) errors.push(msg)

    if (isEmail(email)) {
      if (ctx.existingEmails.has(email)) errors.push('Email đã tồn tại trong hệ thống')
      else if (seen.has(email)) errors.push('Email bị trùng trong tệp')
      seen.add(email)
    }

    return { row, preview: input.fullName || '(trống)', email, input: errors.length ? null : input, errors }
  },

  async parseBuffer(buffer: ArrayBuffer, ctx: ImportContext): Promise<ImportUserRow[]> {
    const ExcelJS = await loadExcel()
    const wb = new ExcelJS.Workbook()
    try {
      await wb.xlsx.load(buffer)
    } catch {
      throw new ApiError('VALIDATION', 'Không đọc được tệp. Vui lòng dùng định dạng .xlsx theo file mẫu')
    }
    const ws = wb.worksheets[0]
    if (!ws) throw new ApiError('VALIDATION', 'Tệp không có trang tính nào')

    const columns = new Map<number, Field>()
    ws.getRow(1).eachCell((cell, col) => {
      const f = headerToField(cellText(cell.value))
      if (f) columns.set(col, f)
    })
    const fields = [...columns.values()]
    if (!fields.includes('fullName') || !fields.includes('email')) {
      throw new ApiError('VALIDATION', 'Không đúng file mẫu: cần cột "Họ và tên" và "Email"')
    }

    const seen = new Set<string>()
    const rows: ImportUserRow[] = []
    for (let r = 2; r <= ws.rowCount; r++) {
      const cells: Partial<Record<Field, string>> = {}
      columns.forEach((field, col) => {
        const t = cellText(ws.getRow(r).getCell(col).value)
        if (t) cells[field] = t
      })
      if (!cells.fullName && !cells.email) continue
      rows.push(userImportService.rowToImport(r, cells, ctx, seen))
      if (rows.length > MAX_IMPORT_ROWS) throw new ApiError('VALIDATION', `Tối đa ${MAX_IMPORT_ROWS} người mỗi lần nhập`)
    }
    if (!rows.length) throw new ApiError('VALIDATION', 'Tệp không có người dùng nào')
    return rows
  },

  async parseFile(file: File, ctx: ImportContext): Promise<ImportUserRow[]> {
    if (!/\.xlsx$/i.test(file.name)) throw new ApiError('VALIDATION', 'Chỉ hỗ trợ tệp Excel .xlsx')
    return userImportService.parseBuffer(await readFileAsArrayBuffer(file), ctx)
  },

  summarize(rows: ImportUserRow[]) {
    const valid = rows.filter((r) => r.input).length
    return { total: rows.length, valid, invalid: rows.length - valid }
  }
}
import { ApiError } from '@/shared/api/errors'
import { normalizeText } from '@/shared/lib/format'
import {
  cellText,
  downloadBlob,
  letter,
  newOptionKey,
  parseCorrectLetters,
  readFileAsArrayBuffer,
  toArrayBuffer
} from '../lib/utils'
import { validateQuestionInput } from '../lib/validators'
import { MAX_IMPORT_ROWS, OPTION_LETTERS, TEMPLATE_FILE_NAME, TEMPLATE_HEADERS, TEMPLATE_WIDTHS } from '../model/constants'
import type { ImportRow, QuestionInput, QuestionType } from '../model/types'

type ExcelNS = typeof import('exceljs')

/** exceljs nặng → chỉ tải khi cần */
const loadExcel = async (): Promise<ExcelNS> => {
  const mod = await import('exceljs')
  return ((mod as unknown as { default?: ExcelNS }).default ?? mod) as ExcelNS
}

type Field = 'text' | 'type' | 'correct' | 'explanation' | `opt${number}`

const headerToField = (header: string): Field | null => {
  const h = normalizeText(header)
  if (h === 'cau hoi' || h.startsWith('noi dung')) return 'text'
  if (h.startsWith('loai')) return 'type'
  if (h === 'dap an dung') return 'correct'
  if (h.startsWith('giai thich')) return 'explanation'
  const m = h.match(/^dap an ([a-f])$/)
  if (m) return `opt${OPTION_LETTERS.indexOf(m[1].toUpperCase() as (typeof OPTION_LETTERS)[number])}`
  return null
}

const parseType = (raw: string, correctCount: number): QuestionType => {
  const t = normalizeText(raw)
  if (t.includes('nhieu') || t.includes('multi')) return 'MULTIPLE'
  if (t.includes('mot') || t.includes('single')) return 'SINGLE'
  return correctCount > 1 ? 'MULTIPLE' : 'SINGLE'
}

const SAMPLES: string[][] = [
  ['1', 'eKYC là gì?', 'Một đáp án', 'Ví điện tử', 'Chữ ký số', 'Định danh khách hàng điện tử', 'Thẻ phi vật lý', '', '', 'C', 'eKYC = electronic Know Your Customer.'],
  ['2', 'Những rủi ro nào cần quản trị khi chuyển đổi số?', 'Nhiều đáp án', 'An ninh mạng', 'Bảo vệ dữ liệu cá nhân', 'Rủi ro vận hành hệ thống', 'Rủi ro thời tiết', '', '', 'A,B,C', '']
]

const GUIDE = [
  'HƯỚNG DẪN NHẬP CÂU HỎI',
  '',
  '1. Mỗi dòng ở trang "Cau hoi" là một câu hỏi. Không đổi tên các cột tiêu đề.',
  '2. Cột "Câu hỏi": bắt buộc.',
  '3. Cột "Loại câu hỏi": chọn "Một đáp án" hoặc "Nhiều đáp án". Bỏ trống → tự nhận theo số đáp án đúng.',
  '4. Các cột "Đáp án A" → "Đáp án F": nhập tối thiểu 2 đáp án.',
  '5. Cột "Đáp án đúng": ghi chữ cái, ví dụ "C" hoặc "A,C".',
  '6. Cột "Giải thích": không bắt buộc, hiển thị khi học viên xem lại bài làm.',
  `7. Tối đa ${MAX_IMPORT_ROWS} câu mỗi lần nhập.`
]

export const questionImportService = {
  async buildTemplateBuffer(): Promise<ArrayBuffer> {
    const ExcelJS = await loadExcel()
    const wb = new ExcelJS.Workbook()
    wb.creator = 'LMS - Cục Quản lý, Giám sát Tổ chức Tín dụng'
    wb.created = new Date()

    const ws = wb.addWorksheet('Cau hoi', { views: [{ state: 'frozen', ySplit: 1 }] })
    ws.columns = TEMPLATE_HEADERS.map((header, i) => ({ header, width: TEMPLATE_WIDTHS[i] }))
    const head = ws.getRow(1)
    head.height = 28
    head.eachCell((c) => {
      c.font = { bold: true, color: { argb: 'FFFFFFFF' } }
      c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } }
      c.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    })
    SAMPLES.forEach((r) => ws.addRow(r))
    for (let r = 2; r <= MAX_IMPORT_ROWS + 1; r++) {
      ws.getCell(`C${r}`).dataValidation = { type: 'list', allowBlank: true, formulae: ['"Một đáp án,Nhiều đáp án"'] }
    }

    const guide = wb.addWorksheet('Huong dan')
    guide.getColumn(1).width = 110
    GUIDE.forEach((line, i) => {
      const cell = guide.getCell(i + 1, 1)
      cell.value = line
      if (i === 0) cell.font = { bold: true, size: 14, color: { argb: 'FF1E3A8A' } }
    })

    return toArrayBuffer((await wb.xlsx.writeBuffer()) as ArrayBuffer)
  },

  async downloadTemplate(): Promise<void> {
    const buffer = await questionImportService.buildTemplateBuffer()
    downloadBlob(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), TEMPLATE_FILE_NAME)
  },

  rowToImport(row: number, cells: Partial<Record<Field, string>>): ImportRow {
    const errors: string[] = []
    const correctIdx = parseCorrectLetters(cells.correct ?? '')
    const raw = OPTION_LETTERS.map((_, i) => cells[`opt${i}`] ?? '')

    correctIdx.forEach((i) => {
      if (!raw[i]) errors.push(`Đáp án đúng ${letter(i)} không có nội dung`)
    })
    if (!cells.correct) errors.push('Thiếu cột "Đáp án đúng"')

    const type = parseType(cells.type ?? '', correctIdx.length)
    const input: QuestionInput = {
      text: (cells.text ?? '').trim(),
      type,
      options: raw.flatMap((text, i) => (text ? [{ key: newOptionKey(), text, correct: correctIdx.includes(i) }] : [])),
      explanation: (cells.explanation ?? '').trim()
    }
    const v = validateQuestionInput(input)
    for (const msg of Object.values(v)) if (msg && !errors.includes(msg)) errors.push(msg)

    return {
      row,
      preview: input.text || '(trống)',
      type,
      optionCount: input.options.length,
      input: errors.length ? null : input,
      errors
    }
  },

  async parseBuffer(buffer: ArrayBuffer): Promise<ImportRow[]> {
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
    if (![...columns.values()].includes('text')) {
      throw new ApiError('VALIDATION', 'Không đúng file mẫu: thiếu cột "Câu hỏi"')
    }

    const rows: ImportRow[] = []
    for (let r = 2; r <= ws.rowCount; r++) {
      const cells: Partial<Record<Field, string>> = {}
      columns.forEach((field, col) => {
        const t = cellText(ws.getRow(r).getCell(col).value)
        if (t) cells[field] = t
      })
      if (!Object.keys(cells).length) continue
      rows.push(questionImportService.rowToImport(r, cells))
      if (rows.length > MAX_IMPORT_ROWS) {
        throw new ApiError('VALIDATION', `Tối đa ${MAX_IMPORT_ROWS} câu hỏi mỗi lần nhập`)
      }
    }
    if (!rows.length) throw new ApiError('VALIDATION', 'Tệp không có câu hỏi nào')
    return rows
  },

  async parseFile(file: File): Promise<ImportRow[]> {
    if (!/\.xlsx$/i.test(file.name)) throw new ApiError('VALIDATION', 'Chỉ hỗ trợ tệp Excel .xlsx')
    return questionImportService.parseBuffer(await readFileAsArrayBuffer(file))
  },

  summarize(rows: ImportRow[]) {
    const valid = rows.filter((r) => r.input).length
    return { total: rows.length, valid, invalid: rows.length - valid }
  }
}
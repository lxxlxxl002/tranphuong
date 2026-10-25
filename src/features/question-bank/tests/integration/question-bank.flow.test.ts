import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/features/auth', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/features/auth')>()),
  isDemoMode: vi.fn(() => true)
}))

import ExcelJS from 'exceljs'
import { questionImportService } from '../../services/questionImportService'
import { questionService, resetDemoQuestions } from '../../services/questionService'
import { toArrayBuffer } from '../../lib/utils'

describe('Luồng Ngân hàng câu hỏi', () => {
  beforeEach(() => resetDemoQuestions())

  it('file mẫu tự tạo → đọc lại được 2 câu ví dụ hợp lệ', async () => {
    const buffer = await questionImportService.buildTemplateBuffer()
    const rows = await questionImportService.parseBuffer(buffer)
    expect(questionImportService.summarize(rows)).toEqual({ total: 2, valid: 2, invalid: 0 })
    expect(rows[1].type).toBe('MULTIPLE')
    expect(rows[1].input?.options.filter((o) => o.correct)).toHaveLength(3)
  })

  it('file thiếu cột "Câu hỏi" → báo lỗi mẫu', async () => {
    const wb = new ExcelJS.Workbook()
    wb.addWorksheet('X').addRow(['Tên', 'Tuổi'])
    const buf = toArrayBuffer((await wb.xlsx.writeBuffer()) as ArrayBuffer)
    await expect(questionImportService.parseBuffer(buf)).rejects.toMatchObject({ code: 'VALIDATION' })
  })

  it('demo: ngân hàng sắp theo số câu, nhập hàng loạt + thêm + xóa cập nhật số lượng', async () => {
    const banks = await questionService.getBanks()
    expect(banks.map((b) => [b.courseId, b.questionCount])).toEqual([
      ['chuyen-doi-so', 15],
      ['cong-tac-giam-sat', 1],
      ['basel-2', 0]
    ])

    const rows = await questionImportService.parseBuffer(await questionImportService.buildTemplateBuffer())
    await questionService.bulkCreate('basel-2', rows.flatMap((r) => (r.input ? [r.input] : [])))
    const created = await questionService.create('basel-2', {
      text: 'Basel II có mấy trụ cột?',
      type: 'SINGLE',
      options: [
        { key: '1', text: '3', correct: true },
        { key: '2', text: '4', correct: false },
        { key: '3', text: '', correct: false }
      ],
      explanation: ''
    })
    expect(created.options).toHaveLength(2)
    expect(created.order).toBe(3)

    let data = await questionService.getQuestions('basel-2')
    expect(data.questions).toHaveLength(3)
    await questionService.remove(data.questions[0].id)
    data = await questionService.getQuestions('basel-2')
    expect(data.questions.map((q) => q.order)).toEqual([1, 2])
  })
})
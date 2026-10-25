import { describe, expect, it } from 'vitest'
import { toBankQuestions, toQuestionPayload } from '../../adapters/questionAdapter'
import { questionService } from '../../services/questionService'
import { questionImportService } from '../../services/questionImportService'
import { parseCorrectLetters, cellText } from '../../lib/utils'
import { validateQuestionInput } from '../../lib/validators'
import { QUESTION_BANK_CONFIG } from '../../config/question-bank.config'
import type { QuestionInput } from '../../model/types'

const input = (patch: Partial<QuestionInput> = {}): QuestionInput => ({
  text: 'Câu hỏi?',
  type: 'SINGLE',
  options: [
    { key: 'a', text: 'A', correct: true },
    { key: 'b', text: 'B', correct: false }
  ],
  explanation: '',
  ...patch
})

describe('questionAdapter', () => {
  it('cờ đúng dạng "x" + tự nhận nhiều đáp án', () => {
    const d = toBankQuestions({
      course: { id: 5, title: 'X' },
      questions: [{ id: 1, text: 'Q', options: [{ text: 'A', correct: 'x' }, { text: 'B', correct: true }, { text: 'C' }] }]
    })
    expect(d.questions[0]).toMatchObject({ courseId: '5', type: 'MULTIPLE', order: 1 })
    expect(d.questions[0].options.map((o) => o.correct)).toEqual([true, true, false])
  })

  it('payload bỏ key phía client', () => {
    expect(toQuestionPayload(input())).toEqual({
      text: 'Câu hỏi?',
      type: 'SINGLE',
      options: [
        { text: 'A', correct: true },
        { text: 'B', correct: false }
      ],
      explanation: null
    })
  })
})

describe('validateQuestionInput', () => {
  it('bắt các lỗi chính', () => {
    expect(validateQuestionInput(input({ text: ' ' })).text).toBeDefined()
    expect(validateQuestionInput(input({ options: [{ key: 'a', text: 'A', correct: true }] })).options).toBe('Cần ít nhất 2 đáp án')
    expect(validateQuestionInput(input({ options: input().options.map((o) => ({ ...o, correct: false })) })).options).toBe('Chọn ít nhất 1 đáp án đúng')
    expect(validateQuestionInput(input({ options: input().options.map((o) => ({ ...o, correct: true })) })).options).toBe(
      'Câu một đáp án chỉ được chọn 1 đáp án đúng'
    )
    expect(validateQuestionInput(input({ options: [{ key: 'a', text: 'Có', correct: true }, { key: 'b', text: 'có', correct: false }] })).options).toBe(
      'Có đáp án bị trùng nội dung'
    )
    expect(validateQuestionInput(input())).toEqual({})
  })
})

describe('questionService (thuần)', () => {
  it('đổi loại về 1 đáp án chỉ giữ đáp án đúng đầu tiên', () => {
    const multi = input({ type: 'MULTIPLE', options: input().options.map((o) => ({ ...o, correct: true })) })
    expect(questionService.setType(multi, 'SINGLE').options.map((o) => o.correct)).toEqual([true, false])
  })

  it('chọn đáp án đúng: đơn → độc quyền, nhiều → bật/tắt', () => {
    expect(questionService.toggleCorrect(input(), 'b').options.map((o) => o.correct)).toEqual([false, true])
    expect(questionService.toggleCorrect(input({ type: 'MULTIPLE' }), 'b').options.map((o) => o.correct)).toEqual([true, true])
  })

  it('lọc + đếm', () => {
    const qs = QUESTION_BANK_CONFIG.demo.questions.filter((q) => q.courseId === 'chuyen-doi-so')
    expect(questionService.countByType(qs)).toEqual({ ALL: 15, SINGLE: 14, MULTIPLE: 1 })
    expect(questionService.filter(qs, 'ALL', 'ekyc')).toHaveLength(1)
    expect(questionService.filter(qs, 'MULTIPLE', '')).toHaveLength(1)
  })
})

describe('Import Excel (thuần)', () => {
  it('đọc chữ cái đáp án + giá trị ô', () => {
    expect(parseCorrectLetters('A, c')).toEqual([0, 2])
    expect(parseCorrectLetters('2;4')).toEqual([1, 3])
    expect(cellText({ richText: [{ text: 'Xin ' }, { text: 'chào' }] })).toBe('Xin chào')
    expect(cellText({ formula: 'A1', result: 5 })).toBe('5')
  })

  it('dòng lỗi: đáp án đúng trỏ vào ô trống', () => {
    const r = questionImportService.rowToImport(3, { text: 'Q', opt0: 'A', opt1: 'B', correct: 'D' })
    expect(r.input).toBeNull()
    expect(r.errors).toContain('Đáp án đúng D không có nội dung')
  })
})
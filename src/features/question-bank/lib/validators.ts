import { normalizeText } from '@/shared/lib/format'
import { MIN_OPTIONS } from '../model/constants'
import type { QuestionErrors, QuestionInput } from '../model/types'

/** Kiểm tra câu hỏi đã chuẩn hóa (đáp án rỗng đã bị loại) */
export function validateQuestionInput(input: QuestionInput): QuestionErrors {
  const errors: QuestionErrors = {}
  if (!input.text.trim()) errors.text = 'Vui lòng nhập nội dung câu hỏi'
  else if (input.text.length > 2000) errors.text = 'Tối đa 2.000 ký tự'

  const filled = input.options.filter((o) => o.text.trim())
  const correct = filled.filter((o) => o.correct).length
  const texts = filled.map((o) => normalizeText(o.text))

  if (filled.length < MIN_OPTIONS) errors.options = `Cần ít nhất ${MIN_OPTIONS} đáp án`
  else if (new Set(texts).size !== texts.length) errors.options = 'Có đáp án bị trùng nội dung'
  else if (correct === 0) errors.options = 'Chọn ít nhất 1 đáp án đúng'
  else if (input.type === 'SINGLE' && correct > 1) errors.options = 'Câu một đáp án chỉ được chọn 1 đáp án đúng'

  if (input.explanation.length > 2000) errors.explanation = 'Tối đa 2.000 ký tự'
  return errors
}

export const hasErrors = (e: QuestionErrors): boolean => Object.values(e).some(Boolean)
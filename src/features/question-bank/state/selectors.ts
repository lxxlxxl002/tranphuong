import type { QuestionBankState } from './store'

export const selectBankSearch = (s: QuestionBankState) => s.bankSearch
export const selectQuestionSearch = (s: QuestionBankState) => s.questionSearch
export const selectTypeFilter = (s: QuestionBankState) => s.typeFilter
export const selectEditor = (s: QuestionBankState) => s.editor
export const selectImportOpen = (s: QuestionBankState) => s.importOpen
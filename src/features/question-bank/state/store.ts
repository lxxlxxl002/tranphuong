import { create } from 'zustand'
import type { TypeFilter } from '../model/types'

export interface QuestionBankState {
  bankSearch: string
  questionSearch: string
  typeFilter: TypeFilter
  editor: { open: boolean; questionId: string | null }
  importOpen: boolean
}

export const useQuestionBankStore = create<QuestionBankState>(() => ({
  bankSearch: '',
  questionSearch: '',
  typeFilter: 'ALL',
  editor: { open: false, questionId: null },
  importOpen: false
}))
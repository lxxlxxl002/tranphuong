import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { questionService } from '../services/questionService'
import { useQuestionBankStore } from '../state/store'
import { selectBankSearch } from '../state/selectors'
import { questionBankActions } from '../state/actions'
import { QUESTION_BANK_QUERY_KEYS } from '../model/constants'
import { QUESTION_BANK_CONFIG } from '../config/question-bank.config'

export function useQuestionBanks() {
  const query = useQuery({
    queryKey: QUESTION_BANK_QUERY_KEYS.banks,
    queryFn: () => questionService.getBanks(),
    staleTime: QUESTION_BANK_CONFIG.staleTime
  })
  const search = useQuestionBankStore(selectBankSearch)
  const banks = useMemo(() => questionService.filterBanks(query.data ?? [], search), [query.data, search])

  return {
    banks,
    total: query.data?.length ?? 0,
    search,
    setSearch: questionBankActions.setBankSearch,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  }
}
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { certificateService } from '../services/certificateService'
import { useCertificatesStore } from '../state/store'
import { selectSearch } from '../state/selectors'
import { certificatesActions } from '../state/actions'
import { CERTIFICATES_QUERY_KEYS } from '../model/constants'
import { CERTIFICATES_CONFIG } from '../config/certificates.config'

export function useCertificates() {
  const query = useQuery({
    queryKey: CERTIFICATES_QUERY_KEYS.list,
    queryFn: () => certificateService.getCertificates(),
    staleTime: CERTIFICATES_CONFIG.staleTime
  })
  const search = useCertificatesStore(selectSearch)
  const certificates = useMemo(() => certificateService.filter(query.data ?? [], search), [query.data, search])

  return {
    certificates,
    total: query.data?.length ?? 0,
    search,
    setSearch: certificatesActions.setSearch,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  }
}
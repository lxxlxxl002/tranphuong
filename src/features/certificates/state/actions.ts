import { useCertificatesStore } from './store'

export const certificatesActions = {
  setSearch(search: string) {
    useCertificatesStore.setState({ search })
  }
}
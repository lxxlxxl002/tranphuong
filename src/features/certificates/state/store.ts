import { create } from 'zustand'

export interface CertificatesState {
  search: string
}

export const useCertificatesStore = create<CertificatesState>(() => ({
  search: ''
}))
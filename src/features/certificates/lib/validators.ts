import { CERTIFICATE_CODE_PATTERN } from '../model/constants'

export const isCertificateCode = (v: unknown): v is string =>
  typeof v === 'string' && CERTIFICATE_CODE_PATTERN.test(v.trim().toUpperCase())
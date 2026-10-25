export const CERTIFICATES_QUERY_KEYS = {
  all: ['certificates'] as const,
  list: ['certificates', 'list'] as const,
  verify: (code: string) => ['certificates', 'verify', code] as const
}

/** Khổ A4 ngang ở 96dpi */
export const PDF_PAGE_PX = { width: 1123, height: 794 } as const
export const PDF_PAGE_MM = { width: 297, height: 210 } as const

export const CERTIFICATE_CODE_PATTERN = /^[A-Z]{2,10}-\d{4}-\d{4,10}$/
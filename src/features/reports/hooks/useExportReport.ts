import { useMutation } from '@tanstack/react-query'
import { toast } from '@/app/providers/ToastProvider'
import { getErrorMessage } from '@/shared/api/errors'
import { exportService } from '../services/exportService'
import type { ExportInput } from '../model/types'

export function useExportReport() {
  const m = useMutation({
    mutationKey: ['reports', 'export'],
    mutationFn: (input: Omit<ExportInput, 'generatedAt'>) => exportService.exportExcel({ ...input, generatedAt: new Date() }),
    onSuccess: (fileName) => toast.success(`Đã xuất ${fileName}`),
    onError: (err) => toast.error(getErrorMessage(err))
  })
  return { exportExcel: m.mutate, isExporting: m.isPending }
}
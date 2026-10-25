/** Nhận 0–1 hoặc 0–100 → 0–100 */
export const normalizeRate = (v: number): number => {
  const n = v > 0 && v <= 1 ? v * 100 : v
  return Math.max(0, Math.min(100, Math.round(Number.isFinite(n) ? n : 0)))
}

export const pad2 = (n: number): string => String(n).padStart(2, '0')

export const exportFileName = (d = new Date()): string =>
  `Bao-cao-dao-tao-${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}-${pad2(d.getHours())}${pad2(d.getMinutes())}.xlsx`

export const toArrayBuffer = (buf: ArrayBuffer | ArrayBufferView): ArrayBuffer => {
  if (buf instanceof ArrayBuffer) return buf
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer
}

export const downloadBlob = (blob: Blob, fileName: string): void => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
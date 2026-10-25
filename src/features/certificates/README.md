# Feature: certificates (Chứng chỉ)

Thẻ chứng chỉ (giống màn hình mẫu) + tải PDF A4 ngang có quốc huy, viền vàng, chữ ký, mã QR xác thực.

## Luồng
`List` → `CertificateGrid` → `useCertificates` → `certificateService` → api → `certificateAdapter`
Tải PDF: `useDownloadPdf` → `certificatePdfService.buildQrDataUrl` → render `CertificatePdfTemplate` (ngoài màn hình) → `exportElement` (html2canvas + jsPDF, tải động khi cần).
Có `pdf_url` từ backend → mở file đó, không tự tạo.

## Contract backend
| Action | Payload | Trả về `data` |
|---|---|---|
| `certificates.list` | — | `[{ id?, code, course_id, course_title, recipient_name, department_name?, score?, issued_at, attempt_id?, pdf_url? }]` |
| `certificates.verify` | `{ code }` (không cần đăng nhập) | một chứng chỉ như trên |

Chứng chỉ do backend cấp khi `quiz.submit` đạt.

## Cấu hình (`config/certificates.config.ts`)
`parentOrg`, `orgName`, `issuePlace`, `signerTitle`, `signerName`, `pdfScale`.
`.env`: `VITE_CERT_VERIFY_URL=https://lms.../xac-thuc/` → QR = URL + mã số. Để trống → QR chứa thông tin chứng chỉ.

## Demo
1 chứng chỉ mẫu (QLGS-2026-161451) + chứng chỉ của các bài vừa làm đạt ở feature learning, mang tên người đang đăng nhập.
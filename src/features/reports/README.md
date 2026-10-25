# Feature: reports (Báo cáo thống kê)

4 thẻ số liệu · Danh sách công chức (lọc phòng ban / vai trò / tỷ lệ, phân trang, xuất Excel) · Donut phân bổ vai trò · Thống kê theo phòng/ban.

## Luồng
`Overview` → `StaffTable` (+ `ReportFilters`) / `DistributionPanel` → `useReport` → `reportService` → api → `reportAdapter`
Xuất báo cáo: `useExportReport` → `exportService` (exceljs tải động) → tải `.xlsx` → ghi nhật ký `reports.exportLog`.

## Contract backend
| Action | Payload | Trả về `data` |
|---|---|---|
| `reports.overview` | — | `{ stats, staff: [staff], departments?: [dept] }` |
| `reports.exportLog` | `{ fileName, rows, filters }` | — |

`stats`: `{ total_users, total_courses, total_enrollments, total_certificates }`
`staff`: `{ user_id, full_name, email, department_id?, department_name?, role, completed_courses, enrolled_courses?, average_score?, completion_rate }`
`dept` (tùy chọn): `{ department_id?, department_name, staff_count, completion_rate }`

## Quy tắc
- `completion_rate` công chức: 0–1 hoặc 0–100.
- Không có `departments` → tự tính: tỷ lệ phòng = số công chức hoàn thành 100% / tổng công chức của phòng. "(Chưa phân phòng)" luôn đứng đầu.
- File xuất phản ánh đúng bộ lọc đang chọn (ghi rõ ở sheet "Tong hop").
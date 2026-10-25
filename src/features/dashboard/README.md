# Feature: dashboard (Trang chủ)

Banner giới thiệu, 4 thẻ thống kê, bảng thống kê theo phòng/ban (sắp xếp được), donut phân bổ vai trò.

## Luồng
`Home` → `useDashboardStats` / `useDeptStats` → `dashboardService` → `api/queries` → `dashboardAdapter` → model
Phiên demo (`isDemoMode()` từ auth) → trả dữ liệu mẫu trong `config/dashboard.config.ts`.

## Contract backend
| Action | Trả về `data` |
|---|---|
| `dashboard.stats` | `{ total_users, total_courses, total_enrollments, total_certificates, role_distribution: [{ role, count }] }` |
| `dashboard.deptStats` | `[{ department_id, department_name, staff_count, active_rate, completion_rate }]` |
| `dashboard.refresh` | — (tính lại cache, chỉ Quản trị viên) |

- Số có thể là chuỗi (Google Sheets) — schema tự ép kiểu.
- `active_rate`, `completion_rate`: nhận 0–1 hoặc 0–100, adapter chuẩn hóa về 0–100.
- `role` nhận mọi cách ghi mà `auth/toRole` hiểu; vai trò trùng được cộng gộp.

## Ảnh banner
Đặt ảnh vào `public/` và khai báo `VITE_HERO_IMAGE_URL=/ten-anh.webp` trong `.env`. Để trống → dùng minh họa vẽ bằng code.
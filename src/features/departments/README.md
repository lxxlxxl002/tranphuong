# Feature: departments (Phòng / Ban)

Bảng Mã · Tên · Lãnh đạo phòng · Số công chức · Thao tác, dòng tổng cộng; popup thêm/sửa (gợi ý mã kế tiếp, chọn lãnh đạo từ người dùng); xóa có xác nhận, chặn khi còn công chức.

## Luồng
UI → `useDepartments` / `useDepartmentMutation` → `departmentService` → api → `departmentAdapter`
Ghi xong làm mới: `departments`, `users`, `reports`, `dashboard`. Phân quyền: `departments:create | update | delete`.
Danh sách lãnh đạo lấy từ feature `users` (public API).

## Contract backend
| Action | Payload | Trả về `data` |
|---|---|---|
| `departments.list` | — | `[{ id, code, name, leader_id?, leader_name?, staff_count, description?, created_at? }]` |
| `departments.create` | `{ input }` | phòng/ban vừa tạo |
| `departments.update` | `{ departmentId, input }` | phòng/ban sau khi sửa |
| `departments.delete` | `{ departmentId }` | — (backend phải chặn nếu còn công chức) |

`input`: `{ code, name, leader_id, description }` — `code` in hoa, duy nhất (trùng → `CONFLICT`).
`departments.list` dùng chung với feature users (users chỉ đọc `id, code, name`).
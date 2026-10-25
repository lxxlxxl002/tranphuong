# Feature: users (Quản trị người dùng)

- `/quan-tri/nguoi-dung` — 4 thẻ thống kê, bảng (lọc vai trò / trạng thái, tìm tên · email · mã CB · mã CC, phân trang), khung chi tiết bên phải, import Excel.
- `/quan-tri/nguoi-dung/them-moi`, `/:userId/chinh-sua` — form; tạo xong hiển thị mật khẩu tạm 1 lần.

## Luồng
UI → `useUserList` / `useUserDetail` / `useUserMutation` → `userService` (+ `userImportService`) → api → `userAdapter`
Ghi xong làm mới: `users`, `dashboard`, `reports`, `departments`. Phân quyền: `users:create | update | delete`.
Không cho tự khóa / tự xóa tài khoản đang đăng nhập.

## Contract backend
| Action | Payload | Trả về `data` |
|---|---|---|
| `users.list` | — | `[user]` |
| `users.detail` | `{ userId }` | `user` |
| `users.create` | `{ input }` | `{ user, temporary_password? }` |
| `users.update` | `{ userId, input }` | `user` |
| `users.setStatus` | `{ userId, status }` | — |
| `users.delete` | `{ userId }` | — |
| `users.resetPassword` | `{ userId }` | `{ temporary_password }` |
| `users.bulkCreate` | `{ inputs }` | `{ created }` |
| `departments.list` | — | `[{ id, code, name }]` |

`user`: `{ id, code?, full_name, email, phone?, department_id?, department_name?, role, status, created_at?, last_login_at? }`
`input`: `{ full_name, email, code, phone, department_id, role, status }`
`status`: `ACTIVE | PENDING | LOCKED` (nhận "Hoạt động", "Chưa kích hoạt", "Đã khóa"…). Email trùng → `{ ok:false, error:{ code:'CONFLICT' } }`.

## Import Excel
Cột: Họ và tên · Email · Mã cán bộ · Số điện thoại · Phòng/Ban (mã P1… hoặc tên) · Vai trò (Học viên / Giảng viên / Lãnh đạo phòng / Quản trị viên). Sheet "Phong ban" liệt kê mã phòng.
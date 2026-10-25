# Feature: permissions (Phân quyền)

Cột trái: thẻ vai trò (số quyền, Hệ thống/Tùy chỉnh, số người, chấm vàng khi có thay đổi chưa lưu).
Cột phải: quyền theo nhóm chức năng × Xem / Thêm mới / Chỉnh sửa / Xóa, công tắc "tất cả" mỗi nhóm, lưu theo lô.

## Quy tắc
- ADMIN luôn toàn quyền, không chỉnh được (`hasPermission` cũng bỏ qua kiểm tra với ADMIN).
- Bật Thêm/Sửa/Xóa → tự bật Xem. Tắt Xem → tắt cả nhóm.
- Lưu quyền đúng vai trò người đang đăng nhập → áp dụng ngay (menu cập nhật).
- Vai trò tùy chỉnh: tạo (sao chép quyền), sửa tên/mô tả, xóa khi không còn người dùng. Vai trò hệ thống không xóa, không đổi mã.

## Luồng
`Matrix` → `RoleList` / `PermissionMatrix` / `RoleFormModal` → `useRoles` · `usePermissions` (bản nháp trong store) · `useRoleMutation` → `permissionService` → api → `permissionAdapter`

## Contract backend
| Action | Payload | Trả về `data` |
|---|---|---|
| `permissions.roles` | — | `[{ key, name, description?, system?, permissions: string[] \| "a,b", user_count }]` |
| `permissions.saveRole` | `{ roleKey, permissions }` | — |
| `permissions.createRole` | `{ input: { key, name, description, permissions } }` | vai trò vừa tạo |
| `permissions.updateRole` | `{ roleKey, input: { name, description } }` | — |
| `permissions.deleteRole` | `{ roleKey }` | — |

Mã quyền: `<chức năng>:<view|create|update|delete>` — xem `shared/constants/permissions.ts`.
`auth.me` / `auth.login` trả `permissions` theo vai trò để áp dụng phía client.
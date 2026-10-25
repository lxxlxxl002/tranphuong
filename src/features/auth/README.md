# Feature: auth

Đăng nhập, quản lý phiên, đồng bộ hồ sơ + quyền với backend Apps Script.

## Luồng
`LoginForm` → `useLogin` → `authService.login` → `api/mutations.loginRequest` → `authAdapter.toSession` → `authActions.setSession`
→ `PublicOnlyRoute` tự chuyển về trang trước đó.

## Contract backend (POST text/plain → `{ action, payload, token }`)
| Action | Payload | Trả về `data` |
|---|---|---|
| `auth.login` | `{ email, password }` | `{ token, user, permissions?, expires_at? }` |
| `auth.me` | — | `{ user, permissions? }` |
| `auth.logout` | — | — |
| `auth.changePassword` | `{ currentPassword, newPassword }` | — |

`user`: `{ id, code?, full_name, email, role, department_id?, department_name?, avatar_url? }`
`role` nhận cả dạng tiếng Việt ("Quản trị viên", `HOC_VIEN`…) — xem `model/constants.ts`.
`permissions` rỗng → dùng quyền mặc định theo vai trò (`shared/constants/permissions.ts`).

Lỗi trả về: `{ ok: false, error: { code: 'UNAUTHORIZED' | 'VALIDATION' | ..., message } }`

## Public API (`index.ts`)
`useAuthStore`, `authActions`, selectors, `useSession`, `useLogin`, `useLogout`, `authService`, `authRoutes`

## Demo
Chỉ bật ở `npm run dev`: nút "Vào bản demo" tạo phiên Quản trị viên, không gọi server.
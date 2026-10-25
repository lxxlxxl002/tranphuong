# Feature: settings (Cài đặt hệ thống)

3 nhóm: Thông tin chung · Liên hệ hỗ trợ · Chứng chỉ & nhận diện. Bản nháp + thanh Lưu/Hủy dính đáy, lỗi theo từng ô, chấm đỏ trên nhóm có lỗi, xem trước trực tiếp.

## Áp dụng ngay sau khi lưu
| Cài đặt | Nơi dùng |
|---|---|
| `general.systemName`, `general.orgName` | Thanh bên (`app/layout/Sidebar`) |
| `general.parentOrg`, `general.orgName`, `certificate.*` | PDF chứng chỉ (`getCertificateSettings`) |
| `general.default*` | Form tạo khóa học mới (`getCourseDefaults`) |
| `support.*` | Thẻ hỗ trợ góc thanh bên (`useAppSettings`) |

## Luồng
`Settings` → modules → `useSettings` (bản nháp trong store) → `useSettingsMutation` → `settingsService` → api → `settingsAdapter`
Cài đặt đang áp dụng nằm ở `useSettingsStore.applied` — feature khác đọc qua `useAppSettings()` (React) hoặc `getAppSettings()` (đồng bộ).

## Contract backend (hợp với 1 sheet "Settings" 2 cột key | value)
| Action | Payload | Trả về `data` |
|---|---|---|
| `settings.get` | — | `[{ key, value }]` **hoặc** `{ "support.phone": ... }` **hoặc** `{ support: { phone } }` |
| `settings.update` | `{ values: { "general.orgName": "...", ... } }` | — |

Khóa: `general.systemName, general.orgName, general.parentOrg, general.defaultPassScore, general.defaultDurationMin, general.defaultMaxAttempts, support.name, support.phone, support.email, support.workingHours, certificate.issuePlace, certificate.signerTitle, certificate.signerName`
Khóa thiếu → dùng mặc định (`config/settings.config.ts`, lấy từ `.env`).
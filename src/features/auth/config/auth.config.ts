export const AUTH_CONFIG = {
  timeout: 20_000,
  sessionSyncStaleMs: 5 * 60_000,
  rememberDefault: true,
  allowDemo: import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEMO === 'true',
  demoToken: 'dev-token',
  supportName: import.meta.env.VITE_SUPPORT_NAME || 'Liên hệ Phòng 1',
  supportPhone: import.meta.env.VITE_SUPPORT_PHONE || '0822 116 166',
  forgotPasswordHint: `Vui lòng liên hệ quản trị viên hệ thống (${import.meta.env.VITE_SUPPORT_NAME || 'Phòng 1'} – ${import.meta.env.VITE_SUPPORT_PHONE || '0822 116 166'}) để được cấp lại mật khẩu.`
} as const
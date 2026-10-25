/** Tên action RPC gửi sang Apps Script (doPost) */
export const AUTH_ENDPOINTS = {
  login: 'auth.login',
  logout: 'auth.logout',
  me: 'auth.me',
  changePassword: 'auth.changePassword'
} as const
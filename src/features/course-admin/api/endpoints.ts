export const COURSE_ADMIN_ENDPOINTS = {
  list: 'courseAdmin.list',
  detail: 'courseAdmin.detail',
  create: 'courseAdmin.create',
  update: 'courseAdmin.update',
  remove: 'courseAdmin.delete',
  setStatus: 'courseAdmin.setStatus',
  uploadCover: 'courseAdmin.uploadCover',
  lessonCreate: 'lessonAdmin.create',
  lessonUpdate: 'lessonAdmin.update',
  lessonRemove: 'lessonAdmin.delete',
  lessonReorder: 'lessonAdmin.reorder'
} as const
import type { FeatureRoute } from './paths'
import { authRoutes } from '@/features/auth/routes'
import { dashboardRoutes } from '@/features/dashboard/routes'
import { myCoursesRoutes } from '@/features/my-courses/routes'
import { learningRoutes } from '@/features/learning/routes'
import { progressRoutes } from '@/features/progress/routes'
import { examResultsRoutes } from '@/features/exam-results/routes'
import { certificatesRoutes } from '@/features/certificates/routes'
import { courseAdminRoutes } from '@/features/course-admin/routes'
import { questionBankRoutes } from '@/features/question-bank/routes'
import { reportsRoutes } from '@/features/reports/routes'
import { usersRoutes } from '@/features/users/routes'
import { departmentsRoutes } from '@/features/departments/routes'
import { permissionsRoutes } from '@/features/permissions/routes'
import { settingsRoutes } from '@/features/settings/routes'

/** Mỗi feature tự khai báo routes.tsx — đăng ký tập trung tại đây */
export const allRoutes: FeatureRoute[] = [
  ...authRoutes,
  ...dashboardRoutes,
  ...myCoursesRoutes,
  ...learningRoutes,
  ...progressRoutes,
  ...examResultsRoutes,
  ...certificatesRoutes,
  ...courseAdminRoutes,
  ...questionBankRoutes,
  ...reportsRoutes,
  ...usersRoutes,
  ...departmentsRoutes,
  ...permissionsRoutes,
  ...settingsRoutes
]

export const publicRoutes = allRoutes.filter((r) => r.public)
export const privateRoutes = allRoutes.filter((r) => !r.public)
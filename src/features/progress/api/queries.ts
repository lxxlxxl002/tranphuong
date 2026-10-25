import { progressClient } from './client'
import { PROGRESS_ENDPOINTS } from './endpoints'

export const fetchProgressOverview = () => progressClient.query<unknown>(PROGRESS_ENDPOINTS.overview)
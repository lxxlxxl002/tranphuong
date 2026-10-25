import type { Department } from '../model/types'

const D = (code: string, name: string): Department => ({
  id: code,
  code,
  name,
  leaderId: null,
  leaderName: null,
  staffCount: 0,
  description: null,
  createdAt: '2026-06-01'
})

export const DEPARTMENTS_CONFIG = {
  timeout: 20_000,
  staleTime: 60_000,
  demoDelayMs: 300,
  demo: [
    D('P1', 'Phòng Tổng hợp và chính sách'),
    D('P2', 'Phòng Quản lý, giám sát NHTMNN'),
    D('P3', 'Phòng QLGS NHNNg, TCTD hợp tác và tổ chức khác'),
    D('P4', 'Phòng Quản lý, giám sát NHTMCP1'),
    D('P5', 'Phòng Quản lý, giám sát NHTMCP2'),
    D('P6', 'Phòng Quản lý, giám sát TCTD phi NH')
  ]
}
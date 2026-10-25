import type { ReactNode } from 'react'
import logo from '@/assets/logo-quoc-huy.png'
import { getGreeting } from '../../lib/utils'

interface LoginCardProps {
  children: ReactNode
  footer?: ReactNode
}

export function LoginCard({ children, footer }: LoginCardProps) {
  return (
    <div className="w-full max-w-[420px]">
      <div className="mb-8 flex flex-col items-center text-center lg:hidden">
        <img src={logo} alt="Quốc huy" className="h-14 w-14" />
        <p className="mt-3 text-sm font-extrabold uppercase leading-snug text-brand-800">
          Cục Quản lý, Giám sát
          <br />
          Tổ chức Tín dụng
        </p>
        <p className="mt-1 text-xs text-ink-muted">Hệ thống Đào tạo Trực tuyến</p>
      </div>

      <div className="rounded-2xl border border-surface-line bg-white p-8 shadow-pop">
        <p className="text-sm font-semibold text-brand-600">{getGreeting()}</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-ink">Đăng nhập hệ thống</h2>
        <p className="mt-1.5 text-sm text-ink-muted">Sử dụng tài khoản công vụ được cấp để tiếp tục.</p>
        <div className="mt-7">{children}</div>
      </div>

      {footer && <div className="mt-6 text-center text-xs text-ink-muted">{footer}</div>}
    </div>
  )
}
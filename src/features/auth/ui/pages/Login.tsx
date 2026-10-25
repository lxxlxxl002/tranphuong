import { Headphones } from 'lucide-react'
import { BrandPanel } from '../components/BrandPanel'
import { LoginCard } from '../components/LoginCard'
import { LoginForm } from '../modules/LoginForm'
import { AUTH_CONFIG } from '../../config/auth.config'

export default function Login() {
  return (
    <div className="flex min-h-screen bg-surface">
      <BrandPanel />
      <main className="flex flex-1 items-center justify-center bg-app-gradient px-4 py-10 sm:px-8">
        <LoginCard
          footer={
            <span className="inline-flex items-center gap-1.5">
              <Headphones className="h-3.5 w-3.5" />
              Cần hỗ trợ? {AUTH_CONFIG.supportName} ·
              <a href={`tel:${AUTH_CONFIG.supportPhone.replace(/\s/g, '')}`} className="font-semibold text-brand-600 hover:underline">
                {AUTH_CONFIG.supportPhone}
              </a>
            </span>
          }
        >
          <LoginForm />
        </LoginCard>
      </main>
    </div>
  )
}
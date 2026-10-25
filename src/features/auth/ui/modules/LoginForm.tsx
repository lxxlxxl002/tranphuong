import { useState, type FormEvent } from 'react'
import { AlertCircle, Eye, EyeOff, FlaskConical, Lock, LogIn, Mail } from 'lucide-react'
import { toast } from '@/app/providers/ToastProvider'
import { getErrorMessage } from '@/shared/api/errors'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { useLogin } from '../../hooks/useLogin'
import { validateLogin, type LoginErrors } from '../../lib/validators'
import { AUTH_CONFIG } from '../../config/auth.config'

export function LoginForm() {
  const login = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState<boolean>(AUTH_CONFIG.rememberDefault)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<LoginErrors>({})

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const v = validateLogin({ email, password })
    setErrors(v)
    if (Object.keys(v).length) return
    login.mutate({ email: email.trim(), password, remember })
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {login.isError && (
        <div role="alert" className="flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-600">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{getErrorMessage(login.error)}</span>
        </div>
      )}

      <Input
        label="Email công vụ"
        type="email"
        autoComplete="username"
        placeholder="ten@sbv.gov.vn"
        leftIcon={<Mail />}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        autoFocus
      />

      <div className="relative">
        <Input
          label="Mật khẩu"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="Nhập mật khẩu"
          leftIcon={<Lock />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          className="absolute right-2.5 top-[34px] rounded p-1 text-ink-faint transition hover:text-ink"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 accent-brand-600"
          />
          Ghi nhớ đăng nhập
        </label>
        <button
          type="button"
          onClick={() => toast.info(AUTH_CONFIG.forgotPasswordHint, 6000)}
          className="text-sm font-semibold text-brand-600 transition hover:text-brand-700"
        >
          Quên mật khẩu?
        </button>
      </div>

      <Button type="submit" size="lg" fullWidth loading={login.isPending} leftIcon={<LogIn />}>
        Đăng nhập
      </Button>

      {login.canDemo && (
        <>
          <div className="relative py-1 text-center text-xs text-ink-faint">
            <span className="absolute inset-x-0 top-1/2 h-px bg-surface-line" />
            <span className="relative bg-white px-3">Môi trường phát triển</span>
          </div>
          <Button variant="secondary" fullWidth leftIcon={<FlaskConical />} onClick={login.loginDemo}>
            Vào bản demo (Quản trị viên)
          </Button>
        </>
      )}
    </form>
  )
}
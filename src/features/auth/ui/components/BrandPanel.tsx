import { Award, BookOpenCheck, Building2, ClipboardCheck, GraduationCap, ShieldCheck } from 'lucide-react'
import logo from '@/assets/logo-quoc-huy.png'
import { currentYear } from '../../lib/utils'

const FEATURES = [
  { icon: BookOpenCheck, title: 'Khóa học chuyên môn', desc: 'Nội dung nghiệp vụ quản lý, giám sát tổ chức tín dụng.' },
  { icon: ClipboardCheck, title: 'Kiểm tra trực tuyến', desc: 'Đánh giá kết quả học tập ngay sau mỗi khóa học.' },
  { icon: Award, title: 'Chứng chỉ điện tử', desc: 'Cấp chứng chỉ có mã xác thực khi hoàn thành khóa học.' }
]

const STATS = [
  { icon: Building2, label: 'Phòng ban' },
  { icon: GraduationCap, label: 'Khóa học' },
  { icon: ShieldCheck, label: 'Chứng chỉ số' }
]

export function BrandPanel() {
  return (
    <aside className="relative hidden w-[46%] max-w-[640px] flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0c1f66] via-sidebar to-brand-900 p-12 text-white lg:flex">
      <div aria-hidden className="pointer-events-none absolute -right-28 -top-28 h-96 w-96 rounded-full bg-sky-400/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-24 h-[28rem] w-[28rem] rounded-full bg-brand-400/15 blur-3xl" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:24px_24px]"
      />

      <div className="relative flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur">
          <img src={logo} alt="Quốc huy" className="h-12 w-12 drop-shadow-lg" />
        </span>
        <div>
          <p className="text-sm font-extrabold uppercase leading-snug tracking-tight">
            Cục Quản lý, Giám sát
            <br />
            Tổ chức Tín dụng
          </p>
          <p className="mt-1 text-xs text-white/70">Hệ thống Đào tạo Trực tuyến</p>
        </div>
      </div>

      <div className="relative">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 ring-1 ring-white/15">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Nền tảng đào tạo nội bộ
        </p>
        <h1 className="text-[44px] font-extrabold leading-[1.1] tracking-tight">
          Học tập hôm nay –
          <br />
          <span className="bg-gradient-to-r from-sky-300 to-cyan-200 bg-clip-text text-transparent">Dẫn đầu ngày mai</span>
        </h1>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/75">
          Nâng cao tri thức – Vững chuyên môn. Kiến tạo giá trị – Phát triển bền vững.
        </p>
        <ul className="mt-9 space-y-3">
          {FEATURES.map((f) => (
            <li key={f.title} className="flex items-start gap-4 rounded-2xl bg-white/[0.06] p-3.5 ring-1 ring-white/10 transition hover:bg-white/[0.1]">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                <f.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">{f.title}</p>
                <p className="mt-0.5 text-sm text-white/65">{f.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative">
        <div className="mb-5 flex items-center gap-5 border-t border-white/10 pt-5">
          {STATS.map((s) => (
            <span key={s.label} className="inline-flex items-center gap-2 text-sm text-white/70">
              <s.icon className="h-4 w-4 text-sky-300" />
              {s.label}
            </span>
          ))}
        </div>
        <p className="text-xs text-white/50">© {currentYear()} Cục Quản lý, Giám sát Tổ chức Tín dụng. Lưu hành nội bộ.</p>
      </div>
    </aside>
  )
}
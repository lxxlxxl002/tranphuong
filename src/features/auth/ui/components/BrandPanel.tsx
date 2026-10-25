import { Award, BookOpenCheck, ClipboardCheck } from 'lucide-react'
import logo from '@/assets/logo-quoc-huy.png'
import { currentYear } from '../../lib/utils'

const FEATURES = [
  { icon: BookOpenCheck, title: 'Khóa học chuyên môn', desc: 'Nội dung nghiệp vụ quản lý, giám sát tổ chức tín dụng.' },
  { icon: ClipboardCheck, title: 'Kiểm tra trực tuyến', desc: 'Đánh giá kết quả học tập ngay sau mỗi khóa học.' },
  { icon: Award, title: 'Chứng chỉ điện tử', desc: 'Cấp chứng chỉ có mã xác thực khi hoàn thành khóa học.' }
]

export function BrandPanel() {
  return (
    <aside className="relative hidden w-[46%] max-w-[640px] flex-col justify-between overflow-hidden bg-gradient-to-br from-sidebar via-brand-800 to-brand-900 p-12 text-white lg:flex">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-brand-400/20 blur-3xl" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:22px_22px]"
      />

      <div className="relative flex items-center gap-4">
        <img src={logo} alt="Quốc huy" className="h-16 w-16 drop-shadow-lg" />
        <div>
          <p className="text-sm font-extrabold uppercase leading-snug tracking-tight">
            Cục Quản lý, Giám sát
            <br />
            Tổ chức Tín dụng
          </p>
          <p className="mt-1 text-xs text-white/75">Hệ thống Đào tạo Trực tuyến</p>
        </div>
      </div>

      <div className="relative">
        <h1 className="text-[40px] font-extrabold leading-[1.15] tracking-tight">
          Học tập hôm nay –
          <br />
          <span className="text-sky-300">Dẫn đầu ngày mai</span>
        </h1>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/80">
          Nâng cao tri thức – Vững chuyên môn. Kiến tạo giá trị – Phát triển bền vững.
        </p>
        <ul className="mt-10 space-y-5">
          {FEATURES.map((f) => (
            <li key={f.title} className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                <f.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">{f.title}</p>
                <p className="mt-0.5 text-sm text-white/70">{f.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-xs text-white/60">
        © {currentYear()} Cục Quản lý, Giám sát Tổ chức Tín dụng. Lưu hành nội bộ.
      </p>
    </aside>
  )
}
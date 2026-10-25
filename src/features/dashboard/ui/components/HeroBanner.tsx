import { BarChart3, BookOpen, GraduationCap, Play, ShieldCheck, TrendingUp } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

interface HeroBannerProps {
  imageUrl?: string
}

export function HeroBanner({ imageUrl }: HeroBannerProps) {
  if (imageUrl) {
    return (
      <section className="relative overflow-hidden rounded-2xl border border-surface-line shadow-card">
        <img src={imageUrl} alt="Hệ thống Đào tạo Trực tuyến" className="h-full max-h-[340px] w-full object-cover" />
      </section>
    )
  }
  return (
    <section className="relative overflow-hidden rounded-2xl border border-surface-line bg-gradient-to-r from-white via-[#f3f7ff] to-[#dce7ff] shadow-card">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(#c7d6f5_1px,transparent_1px)] [background-size:18px_18px] [mask-image:linear-gradient(to_right,black,transparent_40%)]"
      />
      <div className="relative grid min-h-[300px] items-center gap-6 px-8 py-9 lg:grid-cols-[1.15fr_1fr] lg:px-12">
        <div>
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-100 text-brand-700 shadow-sm">
              <GraduationCap className="h-8 w-8" />
            </span>
            <p className="text-[15px] font-extrabold uppercase leading-tight tracking-wide text-ink">
              Hệ thống
              <br />
              Đào tạo trực tuyến
            </p>
          </div>
          <h1 className="mt-7 text-3xl font-extrabold tracking-tight text-ink md:text-[40px] md:leading-[1.15]">
            Học tập hôm nay – <span className="text-brand-600">Dẫn đầu ngày mai</span>
          </h1>
          <div className="mt-6 space-y-2 text-lg text-ink-soft">
            <p>Nâng cao tri thức – Vững chuyên môn</p>
            <p>Kiến tạo giá trị – Phát triển bền vững</p>
          </div>
        </div>
        <div className="relative hidden h-[260px] lg:block">
          <HeroIllustration />
        </div>
      </div>
    </section>
  )
}

const FLOATING = [
  { Icon: BarChart3, cls: 'left-[10%] top-[4%]' },
  { Icon: TrendingUp, cls: 'left-[40%] top-[20%]' },
  { Icon: BookOpen, cls: 'right-[4%] top-0' },
  { Icon: ShieldCheck, cls: 'right-[2%] top-[40%]' }
]

function HeroIllustration() {
  return (
    <div className="absolute inset-0" aria-hidden>
      {FLOATING.map(({ Icon, cls }, i) => (
        <span
          key={i}
          className={cn(
            'absolute flex h-16 w-16 items-center justify-center rounded-full border border-white/80 bg-white/60 text-brand-600 shadow-[0_8px_24px_-8px_rgba(37,99,235,0.35)] backdrop-blur',
            cls
          )}
        >
          <Icon className="h-7 w-7" />
        </span>
      ))}
      <div className="absolute bottom-2 left-[24%] w-[60%]">
        <div className="rounded-t-xl border-[6px] border-slate-800 bg-slate-800 shadow-2xl">
          <div className="grid aspect-[16/10] grid-cols-[1fr_38%] gap-2 rounded-md bg-gradient-to-br from-brand-50 to-white p-2.5">
            <div className="flex items-center justify-center rounded-md bg-gradient-to-br from-brand-700 to-brand-500">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-brand-600 shadow">
                <Play className="ml-0.5 h-5 w-5 fill-current" />
              </span>
            </div>
            <div className="space-y-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-1.5 rounded bg-white p-1 shadow-sm">
                  <span className="h-3 w-3 shrink-0 rounded-sm bg-brand-200" />
                  <span className="h-1.5 flex-1 rounded-full bg-slate-200" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="-ml-[6%] h-3 w-[112%] rounded-b-xl bg-gradient-to-b from-slate-300 to-slate-400 shadow-lg" />
      </div>
      <div className="absolute bottom-3 left-[4%] space-y-1">
        {['bg-brand-700', 'bg-brand-500', 'bg-sky-500'].map((c, i) => (
          <div key={c} className={cn('h-4 rounded-sm shadow', c)} style={{ width: 104 - i * 8 }} />
        ))}
      </div>
    </div>
  )
}
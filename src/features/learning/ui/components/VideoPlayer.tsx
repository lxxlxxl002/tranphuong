import { Play } from 'lucide-react'
import { resolveVideoSource } from '../../lib/utils'

interface VideoPlayerProps {
  url: string | null
  title: string
  onEnded?: () => void
}

export function VideoPlayer({ url, title, onEnded }: VideoPlayerProps) {
  const source = resolveVideoSource(url)
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-950 shadow-card">
      {source.kind === 'none' ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-brand-900 via-slate-900 to-slate-950 px-6 text-center text-white">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
            <Play className="ml-1 h-7 w-7 fill-current" />
          </span>
          <p className="max-w-lg text-base font-semibold">{title}</p>
          <p className="text-sm text-white/60">Video bài giảng chưa được cập nhật</p>
        </div>
      ) : source.kind === 'file' ? (
        <video
          key={source.src}
          src={source.src}
          controls
          controlsList="nodownload"
          preload="metadata"
          onEnded={onEnded}
          className="h-full w-full"
        />
      ) : (
        <iframe
          key={source.src}
          src={source.src}
          title={title}
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          className="h-full w-full border-0"
        />
      )}
    </div>
  )
}
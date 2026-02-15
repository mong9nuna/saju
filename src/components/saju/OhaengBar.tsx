import type { Ohaeng } from '@/lib/saju/types'

const OHAENG_INFO: { key: Ohaeng; label: string; color: string }[] = [
  { key: '목', label: '목(木)', color: '#22c55e' },
  { key: '화', label: '화(火)', color: '#ef4444' },
  { key: '토', label: '토(土)', color: '#eab308' },
  { key: '금', label: '금(金)', color: '#e2e8f0' },
  { key: '수', label: '수(水)', color: '#3b82f6' },
]

interface OhaengBarProps {
  distribution: Record<Ohaeng, number>
}

export default function OhaengBar({ distribution }: OhaengBarProps) {
  const maxValue = Math.max(...Object.values(distribution), 1)

  return (
    <div className="card">
      <h3 className="text-sm mb-3 accent-gold">오행 분포</h3>
      <div className="space-y-2">
        {OHAENG_INFO.map(({ key, label, color }) => (
          <div key={key} className="flex items-center gap-3">
            <span className="text-sm w-14" style={{ color }}>{label}</span>
            <div className="flex-1 h-4 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(distribution[key] / maxValue) * 100}%`,
                  backgroundColor: color,
                  opacity: 0.8,
                }}
              />
            </div>
            <span className="text-sm w-6 text-right" style={{ color: 'var(--text-secondary)' }}>
              {distribution[key]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

import type { DrawnCard } from '@/lib/tarot/types'
import { getInterpretation, getKeyword } from '@/lib/tarot/reading'

interface TarotResultProps {
  cards: DrawnCard[]
  onReset: () => void
}

const POSITION_LABELS = {
  past: { label: '과거', icon: '⏪' },
  present: { label: '현재', icon: '⏺️' },
  future: { label: '미래', icon: '⏩' },
}

export default function TarotResult({ cards, onReset }: TarotResultProps) {
  return (
    <div className="mt-6 space-y-4">
      {cards.map((drawn) => {
        const pos = POSITION_LABELS[drawn.position]
        return (
          <div key={drawn.position} className="card">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{pos.icon}</span>
              <span className="font-semibold accent-purple">{pos.label}</span>
              <span className="text-xl ml-auto">{drawn.card.symbol}</span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-bold accent-gold">{drawn.card.name}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{
                background: drawn.isReversed ? 'rgba(239, 68, 68, 0.2)' : 'rgba(139, 92, 246, 0.2)',
                color: drawn.isReversed ? '#f87171' : '#a78bfa',
              }}>
                {drawn.isReversed ? '역방향' : '정방향'}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {getKeyword(drawn)}
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {getInterpretation(drawn)}
            </p>
          </div>
        )
      })}

      <button
        onClick={onReset}
        className="w-full py-3 rounded-lg font-medium transition-all bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white"
      >
        다시 뽑기
      </button>
    </div>
  )
}

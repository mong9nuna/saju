'use client'

import type { TarotCardData } from '@/lib/tarot/types'

interface TarotCardProps {
  card?: TarotCardData
  isFlipped: boolean
  isReversed?: boolean
  isSelected?: boolean
  onClick?: () => void
  className?: string
  style?: React.CSSProperties
}

export default function TarotCard({
  card,
  isFlipped,
  isReversed = false,
  isSelected = false,
  onClick,
  className = '',
  style,
}: TarotCardProps) {
  return (
    <div
      className={`tarot-card ${isSelected ? 'selected' : ''} ${className}`}
      onClick={onClick}
      style={style}
    >
      <div className={`tarot-card-inner ${isFlipped ? 'flipped' : ''}`}>
        <div className="tarot-card-back" />
        <div className={`tarot-card-front ${isReversed ? 'reversed' : ''}`}>
          {card && (
            <>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {card.number}
              </span>
              <span className="text-2xl my-1">{card.symbol}</span>
              <span className="text-xs font-medium text-center" style={{ color: 'var(--accent-gold)' }}>
                {card.name}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

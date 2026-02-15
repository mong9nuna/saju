'use client'

import { useState } from 'react'
import TarotCard from './TarotCard'
import { getAllCards } from '@/lib/tarot/reading'

interface TarotDeckProps {
  onSelectionComplete: (selectedIndices: number[]) => void
}

export default function TarotDeck({ onSelectionComplete }: TarotDeckProps) {
  const cards = getAllCards()
  const [selected, setSelected] = useState<number[]>([])

  function handleCardClick(index: number) {
    if (selected.includes(index)) {
      setSelected(selected.filter(i => i !== index))
      return
    }
    if (selected.length >= 3) return

    const newSelected = [...selected, index]
    setSelected(newSelected)

    if (newSelected.length === 3) {
      setTimeout(() => onSelectionComplete(newSelected), 500)
    }
  }

  const totalCards = cards.length
  const angleRange = 80
  const startAngle = -angleRange / 2

  return (
    <div className="card">
      <h2 className="text-lg font-semibold accent-gold text-center mb-2">카드를 선택하세요</h2>
      <p className="text-sm text-center mb-6" style={{ color: 'var(--text-secondary)' }}>
        마음을 집중하고 3장의 카드를 골라주세요 ({selected.length}/3)
      </p>
      <div className="relative h-[220px] flex items-end justify-center">
        {cards.map((card, i) => {
          const angle = startAngle + (angleRange / (totalCards - 1)) * i
          const isSelected = selected.includes(i)
          return (
            <div
              key={card.number}
              className="tarot-fan-card"
              style={{
                transform: `rotate(${angle}deg) translateY(${isSelected ? -30 : 0}px)`,
                zIndex: isSelected ? 100 : i,
                animationDelay: `${i * 0.03}s`,
                left: '50%',
                marginLeft: '-50px',
                bottom: '0',
              }}
            >
              <TarotCard
                card={card}
                isFlipped={false}
                isSelected={isSelected}
                onClick={() => handleCardClick(i)}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

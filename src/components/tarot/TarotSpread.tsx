'use client'

import { useState, useEffect, useCallback } from 'react'
import TarotDeck from './TarotDeck'
import TarotCard from './TarotCard'
import TarotResult from './TarotResult'
import { drawThreeCards } from '@/lib/tarot/reading'
import type { TarotPhase, TarotReading } from '@/lib/tarot/types'

export default function TarotSpread() {
  const [phase, setPhase] = useState<TarotPhase>('selecting')
  const [reading, setReading] = useState<TarotReading | null>(null)
  const [revealedCount, setRevealedCount] = useState(0)

  const handleSelectionComplete = useCallback((selectedIndices: number[]) => {
    const result = drawThreeCards(selectedIndices)
    setReading(result)
    setPhase('shuffling')
  }, [])

  useEffect(() => {
    if (phase === 'shuffling') {
      const timer = setTimeout(() => setPhase('placing'), 1200)
      return () => clearTimeout(timer)
    }
    if (phase === 'placing') {
      const timer = setTimeout(() => setPhase('revealing'), 500)
      return () => clearTimeout(timer)
    }
    if (phase === 'revealing' && reading) {
      if (revealedCount < 3) {
        const timer = setTimeout(() => setRevealedCount(c => c + 1), 700)
        return () => clearTimeout(timer)
      } else {
        const timer = setTimeout(() => setPhase('result'), 300)
        return () => clearTimeout(timer)
      }
    }
  }, [phase, revealedCount, reading])

  function handleReset() {
    setPhase('selecting')
    setReading(null)
    setRevealedCount(0)
  }

  if (phase === 'selecting') {
    return <TarotDeck onSelectionComplete={handleSelectionComplete} />
  }

  if (!reading) return null

  const positionLabels = ['과거', '현재', '미래']

  if (phase === 'shuffling') {
    return (
      <div className="card">
        <p className="text-center accent-gold mb-4">카드를 섞고 있습니다...</p>
        <div className="flex justify-center gap-2">
          {reading.cards.map((_, i) => (
            <div key={i} className="shuffle-animation" style={{ animationDelay: `${i * 0.1}s` }}>
              <TarotCard isFlipped={false} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (phase === 'placing' || phase === 'revealing') {
    return (
      <div className="card">
        <div className="flex justify-center gap-6">
          {reading.cards.map((drawn, i) => (
            <div key={i} className="text-center place-animation" style={{ animationDelay: `${i * 0.15}s` }}>
              <p className="text-xs mb-2 accent-purple">{positionLabels[i]}</p>
              <TarotCard
                card={drawn.card}
                isFlipped={phase === 'revealing' && i < revealedCount}
                isReversed={drawn.isReversed}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // phase === 'result'
  return (
    <div>
      <div className="card mb-4">
        <div className="flex justify-center gap-6">
          {reading.cards.map((drawn, i) => (
            <div key={i} className="text-center">
              <p className="text-xs mb-2 accent-purple">{positionLabels[i]}</p>
              <TarotCard
                card={drawn.card}
                isFlipped={true}
                isReversed={drawn.isReversed}
              />
            </div>
          ))}
        </div>
      </div>
      <TarotResult cards={[...reading.cards]} onReset={handleReset} />
    </div>
  )
}

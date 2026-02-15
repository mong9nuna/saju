import { describe, it, expect } from 'vitest'
import { drawThreeCards, getInterpretation } from '../reading'

describe('타로 리딩', () => {
  it('3장의 카드를 뽑음', () => {
    const result = drawThreeCards([0, 5, 10])
    expect(result.cards).toHaveLength(3)
  })

  it('과거/현재/미래 위치가 순서대로 배정', () => {
    const result = drawThreeCards([0, 5, 10])
    expect(result.cards[0].position).toBe('past')
    expect(result.cards[1].position).toBe('present')
    expect(result.cards[2].position).toBe('future')
  })

  it('각 카드에 정/역방향이 결정됨', () => {
    const result = drawThreeCards([0, 5, 10])
    for (const drawn of result.cards) {
      expect(typeof drawn.isReversed).toBe('boolean')
    }
  })

  it('3장이 모두 다른 카드', () => {
    const result = drawThreeCards([0, 5, 10])
    const numbers = result.cards.map(c => c.card.number)
    expect(new Set(numbers).size).toBe(3)
  })

  it('해석 텍스트를 올바르게 반환', () => {
    const result = drawThreeCards([0, 5, 10])
    for (const drawn of result.cards) {
      const text = getInterpretation(drawn)
      expect(text.length).toBeGreaterThan(20)
    }
  })
})

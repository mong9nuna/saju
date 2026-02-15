import { describe, it, expect } from 'vitest'
import tarotData from '../tarot.json'
import { MAJOR_ARCANA_COUNT } from '@/lib/tarot/types'

describe('타로 카드 데이터 무결성', () => {
  it('22장의 카드가 존재', () => {
    expect(tarotData).toHaveLength(MAJOR_ARCANA_COUNT)
  })

  it('각 카드에 필수 필드가 존재', () => {
    for (const card of tarotData) {
      expect(card).toHaveProperty('number')
      expect(card).toHaveProperty('name')
      expect(card).toHaveProperty('symbol')
      expect(card).toHaveProperty('upright')
      expect(card).toHaveProperty('reversed')
    }
  })

  it('각 카드에 3개 위치별 해석이 존재', () => {
    for (const card of tarotData) {
      for (const dir of ['upright', 'reversed'] as const) {
        expect(card[dir]).toHaveProperty('keyword')
        expect(card[dir]).toHaveProperty('past')
        expect(card[dir]).toHaveProperty('present')
        expect(card[dir]).toHaveProperty('future')
        expect(card[dir].past.length).toBeGreaterThan(20)
        expect(card[dir].present.length).toBeGreaterThan(20)
        expect(card[dir].future.length).toBeGreaterThan(20)
      }
    }
  })

  it('카드 번호가 0~21까지 순서대로', () => {
    tarotData.forEach((card, idx) => {
      expect(card.number).toBe(idx)
    })
  })
})

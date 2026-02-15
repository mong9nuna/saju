import { describe, it, expect } from 'vitest'
import { CHEONGAN } from '@/lib/saju/types'
import personality from '../personality.json'
import career from '../career.json'
import wealth from '../wealth.json'
import love from '../love.json'
import health from '../health.json'
import advice from '../advice.json'
import constitution from '../constitution.json'

const categories = { personality, career, wealth, love, health, advice }

describe('해석 데이터 무결성', () => {
  for (const [name, data] of Object.entries(categories)) {
    it(`${name}.json에 10개 일간 키가 모두 존재`, () => {
      for (const cg of CHEONGAN) {
        expect(data).toHaveProperty(cg)
        expect((data as Record<string, { base: string }>)[cg]).toHaveProperty('base')
      }
    })
  }

  it('constitution.json에 4체질이 모두 존재', () => {
    expect(constitution).toHaveProperty('태양인')
    expect(constitution).toHaveProperty('태음인')
    expect(constitution).toHaveProperty('소양인')
    expect(constitution).toHaveProperty('소음인')
  })
})

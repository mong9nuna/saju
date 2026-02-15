import { describe, it, expect } from 'vitest'
import { generateInterpretation } from '../interpretation'
import type { SajuResult } from '@/lib/saju/types'

describe('해석 텍스트 조합', () => {
  const mockResult: SajuResult = {
    yearPillar: { cheongan: '경', jiji: '오' },
    monthPillar: { cheongan: '병', jiji: '인' },
    dayPillar: { cheongan: '갑', jiji: '자' },
    hourPillar: { cheongan: '임', jiji: '신' },
    ohaengDistribution: { '목': 3, '화': 2, '토': 0, '금': 1, '수': 2 },
    constitution: '소양인',
  }

  it('7개 섹션의 해석을 모두 반환', () => {
    const result = generateInterpretation(mockResult)
    expect(result).toHaveProperty('personality')
    expect(result).toHaveProperty('constitution')
    expect(result).toHaveProperty('career')
    expect(result).toHaveProperty('wealth')
    expect(result).toHaveProperty('love')
    expect(result).toHaveProperty('health')
    expect(result).toHaveProperty('advice')
  })

  it('각 섹션은 비어있지 않은 문자열', () => {
    const result = generateInterpretation(mockResult)
    for (const value of Object.values(result)) {
      expect(value.length).toBeGreaterThan(50)
    }
  })
})

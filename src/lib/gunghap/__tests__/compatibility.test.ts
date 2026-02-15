import { describe, it, expect } from 'vitest'
import { calculateGunghap } from '../compatibility'
import type { SajuResult } from '@/lib/saju/types'

describe('궁합 계산', () => {
  const person1: SajuResult = {
    yearPillar: { cheongan: '갑', jiji: '자' },
    monthPillar: { cheongan: '병', jiji: '인' },
    dayPillar: { cheongan: '갑', jiji: '오' },
    hourPillar: { cheongan: '임', jiji: '신' },
    ohaengDistribution: { '목': 3, '화': 2, '토': 0, '금': 1, '수': 2 },
    constitution: '소양인',
  }

  const person2: SajuResult = {
    yearPillar: { cheongan: '정', jiji: '해' },
    monthPillar: { cheongan: '기', jiji: '유' },
    dayPillar: { cheongan: '정', jiji: '묘' },
    hourPillar: { cheongan: '경', jiji: '술' },
    ohaengDistribution: { '목': 1, '화': 2, '토': 2, '금': 2, '수': 1 },
    constitution: '태음인',
  }

  it('궁합 점수를 0~100 사이로 반환', () => {
    const result = calculateGunghap(person1, person2)
    expect(result.score).toBeGreaterThanOrEqual(0)
    expect(result.score).toBeLessThanOrEqual(100)
  })

  it('모든 분석 필드가 존재', () => {
    const result = calculateGunghap(person1, person2)
    expect(result.ohaengRelation).toBeTruthy()
    expect(result.jijiRelation).toBeTruthy()
    expect(result.constitutionRelation).toBeTruthy()
  })
})

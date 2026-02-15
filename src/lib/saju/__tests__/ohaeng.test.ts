import { describe, it, expect } from 'vitest'
import { analyzeOhaeng } from '../ohaeng'
import type { Pillar } from '../types'

describe('오행 분석', () => {
  it('4주의 오행 분포를 정확히 계산', () => {
    const pillars = {
      yearPillar: { cheongan: '갑', jiji: '자' } as Pillar,   // 목, 수
      monthPillar: { cheongan: '병', jiji: '인' } as Pillar,  // 화, 목
      dayPillar: { cheongan: '갑', jiji: '오' } as Pillar,    // 목, 화
      hourPillar: { cheongan: '임', jiji: '신' } as Pillar,   // 수, 금
    }
    const dist = analyzeOhaeng(pillars)
    expect(dist['목']).toBe(3) // 갑+갑+인
    expect(dist['화']).toBe(2) // 병+오
    expect(dist['수']).toBe(2) // 자+임
    expect(dist['금']).toBe(1) // 신
    expect(dist['토']).toBe(0)
  })
})

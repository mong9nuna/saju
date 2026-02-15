import { describe, it, expect } from 'vitest'
import { determineConstitution } from '../constitution'
import type { Ohaeng } from '../types'

describe('사상체질 판별', () => {
  it('화가 강하면 태양인', () => {
    const dist: Record<Ohaeng, number> = { '목': 1, '화': 4, '토': 1, '금': 1, '수': 1 }
    expect(determineConstitution(dist)).toBe('태양인')
  })

  it('목이 강하면 소양인', () => {
    const dist: Record<Ohaeng, number> = { '목': 4, '화': 1, '토': 1, '금': 1, '수': 1 }
    expect(determineConstitution(dist)).toBe('소양인')
  })

  it('금이 강하면 태음인', () => {
    const dist: Record<Ohaeng, number> = { '목': 1, '화': 1, '토': 1, '금': 4, '수': 1 }
    expect(determineConstitution(dist)).toBe('태음인')
  })

  it('수가 강하면 소음인', () => {
    const dist: Record<Ohaeng, number> = { '목': 1, '화': 1, '토': 1, '금': 1, '수': 4 }
    expect(determineConstitution(dist)).toBe('소음인')
  })

  it('토가 강하면 차순위 오행으로 판별', () => {
    const dist: Record<Ohaeng, number> = { '목': 1, '화': 2, '토': 3, '금': 1, '수': 1 }
    expect(determineConstitution(dist)).toBe('태양인') // 토 다음으로 화가 강함
  })
})

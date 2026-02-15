import { describe, it, expect } from 'vitest'
import {
  CHEONGAN,
  JIJI,
  CHEONGAN_OHAENG,
  JIJI_OHAENG,
} from '../types'

describe('사주 상수 데이터', () => {
  it('천간은 10개', () => {
    expect(CHEONGAN).toHaveLength(10)
    expect(CHEONGAN[0]).toBe('갑')
    expect(CHEONGAN[9]).toBe('계')
  })

  it('지지는 12개', () => {
    expect(JIJI).toHaveLength(12)
    expect(JIJI[0]).toBe('자')
    expect(JIJI[11]).toBe('해')
  })

  it('천간-오행 매핑이 정확함', () => {
    expect(CHEONGAN_OHAENG['갑']).toBe('목')
    expect(CHEONGAN_OHAENG['병']).toBe('화')
    expect(CHEONGAN_OHAENG['무']).toBe('토')
    expect(CHEONGAN_OHAENG['경']).toBe('금')
    expect(CHEONGAN_OHAENG['임']).toBe('수')
  })

  it('지지-오행 매핑이 정확함', () => {
    expect(JIJI_OHAENG['인']).toBe('목')
    expect(JIJI_OHAENG['오']).toBe('화')
    expect(JIJI_OHAENG['술']).toBe('토')
    expect(JIJI_OHAENG['유']).toBe('금')
    expect(JIJI_OHAENG['자']).toBe('수')
  })
})

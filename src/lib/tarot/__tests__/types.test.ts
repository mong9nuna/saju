import { describe, it, expect } from 'vitest'
import { MAJOR_ARCANA_COUNT } from '../types'

describe('타로 타입', () => {
  it('메이저 아르카나는 22장', () => {
    expect(MAJOR_ARCANA_COUNT).toBe(22)
  })
})

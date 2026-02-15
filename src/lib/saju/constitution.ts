import { OHAENG } from './types'
import type { Ohaeng, Constitution } from './types'

const OHAENG_CONSTITUTION: Partial<Record<Ohaeng, Constitution>> = {
  '화': '태양인',
  '목': '소양인',
  '금': '태음인',
  '수': '소음인',
}

export function determineConstitution(dist: Record<Ohaeng, number>): Constitution {
  const sorted = [...OHAENG].sort((a, b) => dist[b] - dist[a])

  const dominant = sorted[0]

  if (dominant === '토') {
    const secondDominant = sorted[1]
    return OHAENG_CONSTITUTION[secondDominant] ?? '태음인'
  }

  return OHAENG_CONSTITUTION[dominant] ?? '태음인'
}

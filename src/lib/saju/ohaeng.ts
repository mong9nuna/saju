import { CHEONGAN_OHAENG, JIJI_OHAENG, OHAENG } from './types'
import type { Pillar, Ohaeng } from './types'

interface PillarSet {
  yearPillar: Pillar
  monthPillar: Pillar
  dayPillar: Pillar
  hourPillar: Pillar | null
}

export function analyzeOhaeng(pillars: PillarSet): Record<Ohaeng, number> {
  const dist: Record<Ohaeng, number> = { '목': 0, '화': 0, '토': 0, '금': 0, '수': 0 }

  const allPillars = [pillars.yearPillar, pillars.monthPillar, pillars.dayPillar, pillars.hourPillar].filter((p): p is Pillar => p !== null)

  for (const pillar of allPillars) {
    dist[CHEONGAN_OHAENG[pillar.cheongan]]++
    dist[JIJI_OHAENG[pillar.jiji]]++
  }

  return dist
}

export function getDominantOhaeng(dist: Record<Ohaeng, number>): Ohaeng {
  return OHAENG.reduce((max, curr) => (dist[curr] > dist[max] ? curr : max), OHAENG[0])
}

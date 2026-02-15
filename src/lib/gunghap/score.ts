import type { SajuResult, Jiji } from '../saju/types'

const YUKHAP: [Jiji, Jiji][] = [
  ['자', '축'], ['인', '해'], ['묘', '술'], ['진', '유'], ['사', '신'], ['오', '미'],
]

const CHUNG: [Jiji, Jiji][] = [
  ['자', '오'], ['축', '미'], ['인', '신'], ['묘', '유'], ['진', '술'], ['사', '해'],
]

function hasRelation(pairs: [Jiji, Jiji][], a: Jiji, b: Jiji): boolean {
  return pairs.some(([x, y]) => (x === a && y === b) || (x === b && y === a))
}

export function calcOhaengScore(p1: SajuResult, p2: SajuResult): { score: number; description: string } {
  let score = 60
  const descriptions: string[] = []

  const j1 = p1.dayPillar.jiji
  const j2 = p2.dayPillar.jiji

  if (hasRelation(YUKHAP, j1, j2)) {
    score += 25
    descriptions.push(`${j1}와(과) ${j2}는 육합(六合) 관계로 자연스러운 끌림이 있습니다.`)
  }

  if (hasRelation(CHUNG, j1, j2)) {
    score -= 20
    descriptions.push(`${j1}와(과) ${j2}는 충(沖) 관계로 갈등에 주의가 필요합니다.`)
  }

  const y1 = p1.yearPillar.jiji
  const y2 = p2.yearPillar.jiji

  if (hasRelation(YUKHAP, y1, y2)) {
    score += 10
    descriptions.push(`연지(年支)에서도 합을 이루어 첫 만남의 인연이 좋습니다.`)
  }

  if (hasRelation(CHUNG, y1, y2)) {
    score -= 10
    descriptions.push(`연지(年支)에서 충이 있어 초반 적응 기간이 필요할 수 있습니다.`)
  }

  if (descriptions.length === 0) {
    descriptions.push('지지 간에 특별한 합이나 충은 없으며, 평온한 관계를 유지할 수 있습니다.')
  }

  return { score: Math.min(100, Math.max(0, score)), description: descriptions.join(' ') }
}

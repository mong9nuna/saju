import type { SajuResult, Ohaeng, Constitution, GunghapResult } from '../saju/types'
import { CHEONGAN_OHAENG } from '../saju/types'
import { calcOhaengScore } from './score'

const SANGSAENG: Record<Ohaeng, Ohaeng> = {
  '목': '화', '화': '토', '토': '금', '금': '수', '수': '목',
}

const SANGGEUK: Record<Ohaeng, Ohaeng> = {
  '목': '토', '화': '금', '토': '수', '금': '목', '수': '화',
}

const CONSTITUTION_SCORE: Record<string, number> = {
  '태양인-소음인': 95, '소음인-태양인': 95,
  '태음인-소양인': 90, '소양인-태음인': 90,
  '태양인-태음인': 75, '태음인-태양인': 75,
  '소양인-소음인': 75, '소음인-소양인': 75,
  '태양인-소양인': 65, '소양인-태양인': 65,
  '태음인-소음인': 65, '소음인-태음인': 65,
  '태양인-태양인': 55, '태음인-태음인': 60,
  '소양인-소양인': 55, '소음인-소음인': 60,
}

export function calculateGunghap(p1: SajuResult, p2: SajuResult): GunghapResult {
  const o1 = CHEONGAN_OHAENG[p1.dayPillar.cheongan]
  const o2 = CHEONGAN_OHAENG[p2.dayPillar.cheongan]

  let ohaengScore = 50
  let ohaengRelation = '비화(比和): 같은 기운으로 동질감이 있습니다.'

  if (o1 === o2) {
    ohaengScore = 70
    ohaengRelation = `비화(比和): 두 분 모두 ${o1}의 기운으로 깊은 동질감이 있습니다.`
  } else if (SANGSAENG[o1] === o2) {
    ohaengScore = 90
    ohaengRelation = `상생(相生): ${o1}이(가) ${o2}을(를) 생하여 자연스럽게 돕는 관계입니다.`
  } else if (SANGSAENG[o2] === o1) {
    ohaengScore = 85
    ohaengRelation = `상생(相生): ${o2}이(가) ${o1}을(를) 생하여 서로 보완하는 관계입니다.`
  } else if (SANGGEUK[o1] === o2) {
    ohaengScore = 40
    ohaengRelation = `상극(相剋): ${o1}이(가) ${o2}을(를) 극하여 갈등이 생길 수 있습니다.`
  } else if (SANGGEUK[o2] === o1) {
    ohaengScore = 45
    ohaengRelation = `상극(相剋): ${o2}이(가) ${o1}을(를) 극하여 주의가 필요합니다.`
  }

  const jijiResult = calcOhaengScore(p1, p2)

  const constKey = `${p1.constitution}-${p2.constitution}`
  const constScore = CONSTITUTION_SCORE[constKey] ?? 60
  const constitutionRelation = getConstitutionRelation(p1.constitution, p2.constitution)

  const totalScore = Math.round(ohaengScore * 0.4 + jijiResult.score * 0.35 + constScore * 0.25)

  return {
    score: Math.min(100, Math.max(0, totalScore)),
    ohaengRelation,
    jijiRelation: jijiResult.description,
    constitutionRelation,
  }
}

function getConstitutionRelation(c1: Constitution, c2: Constitution): string {
  if ((c1 === '태양인' && c2 === '소음인') || (c1 === '소음인' && c2 === '태양인')) {
    return '태양인과 소음인은 음양이 완벽히 보완되는 최고의 궁합입니다. 서로의 부족한 부분을 자연스럽게 채워줍니다.'
  }
  if ((c1 === '태음인' && c2 === '소양인') || (c1 === '소양인' && c2 === '태음인')) {
    return '태음인과 소양인은 내면과 외면이 조화를 이루는 좋은 궁합입니다. 안정과 활력의 균형이 잘 맞습니다.'
  }
  if (c1 === c2) {
    return `같은 ${c1}끼리는 서로를 잘 이해하지만, 비슷한 약점을 공유하므로 의식적인 보완이 필요합니다.`
  }
  return `${c1}과 ${c2}의 조합은 서로 다른 기질이 만나 새로운 시너지를 만들 수 있습니다. 차이를 존중하는 것이 핵심입니다.`
}

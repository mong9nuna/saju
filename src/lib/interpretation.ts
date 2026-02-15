import type { SajuResult, Ohaeng } from './saju/types'
import { getDominantOhaeng } from './saju/ohaeng'
import personalityData from '@/data/personality.json'
import careerData from '@/data/career.json'
import wealthData from '@/data/wealth.json'
import loveData from '@/data/love.json'
import healthData from '@/data/health.json'
import adviceData from '@/data/advice.json'
import constitutionData from '@/data/constitution.json'

export interface InterpretationResult {
  personality: string
  constitution: string
  career: string
  wealth: string
  love: string
  health: string
  advice: string
}

const OHAENG_KEY: Record<Ohaeng, string> = {
  '목': '목강', '화': '화강', '토': '토강', '금': '금강', '수': '수강',
}

function getInterpretation(
  data: Record<string, { base: string; [key: string]: string }>,
  dayGan: string,
  dominantOhaeng: Ohaeng
): string {
  const entry = data[dayGan]
  if (!entry) return ''
  const modifier = entry[OHAENG_KEY[dominantOhaeng]] ?? ''
  return `${entry.base}\n\n${modifier}`.trim()
}

export function generateInterpretation(saju: SajuResult): InterpretationResult {
  const dayGan = saju.dayPillar.cheongan
  const dominant = getDominantOhaeng(saju.ohaengDistribution)

  const constData = constitutionData[saju.constitution as keyof typeof constitutionData]

  return {
    personality: getInterpretation(personalityData as never, dayGan, dominant),
    constitution: constData
      ? `${constData.description}\n\n${constData.health}\n\n${constData.food}`
      : '',
    career: getInterpretation(careerData as never, dayGan, dominant),
    wealth: getInterpretation(wealthData as never, dayGan, dominant),
    love: getInterpretation(loveData as never, dayGan, dominant),
    health: getInterpretation(healthData as never, dayGan, dominant),
    advice: getInterpretation(adviceData as never, dayGan, dominant),
  }
}

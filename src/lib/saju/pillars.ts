import { CHEONGAN, JIJI, JIJI_HOUR } from './types'
import type { Pillar } from './types'
import { DateInput, toLunarDate } from './calendar'

// 연주 계산: 갑자년 기준점 1984년
function calcYearPillar(lunarYear: number): Pillar {
  const offset = lunarYear - 1984
  const idx = ((offset % 60) + 60) % 60
  return {
    cheongan: CHEONGAN[idx % 10],
    jiji: JIJI[idx % 12],
  }
}

// 월주 계산: 연간(年干)에 따른 월간 기준 + 월지는 인월(1월)부터 시작
function calcMonthPillar(lunarMonth: number, yearCheonganIdx: number): Pillar {
  // 월지: 인(1월), 묘(2월), ... 축(12월)
  const monthJijiIdx = (lunarMonth + 1) % 12
  // 월간: 연간×2 + 월 기반 공식
  const monthCheonganIdx = (yearCheonganIdx * 2 + lunarMonth) % 10
  return {
    cheongan: CHEONGAN[monthCheonganIdx],
    jiji: JIJI[monthJijiIdx],
  }
}

// 일주 계산: 기준일로부터 날짜 차이 계산
function calcDayPillar(year: number, month: number, day: number): Pillar {
  // 기준: 2000년 1월 1일 = 갑진일 (천간 0, 지지 4 기준)
  const baseDate = new Date(2000, 0, 1)
  const targetDate = new Date(year, month - 1, day)
  const diffDays = Math.round((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24))

  const baseStemIdx = 0  // 갑
  const baseBranchIdx = 4 // 진

  const stemIdx = (((baseStemIdx + diffDays) % 10) + 10) % 10
  const branchIdx = (((baseBranchIdx + diffDays) % 12) + 12) % 12

  return {
    cheongan: CHEONGAN[stemIdx],
    jiji: JIJI[branchIdx],
  }
}

// 시주 계산: 일간에 따른 시간 천간 + 시간대별 지지
function calcHourPillar(hour: number, dayCheonganIdx: number): Pillar {
  const hourStr = String(hour)
  const jiji = JIJI_HOUR[hourStr]
  const jijiIdx = JIJI.indexOf(jiji)

  // 시간 천간: 일간×2 + 시지 인덱스
  const cheonganIdx = (dayCheonganIdx * 2 + jijiIdx) % 10

  return {
    cheongan: CHEONGAN[cheonganIdx],
    jiji,
  }
}

export function calculatePillars(input: DateInput) {
  const lunar = toLunarDate(input)

  const yearPillar = calcYearPillar(lunar.year)
  const yearCheonganIdx = CHEONGAN.indexOf(yearPillar.cheongan)

  const monthPillar = calcMonthPillar(lunar.month, yearCheonganIdx)

  // 일주는 양력 기준으로 계산 (정확한 날짜 차이 필요)
  const dayPillar = calcDayPillar(input.year, input.month, input.day)
  const dayCheonganIdx = CHEONGAN.indexOf(dayPillar.cheongan)

  const hourPillar = input.hour !== null ? calcHourPillar(input.hour, dayCheonganIdx) : null

  return { yearPillar, monthPillar, dayPillar, hourPillar }
}

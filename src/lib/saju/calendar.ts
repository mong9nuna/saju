import KoreanLunarCalendar from 'korean-lunar-calendar'

export interface DateInput {
  year: number
  month: number
  day: number
  hour: number | null
  isLunar: boolean
}

export function toLunarDate(input: DateInput): { year: number; month: number; day: number } {
  const cal = new KoreanLunarCalendar()

  if (input.isLunar) {
    return { year: input.year, month: input.month, day: input.day }
  }

  cal.setSolarDate(input.year, input.month, input.day)
  const lunar = cal.getLunarCalendar()
  return { year: lunar.year, month: lunar.month, day: lunar.day }
}

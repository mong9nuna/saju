# 사주팔자 웹앱 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 생년월일/시간 기반 사주팔자 해석 + 궁합 분석 웹앱 구축

**Architecture:** Next.js 15 정적 사이트. 클라이언트 사이드에서 사주 계산, JSON 기반 해석 텍스트 조합. 탭 2개 (내 사주 / 궁합).

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS 4, korean-lunar-calendar, Vitest

---

## Task 1: 프로젝트 초기 설정

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `vitest.config.ts`
- Create: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`

**Step 1: Next.js 프로젝트 생성**

```bash
cd /Users/suyul/Desktop/supertest
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias --use-npm
```

**Step 2: 추가 의존성 설치**

```bash
npm install korean-lunar-calendar
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

**Step 3: vitest.config.ts 생성**

```typescript
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**Step 4: package.json에 test 스크립트 추가**

`package.json`의 scripts에 추가:
```json
"test": "vitest run",
"test:watch": "vitest"
```

**Step 5: next.config.ts에 static export 설정**

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
}

export default nextConfig
```

**Step 6: 빌드 확인**

```bash
npm run build
```
Expected: 정상 빌드

**Step 7: 커밋**

```bash
git add -A
git commit -m "feat: initialize Next.js project with dependencies"
```

---

## Task 2: 핵심 타입 및 상수 정의

**Files:**
- Create: `src/lib/saju/types.ts`
- Test: `src/lib/saju/__tests__/types.test.ts`

**Step 1: 테스트 작성**

```typescript
// src/lib/saju/__tests__/types.test.ts
import { describe, it, expect } from 'vitest'
import {
  CHEONGAN,
  JIJI,
  OHAENG,
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
```

**Step 2: 테스트 실행 → 실패 확인**

```bash
npx vitest run src/lib/saju/__tests__/types.test.ts
```
Expected: FAIL

**Step 3: types.ts 구현**

```typescript
// src/lib/saju/types.ts
export const CHEONGAN = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'] as const
export const JIJI = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'] as const
export const OHAENG = ['목', '화', '토', '금', '수'] as const

export type Cheongan = (typeof CHEONGAN)[number]
export type Jiji = (typeof JIJI)[number]
export type Ohaeng = (typeof OHAENG)[number]
export type Constitution = '태양인' | '태음인' | '소양인' | '소음인'

export interface Pillar {
  cheongan: Cheongan
  jiji: Jiji
}

export interface SajuResult {
  yearPillar: Pillar
  monthPillar: Pillar
  dayPillar: Pillar
  hourPillar: Pillar
  ohaengDistribution: Record<Ohaeng, number>
  constitution: Constitution
}

export interface GunghapResult {
  score: number
  ohaengRelation: string
  jijiRelation: string
  constitutionRelation: string
}

// 천간 → 오행 매핑
export const CHEONGAN_OHAENG: Record<Cheongan, Ohaeng> = {
  '갑': '목', '을': '목',
  '병': '화', '정': '화',
  '무': '토', '기': '토',
  '경': '금', '신': '금',
  '임': '수', '계': '수',
}

// 지지 → 오행 매핑
export const JIJI_OHAENG: Record<Jiji, Ohaeng> = {
  '인': '목', '묘': '목',
  '사': '화', '오': '화',
  '진': '토', '술': '토', '축': '토', '미': '토',
  '신': '금', '유': '금',
  '해': '수', '자': '수',
}

// 지지 시간대 매핑 (시주 계산용)
export const JIJI_HOUR: Record<string, Jiji> = {
  '23': '자', '0': '자', '1': '축', '2': '축',
  '3': '인', '4': '인', '5': '묘', '6': '묘',
  '7': '진', '8': '진', '9': '사', '10': '사',
  '11': '오', '12': '오', '13': '미', '14': '미',
  '15': '신', '16': '신', '17': '유', '18': '유',
  '19': '술', '20': '술', '21': '해', '22': '해',
}
```

**Step 4: 테스트 실행 → 통과 확인**

```bash
npx vitest run src/lib/saju/__tests__/types.test.ts
```
Expected: PASS

**Step 5: 커밋**

```bash
git add src/lib/saju/types.ts src/lib/saju/__tests__/types.test.ts
git commit -m "feat: add core saju types and constants"
```

---

## Task 3: 사주 기둥(柱) 계산 엔진

**Files:**
- Create: `src/lib/saju/calendar.ts`
- Create: `src/lib/saju/pillars.ts`
- Test: `src/lib/saju/__tests__/pillars.test.ts`

**Step 1: 테스트 작성**

알려진 사주를 기반으로 검증. 예: 1990년 1월 15일 (양력) 오전 9시 태생.

```typescript
// src/lib/saju/__tests__/pillars.test.ts
import { describe, it, expect } from 'vitest'
import { calculatePillars } from '../pillars'

describe('사주 기둥 계산', () => {
  it('1990-01-15 09:00 양력의 사주를 정확히 계산', () => {
    const result = calculatePillars({
      year: 1990,
      month: 1,
      day: 15,
      hour: 9,
      isLunar: false,
    })

    // 1990년 = 경오년
    expect(result.yearPillar.cheongan).toBe('경')
    expect(result.yearPillar.jiji).toBe('오')
  })

  it('연주 천간은 60갑자 순환을 따름', () => {
    // 1984년 = 갑자년
    const result = calculatePillars({
      year: 1984, month: 1, day: 1, hour: 12, isLunar: false,
    })
    expect(result.yearPillar.cheongan).toBe('갑')
    expect(result.yearPillar.jiji).toBe('자')
  })

  it('시주 지지는 시간대에 따라 결정', () => {
    const result = calculatePillars({
      year: 1990, month: 6, day: 15, hour: 9, isLunar: false,
    })
    // 9시 = 사시(巳時)
    expect(result.hourPillar.jiji).toBe('사')
  })

  it('4개의 기둥이 모두 존재', () => {
    const result = calculatePillars({
      year: 2000, month: 3, day: 20, hour: 14, isLunar: false,
    })
    expect(result.yearPillar).toBeDefined()
    expect(result.monthPillar).toBeDefined()
    expect(result.dayPillar).toBeDefined()
    expect(result.hourPillar).toBeDefined()
  })
})
```

**Step 2: 테스트 실행 → 실패 확인**

```bash
npx vitest run src/lib/saju/__tests__/pillars.test.ts
```
Expected: FAIL

**Step 3: calendar.ts 구현**

```typescript
// src/lib/saju/calendar.ts
import KoreanLunarCalendar from 'korean-lunar-calendar'

export interface DateInput {
  year: number
  month: number
  day: number
  hour: number
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
```

**Step 4: pillars.ts 구현**

```typescript
// src/lib/saju/pillars.ts
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

  // 2000-01-01은 60갑자에서 40번째 (갑진)
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

  const hourPillar = calcHourPillar(input.hour, dayCheonganIdx)

  return { yearPillar, monthPillar, dayPillar, hourPillar }
}
```

**Step 5: 테스트 실행 → 통과 확인**

```bash
npx vitest run src/lib/saju/__tests__/pillars.test.ts
```
Expected: PASS (일부 정확한 값은 실제 만세력과 대조해서 조정 필요)

**Step 6: 커밋**

```bash
git add src/lib/saju/calendar.ts src/lib/saju/pillars.ts src/lib/saju/__tests__/pillars.test.ts
git commit -m "feat: implement saju pillar calculation engine"
```

---

## Task 4: 오행 분석 & 사상체질 판별

**Files:**
- Create: `src/lib/saju/ohaeng.ts`
- Create: `src/lib/saju/constitution.ts`
- Test: `src/lib/saju/__tests__/ohaeng.test.ts`
- Test: `src/lib/saju/__tests__/constitution.test.ts`

**Step 1: 오행 테스트 작성**

```typescript
// src/lib/saju/__tests__/ohaeng.test.ts
import { describe, it, expect } from 'vitest'
import { analyzeOhaeng } from '../ohaeng'
import type { Pillar } from '../types'

describe('오행 분석', () => {
  it('4주의 오행 분포를 정확히 계산', () => {
    const pillars = {
      yearPillar: { cheongan: '갑', jiji: '자' } as Pillar,   // 목, 수
      monthPillar: { cheongan: '병', jiji: '인' } as Pillar,  // 화, 목
      dayPillar: { cheongan: '갑', jiji: '오' } as Pillar,    // 목, 화
      hourPillar: { cheongan: '임', jiji: '신' } as Pillar,   // 수, 금
    }
    const dist = analyzeOhaeng(pillars)
    expect(dist['목']).toBe(3) // 갑+갑+인
    expect(dist['화']).toBe(2) // 병+오
    expect(dist['수']).toBe(2) // 자+임
    expect(dist['금']).toBe(1) // 신
    expect(dist['토']).toBe(0)
  })
})
```

**Step 2: 테스트 실행 → 실패 확인**

```bash
npx vitest run src/lib/saju/__tests__/ohaeng.test.ts
```

**Step 3: ohaeng.ts 구현**

```typescript
// src/lib/saju/ohaeng.ts
import { CHEONGAN_OHAENG, JIJI_OHAENG, OHAENG } from './types'
import type { Pillar, Ohaeng } from './types'

interface FourPillars {
  yearPillar: Pillar
  monthPillar: Pillar
  dayPillar: Pillar
  hourPillar: Pillar
}

export function analyzeOhaeng(pillars: FourPillars): Record<Ohaeng, number> {
  const dist: Record<Ohaeng, number> = { '목': 0, '화': 0, '토': 0, '금': 0, '수': 0 }

  const allPillars = [pillars.yearPillar, pillars.monthPillar, pillars.dayPillar, pillars.hourPillar]

  for (const pillar of allPillars) {
    dist[CHEONGAN_OHAENG[pillar.cheongan]]++
    dist[JIJI_OHAENG[pillar.jiji]]++
  }

  return dist
}

export function getDominantOhaeng(dist: Record<Ohaeng, number>): Ohaeng {
  return OHAENG.reduce((max, curr) => (dist[curr] > dist[max] ? curr : max), OHAENG[0])
}
```

**Step 4: 테스트 실행 → 통과 확인**

```bash
npx vitest run src/lib/saju/__tests__/ohaeng.test.ts
```

**Step 5: 체질 테스트 작성**

```typescript
// src/lib/saju/__tests__/constitution.test.ts
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
```

**Step 6: constitution.ts 구현**

```typescript
// src/lib/saju/constitution.ts
import { OHAENG } from './types'
import type { Ohaeng, Constitution } from './types'

const OHAENG_CONSTITUTION: Partial<Record<Ohaeng, Constitution>> = {
  '화': '태양인',
  '목': '소양인',
  '금': '태음인',
  '수': '소음인',
}

export function determineConstitution(dist: Record<Ohaeng, number>): Constitution {
  // 오행을 개수 내림차순 정렬
  const sorted = [...OHAENG].sort((a, b) => dist[b] - dist[a])

  const dominant = sorted[0]

  // 토가 지배적이면 차순위로 판별
  if (dominant === '토') {
    const secondDominant = sorted[1]
    return OHAENG_CONSTITUTION[secondDominant] ?? '태음인'
  }

  return OHAENG_CONSTITUTION[dominant] ?? '태음인'
}
```

**Step 7: 테스트 실행 → 통과 확인**

```bash
npx vitest run src/lib/saju/__tests__/constitution.test.ts
```

**Step 8: 커밋**

```bash
git add src/lib/saju/ohaeng.ts src/lib/saju/constitution.ts src/lib/saju/__tests__/ohaeng.test.ts src/lib/saju/__tests__/constitution.test.ts
git commit -m "feat: add ohaeng analysis and constitution determination"
```

---

## Task 5: 해석 데이터 JSON 파일 생성

**Files:**
- Create: `src/data/cheongan.json` - 천간별 기본 성격
- Create: `src/data/jiji.json` - 지지별 특성
- Create: `src/data/dayPillar.json` - 10일간별 핵심 성격 (2~3문단)
- Create: `src/data/constitution.json` - 4체질 상세 해석
- Create: `src/data/personality.json` - 일간+오행 기반 성격
- Create: `src/data/career.json` - 직업운
- Create: `src/data/wealth.json` - 재물운
- Create: `src/data/love.json` - 연애운
- Create: `src/data/health.json` - 건강운
- Create: `src/data/advice.json` - 종합 조언

**Step 1: 데이터 구조 설계**

모든 해석 JSON은 동일한 구조를 따름:
```json
{
  "갑": {
    "base": "2~3문단 기본 해석 텍스트",
    "목강": "목이 강할 때 추가 해석",
    "화강": "화가 강할 때 추가 해석",
    "토강": "토가 강할 때 추가 해석",
    "금강": "금이 강할 때 추가 해석",
    "수강": "수가 강할 때 추가 해석"
  },
  "을": { ... },
  ...
}
```

- 키: 10개 일간 (갑~계)
- `base`: 모든 경우 공통 해석 (2~3문단)
- 오행 수식어: 지배적 오행에 따른 추가 1문단

이렇게 하면 10 일간 × (1 base + 5 오행) × 6 카테고리 = 총 360개 텍스트 블록.
조합하면 카테고리당 3~4문단, 전체 7개 카드 × 3~4문단 = A4 한 장 이상.

**Step 2: 각 JSON 파일 작성**

각 파일에 10개 일간별로 한국어 해석 텍스트를 작성. 텍스트는 사주 해석의 전통적 맥락을 반영하되, 현대적이고 읽기 쉬운 문체로 작성.

> 참고: 이 작업은 텍스트 콘텐츠 작성이 주된 작업. 각 일간별 base 텍스트 2~3문단, 오행 수식어 각 1문단씩 작성. constitution.json은 4개 체질별 3~4문단.

**Step 3: constitution.json 별도 구조**

```json
{
  "태양인": {
    "description": "체질 설명 3~4문단",
    "health": "건강 관리법",
    "food": "좋은 음식/나쁜 음식"
  },
  ...
}
```

**Step 4: 테스트 - JSON 데이터 무결성 확인**

```typescript
// src/data/__tests__/data-integrity.test.ts
import { describe, it, expect } from 'vitest'
import { CHEONGAN } from '@/lib/saju/types'
import personality from '../personality.json'
import career from '../career.json'
import wealth from '../wealth.json'
import love from '../love.json'
import health from '../health.json'
import advice from '../advice.json'
import constitution from '../constitution.json'

const categories = { personality, career, wealth, love, health, advice }

describe('해석 데이터 무결성', () => {
  for (const [name, data] of Object.entries(categories)) {
    it(`${name}.json에 10개 일간 키가 모두 존재`, () => {
      for (const cg of CHEONGAN) {
        expect(data).toHaveProperty(cg)
        expect(data[cg as keyof typeof data]).toHaveProperty('base')
      }
    })
  }

  it('constitution.json에 4체질이 모두 존재', () => {
    expect(constitution).toHaveProperty('태양인')
    expect(constitution).toHaveProperty('태음인')
    expect(constitution).toHaveProperty('소양인')
    expect(constitution).toHaveProperty('소음인')
  })
})
```

**Step 5: 테스트 실행 → 통과 확인**

```bash
npx vitest run src/data/__tests__/data-integrity.test.ts
```

**Step 6: 커밋**

```bash
git add src/data/
git commit -m "feat: add all interpretation data JSON files"
```

---

## Task 6: 해석 텍스트 조합 로직

**Files:**
- Create: `src/lib/interpretation.ts`
- Test: `src/lib/__tests__/interpretation.test.ts`

**Step 1: 테스트 작성**

```typescript
// src/lib/__tests__/interpretation.test.ts
import { describe, it, expect } from 'vitest'
import { generateInterpretation } from '../interpretation'
import type { SajuResult } from '@/lib/saju/types'

describe('해석 텍스트 조합', () => {
  const mockResult: SajuResult = {
    yearPillar: { cheongan: '경', jiji: '오' },
    monthPillar: { cheongan: '병', jiji: '인' },
    dayPillar: { cheongan: '갑', jiji: '자' },
    hourPillar: { cheongan: '임', jiji: '신' },
    ohaengDistribution: { '목': 3, '화': 2, '토': 0, '금': 1, '수': 2 },
    constitution: '소양인',
  }

  it('7개 섹션의 해석을 모두 반환', () => {
    const result = generateInterpretation(mockResult)
    expect(result).toHaveProperty('personality')
    expect(result).toHaveProperty('constitution')
    expect(result).toHaveProperty('career')
    expect(result).toHaveProperty('wealth')
    expect(result).toHaveProperty('love')
    expect(result).toHaveProperty('health')
    expect(result).toHaveProperty('advice')
  })

  it('각 섹션은 비어있지 않은 문자열', () => {
    const result = generateInterpretation(mockResult)
    for (const value of Object.values(result)) {
      expect(value.length).toBeGreaterThan(50)
    }
  })
})
```

**Step 2: interpretation.ts 구현**

```typescript
// src/lib/interpretation.ts
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
```

**Step 3: 테스트 실행 → 통과 확인**

```bash
npx vitest run src/lib/__tests__/interpretation.test.ts
```

**Step 4: 커밋**

```bash
git add src/lib/interpretation.ts src/lib/__tests__/interpretation.test.ts
git commit -m "feat: add interpretation text assembly logic"
```

---

## Task 7: 궁합 계산 엔진

**Files:**
- Create: `src/lib/gunghap/compatibility.ts`
- Create: `src/lib/gunghap/score.ts`
- Create: `src/data/gunghap.json`
- Test: `src/lib/gunghap/__tests__/compatibility.test.ts`

**Step 1: 테스트 작성**

```typescript
// src/lib/gunghap/__tests__/compatibility.test.ts
import { describe, it, expect } from 'vitest'
import { calculateGunghap } from '../compatibility'
import type { SajuResult } from '@/lib/saju/types'

describe('궁합 계산', () => {
  const person1: SajuResult = {
    yearPillar: { cheongan: '갑', jiji: '자' },
    monthPillar: { cheongan: '병', jiji: '인' },
    dayPillar: { cheongan: '갑', jiji: '오' },
    hourPillar: { cheongan: '임', jiji: '신' },
    ohaengDistribution: { '목': 3, '화': 2, '토': 0, '금': 1, '수': 2 },
    constitution: '소양인',
  }

  const person2: SajuResult = {
    yearPillar: { cheongan: '정', jiji: '해' },
    monthPillar: { cheongan: '기', jiji: '유' },
    dayPillar: { cheongan: '정', jiji: '묘' },
    hourPillar: { cheongan: '경', jiji: '술' },
    ohaengDistribution: { '목': 1, '화': 2, '토': 2, '금': 2, '수': 1 },
    constitution: '태음인',
  }

  it('궁합 점수를 0~100 사이로 반환', () => {
    const result = calculateGunghap(person1, person2)
    expect(result.score).toBeGreaterThanOrEqual(0)
    expect(result.score).toBeLessThanOrEqual(100)
  })

  it('모든 분석 필드가 존재', () => {
    const result = calculateGunghap(person1, person2)
    expect(result.ohaengRelation).toBeTruthy()
    expect(result.jijiRelation).toBeTruthy()
    expect(result.constitutionRelation).toBeTruthy()
  })
})
```

**Step 2: compatibility.ts 구현**

```typescript
// src/lib/gunghap/compatibility.ts
import type { SajuResult, Ohaeng, Constitution, GunghapResult } from '../saju/types'
import { CHEONGAN_OHAENG } from '../saju/types'
import { calcOhaengScore } from './score'

// 오행 상생 관계: A가 B를 생함
const SANGSAENG: Record<Ohaeng, Ohaeng> = {
  '목': '화', '화': '토', '토': '금', '금': '수', '수': '목',
}

// 오행 상극 관계: A가 B를 극함
const SANGGEUK: Record<Ohaeng, Ohaeng> = {
  '목': '토', '화': '금', '토': '수', '금': '목', '수': '화',
}

// 체질 궁합 점수
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

  // 오행 관계 분석
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

  // 지지 합/충 분석
  const jijiResult = calcOhaengScore(p1, p2)

  // 체질 궁합
  const constKey = `${p1.constitution}-${p2.constitution}`
  const constScore = CONSTITUTION_SCORE[constKey] ?? 60
  const constitutionRelation = getConstitutionRelation(p1.constitution, p2.constitution)

  // 종합 점수 (가중 평균)
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
```

**Step 3: score.ts 구현**

```typescript
// src/lib/gunghap/score.ts
import type { SajuResult, Jiji } from '../saju/types'

// 육합 (지지 합)
const YUKHAP: [Jiji, Jiji][] = [
  ['자', '축'], ['인', '해'], ['묘', '술'], ['진', '유'], ['사', '신'], ['오', '미'],
]

// 충 (지지 충돌)
const CHUNG: [Jiji, Jiji][] = [
  ['자', '오'], ['축', '미'], ['인', '신'], ['묘', '유'], ['진', '술'], ['사', '해'],
]

function hasRelation(pairs: [Jiji, Jiji][], a: Jiji, b: Jiji): boolean {
  return pairs.some(([x, y]) => (x === a && y === b) || (x === b && y === a))
}

export function calcOhaengScore(p1: SajuResult, p2: SajuResult): { score: number; description: string } {
  let score = 60
  const descriptions: string[] = []

  // 일지 기준 합/충 확인
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

  // 연지 기준 추가 확인
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
```

**Step 4: 테스트 실행 → 통과 확인**

```bash
npx vitest run src/lib/gunghap/__tests__/compatibility.test.ts
```

**Step 5: gunghap.json 작성** (궁합 해석 텍스트)

궁합 결과 카드에 사용할 상세 해석 텍스트. 오행 관계 유형별, 점수 구간별 해석.

**Step 6: 커밋**

```bash
git add src/lib/gunghap/ src/data/gunghap.json
git commit -m "feat: implement gunghap compatibility engine"
```

---

## Task 8: 앱 셸 & 다크 테마 UI

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`
- Create: `src/components/TabNavigation.tsx`

**Step 1: globals.css - 다크 테마 스타일**

```css
/* src/app/globals.css */
@import 'tailwindcss';

:root {
  --bg-primary: #0a0a1a;
  --bg-secondary: #12122a;
  --bg-card: rgba(25, 25, 60, 0.7);
  --accent-gold: #d4a843;
  --accent-purple: #8b5cf6;
  --text-primary: #e8e8f0;
  --text-secondary: #a0a0c0;
  --border-glow: rgba(139, 92, 246, 0.3);
}

body {
  background: linear-gradient(135deg, var(--bg-primary) 0%, #0d0d2b 50%, var(--bg-primary) 100%);
  color: var(--text-primary);
  min-height: 100vh;
  font-family: 'Pretendard', sans-serif;
}

.card {
  background: var(--bg-card);
  border: 1px solid var(--border-glow);
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 0 15px rgba(139, 92, 246, 0.1);
}

.accent-gold { color: var(--accent-gold); }
.accent-purple { color: var(--accent-purple); }
```

**Step 2: layout.tsx - 루트 레이아웃**

```tsx
// src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '사주팔자 - 나의 운명 풀이',
  description: '생년월일로 보는 사주팔자 해석과 궁합 분석',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="dark">
      <head>
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <div className="min-h-screen max-w-2xl mx-auto px-4 py-8">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold accent-gold tracking-wider">
              ✦ 사주팔자 ✦
            </h1>
            <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
              당신의 운명을 풀어드립니다
            </p>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}
```

**Step 3: TabNavigation.tsx**

```tsx
// src/components/TabNavigation.tsx
'use client'

interface TabNavigationProps {
  activeTab: 'saju' | 'gunghap'
  onTabChange: (tab: 'saju' | 'gunghap') => void
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex gap-2 mb-8">
      <button
        onClick={() => onTabChange('saju')}
        className={`flex-1 py-3 rounded-lg font-medium transition-all ${
          activeTab === 'saju'
            ? 'bg-purple-600/30 border border-purple-500/50 text-white'
            : 'bg-transparent border border-white/10 text-gray-400 hover:border-white/30'
        }`}
      >
        내 사주
      </button>
      <button
        onClick={() => onTabChange('gunghap')}
        className={`flex-1 py-3 rounded-lg font-medium transition-all ${
          activeTab === 'gunghap'
            ? 'bg-purple-600/30 border border-purple-500/50 text-white'
            : 'bg-transparent border border-white/10 text-gray-400 hover:border-white/30'
        }`}
      >
        궁합 보기
      </button>
    </div>
  )
}
```

**Step 4: 개발 서버로 시각 확인**

```bash
npm run dev
```
브라우저에서 http://localhost:3000 접속, 다크 테마와 탭이 보이는지 확인.

**Step 5: 커밋**

```bash
git add src/app/layout.tsx src/app/globals.css src/components/TabNavigation.tsx
git commit -m "feat: add dark theme app shell with tab navigation"
```

---

## Task 9: 사주 탭 UI 컴포넌트

**Files:**
- Create: `src/components/saju/SajuForm.tsx`
- Create: `src/components/saju/PillarTable.tsx`
- Create: `src/components/saju/OhaengBar.tsx`
- Create: `src/components/saju/ResultCard.tsx`
- Create: `src/components/saju/SajuResult.tsx`

**Step 1: SajuForm.tsx - 입력 폼**

생년월일(date picker), 양력/음력 토글, 시간 선택(12시진 드롭다운), 성별 선택 포함.
[사주 보기] 버튼 클릭 시 `onSubmit` 콜백 호출.

**Step 2: PillarTable.tsx - 사주팔자표**

4개 기둥을 표 형태로 표시. 각 셀에 천간/지지/오행을 색상 코딩. 오행별 색상: 목=초록, 화=빨강, 토=노랑, 금=흰색, 수=파랑.

**Step 3: OhaengBar.tsx - 오행 분포 시각화**

5개 오행의 분포를 프로그레스 바로 표시. 각 오행별 색상 적용.

**Step 4: ResultCard.tsx - 해석 카드**

제목, 아이콘, 본문 텍스트를 받아 카드로 렌더링. `card` CSS 클래스 활용.

**Step 5: SajuResult.tsx - 결과 통합**

PillarTable + OhaengBar + 사상체질 배지 + 7개 ResultCard를 순서대로 렌더링.

**Step 6: 개발 서버에서 폼 입력 → 결과 표시 확인**

```bash
npm run dev
```

**Step 7: 커밋**

```bash
git add src/components/saju/
git commit -m "feat: add saju tab UI components"
```

---

## Task 10: 궁합 탭 UI 컴포넌트

**Files:**
- Create: `src/components/gunghap/GunghapForm.tsx`
- Create: `src/components/gunghap/ScoreDisplay.tsx`
- Create: `src/components/gunghap/GunghapResult.tsx`

**Step 1: GunghapForm.tsx - 두 사람 입력 폼**

SajuForm을 두 번 렌더링 (나 / 상대방). [궁합 보기] 버튼.

**Step 2: ScoreDisplay.tsx - 궁합 점수 표시**

점수(0~100)를 별 5개 + 숫자로 표시. 점수 구간별 색상 변화.

**Step 3: GunghapResult.tsx - 궁합 결과 통합**

두 사람의 간단한 사주 요약 + ScoreDisplay + 4개 해석 카드 (오행 상성, 성격 궁합, 연애 스타일, 조언).

**Step 4: 개발 서버에서 궁합 탭 동작 확인**

```bash
npm run dev
```

**Step 5: 커밋**

```bash
git add src/components/gunghap/
git commit -m "feat: add gunghap tab UI components"
```

---

## Task 11: 메인 페이지 통합 & 최종 빌드

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: page.tsx - 모든 컴포넌트 통합**

```tsx
// src/app/page.tsx
'use client'

import { useState } from 'react'
import TabNavigation from '@/components/TabNavigation'
import SajuForm from '@/components/saju/SajuForm'
import SajuResult from '@/components/saju/SajuResult'
import GunghapForm from '@/components/gunghap/GunghapForm'
import GunghapResult from '@/components/gunghap/GunghapResult'
import { calculatePillars } from '@/lib/saju/pillars'
import { analyzeOhaeng } from '@/lib/saju/ohaeng'
import { determineConstitution } from '@/lib/saju/constitution'
import { generateInterpretation } from '@/lib/interpretation'
import { calculateGunghap } from '@/lib/gunghap/compatibility'
import type { SajuResult as SajuResultType } from '@/lib/saju/types'
import type { DateInput } from '@/lib/saju/calendar'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'saju' | 'gunghap'>('saju')
  const [sajuResult, setSajuResult] = useState<SajuResultType | null>(null)
  const [interpretation, setInterpretation] = useState(null)
  const [gunghapResult, setGunghapResult] = useState(null)

  function handleSajuSubmit(input: DateInput) {
    const pillars = calculatePillars(input)
    const ohaeng = analyzeOhaeng(pillars)
    const constitution = determineConstitution(ohaeng)
    const result: SajuResultType = { ...pillars, ohaengDistribution: ohaeng, constitution }
    setSajuResult(result)
    setInterpretation(generateInterpretation(result))
  }

  function handleGunghapSubmit(input1: DateInput, input2: DateInput) {
    // 두 사람의 사주 계산 후 궁합 산출
    const p1 = buildSajuResult(input1)
    const p2 = buildSajuResult(input2)
    const gunghap = calculateGunghap(p1, p2)
    setGunghapResult({ person1: p1, person2: p2, ...gunghap })
  }

  return (
    <main>
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'saju' ? (
        <>
          <SajuForm onSubmit={handleSajuSubmit} />
          {sajuResult && interpretation && (
            <SajuResult saju={sajuResult} interpretation={interpretation} />
          )}
        </>
      ) : (
        <>
          <GunghapForm onSubmit={handleGunghapSubmit} />
          {gunghapResult && <GunghapResult result={gunghapResult} />}
        </>
      )}
    </main>
  )
}
```

**Step 2: 전체 테스트 실행**

```bash
npm test
```
Expected: 모든 테스트 PASS

**Step 3: 정적 빌드 확인**

```bash
npm run build
```
Expected: `out/` 폴더에 정적 파일 생성

**Step 4: 최종 커밋**

```bash
git add -A
git commit -m "feat: integrate all components into main page"
```

---

## 작업 요약

| Task | 내용 | 핵심 파일 |
|------|------|----------|
| 1 | 프로젝트 초기 설정 | package.json, next.config.ts, vitest.config.ts |
| 2 | 타입 & 상수 | src/lib/saju/types.ts |
| 3 | 사주 기둥 계산 | src/lib/saju/pillars.ts, calendar.ts |
| 4 | 오행 & 체질 | src/lib/saju/ohaeng.ts, constitution.ts |
| 5 | 해석 데이터 JSON | src/data/*.json (10개 파일) |
| 6 | 해석 조합 로직 | src/lib/interpretation.ts |
| 7 | 궁합 엔진 | src/lib/gunghap/compatibility.ts, score.ts |
| 8 | 앱 셸 & 테마 | layout.tsx, globals.css, TabNavigation.tsx |
| 9 | 사주 탭 UI | src/components/saju/*.tsx (5개) |
| 10 | 궁합 탭 UI | src/components/gunghap/*.tsx (3개) |
| 11 | 통합 & 빌드 | src/app/page.tsx |

# 타로 카드 운세 탭 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 메이저 아르카나 22장 기반 3카드 스프레드 타로 운세 탭을 기존 사주 웹앱에 추가

**Architecture:** 기존 탭 구조에 'tarot' 탭 추가. 상태 머신으로 애니메이션 단계(펼침→선택→셔플→배치→뒤집기→결과) 관리. CSS 3D transform으로 카드 뒤집기, keyframes로 셔플/펼침 애니메이션 구현. 해석 데이터는 JSON 파일.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS 4, CSS 3D Transforms, Vitest

---

## Task 1: 타로 타입 정의

**Files:**
- Create: `src/lib/tarot/types.ts`
- Test: `src/lib/tarot/__tests__/types.test.ts`

**Step 1: 테스트 작성**

```typescript
// src/lib/tarot/__tests__/types.test.ts
import { describe, it, expect } from 'vitest'
import { MAJOR_ARCANA_COUNT, type TarotCard, type TarotReading } from '../types'

describe('타로 타입', () => {
  it('메이저 아르카나는 22장', () => {
    expect(MAJOR_ARCANA_COUNT).toBe(22)
  })
})
```

**Step 2: 테스트 실행 → 실패 확인**

```bash
cd /Users/suyul/Desktop/supertest && npx vitest run src/lib/tarot/__tests__/types.test.ts
```
Expected: FAIL

**Step 3: types.ts 구현**

```typescript
// src/lib/tarot/types.ts
export const MAJOR_ARCANA_COUNT = 22

export type TarotPosition = 'past' | 'present' | 'future'

export interface TarotCardData {
  number: number
  name: string
  symbol: string
  upright: {
    keyword: string
    past: string
    present: string
    future: string
  }
  reversed: {
    keyword: string
    past: string
    present: string
    future: string
  }
}

export interface DrawnCard {
  card: TarotCardData
  position: TarotPosition
  isReversed: boolean
}

export interface TarotReading {
  cards: [DrawnCard, DrawnCard, DrawnCard]
}

export type TarotPhase = 'spread' | 'selecting' | 'shuffling' | 'placing' | 'revealing' | 'result'
```

**Step 4: 테스트 실행 → 통과 확인**

```bash
cd /Users/suyul/Desktop/supertest && npx vitest run src/lib/tarot/__tests__/types.test.ts
```
Expected: PASS

**Step 5: 커밋**

```bash
git add src/lib/tarot/types.ts src/lib/tarot/__tests__/types.test.ts
git commit -m "feat: add tarot type definitions"
```

---

## Task 2: 타로 카드 해석 데이터 JSON

**Files:**
- Create: `src/data/tarot.json`
- Test: `src/data/__tests__/tarot-data.test.ts`

**Step 1: 테스트 작성**

```typescript
// src/data/__tests__/tarot-data.test.ts
import { describe, it, expect } from 'vitest'
import tarotData from '../tarot.json'
import { MAJOR_ARCANA_COUNT } from '@/lib/tarot/types'

describe('타로 카드 데이터 무결성', () => {
  it('22장의 카드가 존재', () => {
    expect(tarotData).toHaveLength(MAJOR_ARCANA_COUNT)
  })

  it('각 카드에 필수 필드가 존재', () => {
    for (const card of tarotData) {
      expect(card).toHaveProperty('number')
      expect(card).toHaveProperty('name')
      expect(card).toHaveProperty('symbol')
      expect(card).toHaveProperty('upright')
      expect(card).toHaveProperty('reversed')
    }
  })

  it('각 카드에 3개 위치별 해석이 존재', () => {
    for (const card of tarotData) {
      for (const dir of ['upright', 'reversed'] as const) {
        expect(card[dir]).toHaveProperty('keyword')
        expect(card[dir]).toHaveProperty('past')
        expect(card[dir]).toHaveProperty('present')
        expect(card[dir]).toHaveProperty('future')
        expect(card[dir].past.length).toBeGreaterThan(20)
        expect(card[dir].present.length).toBeGreaterThan(20)
        expect(card[dir].future.length).toBeGreaterThan(20)
      }
    }
  })

  it('카드 번호가 0~21까지 순서대로', () => {
    tarotData.forEach((card, idx) => {
      expect(card.number).toBe(idx)
    })
  })
})
```

**Step 2: 테스트 실행 → 실패 확인**

```bash
cd /Users/suyul/Desktop/supertest && npx vitest run src/data/__tests__/tarot-data.test.ts
```
Expected: FAIL

**Step 3: tarot.json 작성**

22장 메이저 아르카나 데이터. 각 카드에 정방향/역방향 × 과거/현재/미래 해석 텍스트 포함. 한국어로 작성. 각 해석은 2~3문장.

카드 목록:
- 0: 바보 (The Fool) 🃏
- 1: 마법사 (The Magician) 🪄
- 2: 여사제 (The High Priestess) 🌙
- 3: 여황제 (The Empress) 👑
- 4: 황제 (The Emperor) 🏛️
- 5: 교황 (The Hierophant) 📿
- 6: 연인 (The Lovers) 💑
- 7: 전차 (The Chariot) 🏇
- 8: 힘 (Strength) 🦁
- 9: 은둔자 (The Hermit) 🏮
- 10: 운명의 수레바퀴 (Wheel of Fortune) 🎡
- 11: 정의 (Justice) ⚖️
- 12: 매달린 사람 (The Hanged Man) 🙃
- 13: 죽음 (Death) 💀
- 14: 절제 (Temperance) 🏺
- 15: 악마 (The Devil) 😈
- 16: 탑 (The Tower) 🗼
- 17: 별 (The Star) ⭐
- 18: 달 (The Moon) 🌕
- 19: 태양 (The Sun) ☀️
- 20: 심판 (Judgement) 📯
- 21: 세계 (The World) 🌍

```json
[
  {
    "number": 0,
    "name": "바보",
    "symbol": "🃏",
    "upright": {
      "keyword": "새로운 시작",
      "past": "과거에 당신은 두려움 없이 새로운 도전을 시작했습니다. 그 용기 있는 첫걸음이 지금의 당신을 만들었습니다.",
      "present": "지금은 새로운 모험을 시작할 때입니다. 두려움을 내려놓고 미지의 세계로 발을 내딛으세요. 순수한 마음이 길을 열어줄 것입니다.",
      "future": "머지않아 예상치 못한 새로운 기회가 찾아올 것입니다. 열린 마음으로 받아들이면 놀라운 여정이 펼쳐질 것입니다."
    },
    "reversed": {
      "keyword": "무모함",
      "past": "과거에 충분한 준비 없이 성급하게 뛰어든 경험이 있습니다. 그 경험에서 신중함의 가치를 배웠을 것입니다.",
      "present": "지금 무언가를 시작하고 싶지만, 조금 더 계획을 세울 필요가 있습니다. 충동적인 결정은 잠시 미루세요.",
      "future": "앞으로 성급한 판단을 주의해야 합니다. 새로운 것에 대한 열망은 좋지만, 기본적인 준비는 갖추고 나아가세요."
    }
  },
  ... (나머지 21장도 동일 구조로 작성)
]
```

> 참고: 이 작업은 텍스트 콘텐츠 작성이 핵심. 22장 × 정역 2 × 위치 3 = 132개 해석 텍스트를 한국어로 작성. 각 해석은 타로의 전통적 의미를 반영하되 현대적이고 따뜻한 문체.

**Step 4: 테스트 실행 → 통과 확인**

```bash
cd /Users/suyul/Desktop/supertest && npx vitest run src/data/__tests__/tarot-data.test.ts
```
Expected: PASS

**Step 5: 커밋**

```bash
git add src/data/tarot.json src/data/__tests__/tarot-data.test.ts
git commit -m "feat: add major arcana tarot card data with interpretations"
```

---

## Task 3: 타로 리딩 로직

**Files:**
- Create: `src/lib/tarot/reading.ts`
- Test: `src/lib/tarot/__tests__/reading.test.ts`

**Step 1: 테스트 작성**

```typescript
// src/lib/tarot/__tests__/reading.test.ts
import { describe, it, expect } from 'vitest'
import { drawThreeCards, getInterpretation } from '../reading'

describe('타로 리딩', () => {
  it('3장의 카드를 뽑음', () => {
    const result = drawThreeCards([0, 5, 10])
    expect(result.cards).toHaveLength(3)
  })

  it('과거/현재/미래 위치가 순서대로 배정', () => {
    const result = drawThreeCards([0, 5, 10])
    expect(result.cards[0].position).toBe('past')
    expect(result.cards[1].position).toBe('present')
    expect(result.cards[2].position).toBe('future')
  })

  it('각 카드에 정/역방향이 결정됨', () => {
    const result = drawThreeCards([0, 5, 10])
    for (const drawn of result.cards) {
      expect(typeof drawn.isReversed).toBe('boolean')
    }
  })

  it('3장이 모두 다른 카드', () => {
    const result = drawThreeCards([0, 5, 10])
    const numbers = result.cards.map(c => c.card.number)
    expect(new Set(numbers).size).toBe(3)
  })

  it('해석 텍스트를 올바르게 반환', () => {
    const result = drawThreeCards([0, 5, 10])
    for (const drawn of result.cards) {
      const text = getInterpretation(drawn)
      expect(text.length).toBeGreaterThan(20)
    }
  })
})
```

**Step 2: 테스트 실행 → 실패 확인**

```bash
cd /Users/suyul/Desktop/supertest && npx vitest run src/lib/tarot/__tests__/reading.test.ts
```
Expected: FAIL

**Step 3: reading.ts 구현**

```typescript
// src/lib/tarot/reading.ts
import tarotData from '@/data/tarot.json'
import type { TarotCardData, DrawnCard, TarotReading, TarotPosition } from './types'

const cards = tarotData as TarotCardData[]
const POSITIONS: TarotPosition[] = ['past', 'present', 'future']

export function drawThreeCards(selectedIndices: number[]): TarotReading {
  const drawn = selectedIndices.slice(0, 3).map((cardIndex, i) => ({
    card: cards[cardIndex],
    position: POSITIONS[i],
    isReversed: Math.random() < 0.3,
  })) as [DrawnCard, DrawnCard, DrawnCard]

  return { cards: drawn }
}

export function getInterpretation(drawn: DrawnCard): string {
  const direction = drawn.isReversed ? drawn.card.reversed : drawn.card.upright
  return direction[drawn.position]
}

export function getKeyword(drawn: DrawnCard): string {
  const direction = drawn.isReversed ? drawn.card.reversed : drawn.card.upright
  return direction.keyword
}

export function getAllCards(): TarotCardData[] {
  return cards
}
```

**Step 4: 테스트 실행 → 통과 확인**

```bash
cd /Users/suyul/Desktop/supertest && npx vitest run src/lib/tarot/__tests__/reading.test.ts
```
Expected: PASS

**Step 5: 커밋**

```bash
git add src/lib/tarot/reading.ts src/lib/tarot/__tests__/reading.test.ts
git commit -m "feat: add tarot reading logic"
```

---

## Task 4: 타로 카드 CSS 애니메이션

**Files:**
- Modify: `src/app/globals.css`

**Step 1: globals.css에 타로 관련 CSS 추가**

기존 globals.css 끝에 추가:

```css
/* 타로 카드 기본 */
.tarot-card {
  width: 100px;
  height: 150px;
  perspective: 1000px;
  cursor: pointer;
}

.tarot-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.tarot-card-inner.flipped {
  transform: rotateY(180deg);
}

.tarot-card-front,
.tarot-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.tarot-card-front {
  transform: rotateY(180deg);
  background: linear-gradient(135deg, #1a1a3e, #2d1b69);
  border: 1px solid var(--accent-gold);
  padding: 8px;
}

.tarot-card-back {
  background: linear-gradient(135deg, #2d1b69 0%, #1a0a3e 100%);
  border: 2px solid var(--accent-gold);
  box-shadow: inset 0 0 20px rgba(212, 168, 67, 0.1);
}

.tarot-card-back::after {
  content: '✦';
  font-size: 2rem;
  color: var(--accent-gold);
  opacity: 0.6;
}

/* 카드 선택 시 효과 */
.tarot-card.selected {
  transform: translateY(-20px);
  filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.5));
}

.tarot-card:hover:not(.selected) {
  transform: translateY(-10px);
  transition: transform 0.2s;
}

/* 역방향 카드 */
.tarot-card-front.reversed {
  transform: rotateY(180deg) rotate(180deg);
}

/* 덱 펼침 애니메이션 */
@keyframes fanSpread {
  from { transform: rotate(0deg) translateY(0); opacity: 0; }
  to { opacity: 1; }
}

.tarot-fan-card {
  position: absolute;
  transform-origin: bottom center;
  animation: fanSpread 0.5s ease-out forwards;
}

/* 셔플 애니메이션 */
@keyframes shuffleLeft {
  0% { transform: translateX(0); }
  25% { transform: translateX(-30px) rotate(-5deg); }
  50% { transform: translateX(0); }
  75% { transform: translateX(30px) rotate(5deg); }
  100% { transform: translateX(0); }
}

.shuffle-animation {
  animation: shuffleLeft 0.4s ease-in-out 3;
}

/* 배치 애니메이션 */
@keyframes placeCard {
  from { transform: scale(0.5) translateY(-50px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
}

.place-animation {
  animation: placeCard 0.5s ease-out forwards;
}
```

**Step 2: 커밋**

```bash
git add src/app/globals.css
git commit -m "feat: add tarot card CSS animations"
```

---

## Task 5: TarotCard 컴포넌트

**Files:**
- Create: `src/components/tarot/TarotCard.tsx`

**Step 1: TarotCard.tsx 구현**

개별 타로 카드 컴포넌트. 앞면/뒷면 렌더링 + 3D flip 애니메이션.

```tsx
// src/components/tarot/TarotCard.tsx
'use client'

import type { TarotCardData } from '@/lib/tarot/types'

interface TarotCardProps {
  card?: TarotCardData
  isFlipped: boolean
  isReversed?: boolean
  isSelected?: boolean
  onClick?: () => void
  className?: string
  style?: React.CSSProperties
}

export default function TarotCard({
  card,
  isFlipped,
  isReversed = false,
  isSelected = false,
  onClick,
  className = '',
  style,
}: TarotCardProps) {
  return (
    <div
      className={`tarot-card ${isSelected ? 'selected' : ''} ${className}`}
      onClick={onClick}
      style={style}
    >
      <div className={`tarot-card-inner ${isFlipped ? 'flipped' : ''}`}>
        {/* 뒷면 */}
        <div className="tarot-card-back" />
        {/* 앞면 */}
        <div className={`tarot-card-front ${isReversed ? 'reversed' : ''}`}>
          {card && (
            <>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {card.number}
              </span>
              <span className="text-2xl my-1">{card.symbol}</span>
              <span className="text-xs font-medium text-center" style={{ color: 'var(--accent-gold)' }}>
                {card.name}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
```

**Step 2: 빌드 확인**

```bash
cd /Users/suyul/Desktop/supertest && npx tsc --noEmit
```
Expected: 0 errors

**Step 3: 커밋**

```bash
git add src/components/tarot/TarotCard.tsx
git commit -m "feat: add TarotCard component with flip animation"
```

---

## Task 6: TarotDeck 컴포넌트

**Files:**
- Create: `src/components/tarot/TarotDeck.tsx`

**Step 1: TarotDeck.tsx 구현**

22장 카드를 부채꼴로 펼치고, 클릭으로 3장까지 선택할 수 있는 컴포넌트.

```tsx
// src/components/tarot/TarotDeck.tsx
'use client'

import { useState } from 'react'
import TarotCard from './TarotCard'
import { getAllCards } from '@/lib/tarot/reading'

interface TarotDeckProps {
  onSelectionComplete: (selectedIndices: number[]) => void
}

export default function TarotDeck({ onSelectionComplete }: TarotDeckProps) {
  const cards = getAllCards()
  const [selected, setSelected] = useState<number[]>([])

  function handleCardClick(index: number) {
    if (selected.includes(index)) {
      setSelected(selected.filter(i => i !== index))
      return
    }
    if (selected.length >= 3) return

    const newSelected = [...selected, index]
    setSelected(newSelected)

    if (newSelected.length === 3) {
      setTimeout(() => onSelectionComplete(newSelected), 500)
    }
  }

  const totalCards = cards.length
  const angleRange = 80
  const startAngle = -angleRange / 2

  return (
    <div className="card">
      <h2 className="text-lg font-semibold accent-gold text-center mb-2">카드를 선택하세요</h2>
      <p className="text-sm text-center mb-6" style={{ color: 'var(--text-secondary)' }}>
        마음을 집중하고 3장의 카드를 골라주세요 ({selected.length}/3)
      </p>
      <div className="relative h-[220px] flex items-end justify-center">
        {cards.map((card, i) => {
          const angle = startAngle + (angleRange / (totalCards - 1)) * i
          const isSelected = selected.includes(i)
          return (
            <div
              key={card.number}
              className="tarot-fan-card"
              style={{
                transform: `rotate(${angle}deg) translateY(${isSelected ? -30 : 0}px)`,
                zIndex: isSelected ? 100 : i,
                animationDelay: `${i * 0.03}s`,
                left: '50%',
                marginLeft: '-50px',
                bottom: '0',
              }}
            >
              <TarotCard
                card={card}
                isFlipped={false}
                isSelected={isSelected}
                onClick={() => handleCardClick(i)}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

**Step 2: 빌드 확인**

```bash
cd /Users/suyul/Desktop/supertest && npx tsc --noEmit
```
Expected: 0 errors

**Step 3: 커밋**

```bash
git add src/components/tarot/TarotDeck.tsx
git commit -m "feat: add TarotDeck component with fan spread"
```

---

## Task 7: TarotResult 컴포넌트

**Files:**
- Create: `src/components/tarot/TarotResult.tsx`

**Step 1: TarotResult.tsx 구현**

3장 카드의 해석 결과를 표시하는 컴포넌트.

```tsx
// src/components/tarot/TarotResult.tsx
import type { DrawnCard } from '@/lib/tarot/types'
import { getInterpretation, getKeyword } from '@/lib/tarot/reading'

interface TarotResultProps {
  cards: DrawnCard[]
  onReset: () => void
}

const POSITION_LABELS = {
  past: { label: '과거', icon: '⏪' },
  present: { label: '현재', icon: '⏺️' },
  future: { label: '미래', icon: '⏩' },
}

export default function TarotResult({ cards, onReset }: TarotResultProps) {
  return (
    <div className="mt-6 space-y-4">
      {cards.map((drawn) => {
        const pos = POSITION_LABELS[drawn.position]
        return (
          <div key={drawn.position} className="card">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{pos.icon}</span>
              <span className="font-semibold accent-purple">{pos.label}</span>
              <span className="text-xl ml-auto">{drawn.card.symbol}</span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-bold accent-gold">{drawn.card.name}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{
                background: drawn.isReversed ? 'rgba(239, 68, 68, 0.2)' : 'rgba(139, 92, 246, 0.2)',
                color: drawn.isReversed ? '#f87171' : '#a78bfa',
              }}>
                {drawn.isReversed ? '역방향' : '정방향'}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {getKeyword(drawn)}
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {getInterpretation(drawn)}
            </p>
          </div>
        )
      })}

      <button
        onClick={onReset}
        className="w-full py-3 rounded-lg font-medium transition-all bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white"
      >
        다시 뽑기
      </button>
    </div>
  )
}
```

**Step 2: 빌드 확인**

```bash
cd /Users/suyul/Desktop/supertest && npx tsc --noEmit
```
Expected: 0 errors

**Step 3: 커밋**

```bash
git add src/components/tarot/TarotResult.tsx
git commit -m "feat: add TarotResult component"
```

---

## Task 8: TarotSpread 메인 컨테이너

**Files:**
- Create: `src/components/tarot/TarotSpread.tsx`

**Step 1: TarotSpread.tsx 구현**

전체 타로 리딩 흐름을 관리하는 상태 머신 컴포넌트. 단계: selecting → shuffling → placing → revealing → result.

```tsx
// src/components/tarot/TarotSpread.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import TarotDeck from './TarotDeck'
import TarotCard from './TarotCard'
import TarotResult from './TarotResult'
import { drawThreeCards } from '@/lib/tarot/reading'
import type { TarotPhase, TarotReading } from '@/lib/tarot/types'

export default function TarotSpread() {
  const [phase, setPhase] = useState<TarotPhase>('selecting')
  const [reading, setReading] = useState<TarotReading | null>(null)
  const [revealedCount, setRevealedCount] = useState(0)

  const handleSelectionComplete = useCallback((selectedIndices: number[]) => {
    const result = drawThreeCards(selectedIndices)
    setReading(result)
    setPhase('shuffling')
  }, [])

  useEffect(() => {
    if (phase === 'shuffling') {
      const timer = setTimeout(() => setPhase('placing'), 1200)
      return () => clearTimeout(timer)
    }
    if (phase === 'placing') {
      const timer = setTimeout(() => setPhase('revealing'), 500)
      return () => clearTimeout(timer)
    }
    if (phase === 'revealing' && reading) {
      if (revealedCount < 3) {
        const timer = setTimeout(() => setRevealedCount(c => c + 1), 700)
        return () => clearTimeout(timer)
      } else {
        const timer = setTimeout(() => setPhase('result'), 300)
        return () => clearTimeout(timer)
      }
    }
  }, [phase, revealedCount, reading])

  function handleReset() {
    setPhase('selecting')
    setReading(null)
    setRevealedCount(0)
  }

  if (phase === 'selecting') {
    return <TarotDeck onSelectionComplete={handleSelectionComplete} />
  }

  if (!reading) return null

  const positionLabels = ['과거', '현재', '미래']

  if (phase === 'shuffling') {
    return (
      <div className="card">
        <p className="text-center accent-gold mb-4">카드를 섞고 있습니다...</p>
        <div className="flex justify-center gap-2">
          {reading.cards.map((_, i) => (
            <div key={i} className="shuffle-animation" style={{ animationDelay: `${i * 0.1}s` }}>
              <TarotCard isFlipped={false} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (phase === 'placing' || phase === 'revealing') {
    return (
      <div className="card">
        <div className="flex justify-center gap-6">
          {reading.cards.map((drawn, i) => (
            <div key={i} className="text-center place-animation" style={{ animationDelay: `${i * 0.15}s` }}>
              <p className="text-xs mb-2 accent-purple">{positionLabels[i]}</p>
              <TarotCard
                card={drawn.card}
                isFlipped={phase === 'revealing' && i < revealedCount}
                isReversed={drawn.isReversed}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // phase === 'result'
  return (
    <div>
      <div className="card mb-4">
        <div className="flex justify-center gap-6">
          {reading.cards.map((drawn, i) => (
            <div key={i} className="text-center">
              <p className="text-xs mb-2 accent-purple">{positionLabels[i]}</p>
              <TarotCard
                card={drawn.card}
                isFlipped={true}
                isReversed={drawn.isReversed}
              />
            </div>
          ))}
        </div>
      </div>
      <TarotResult cards={[...reading.cards]} onReset={handleReset} />
    </div>
  )
}
```

**Step 2: 빌드 확인**

```bash
cd /Users/suyul/Desktop/supertest && npx tsc --noEmit
```
Expected: 0 errors

**Step 3: 커밋**

```bash
git add src/components/tarot/TarotSpread.tsx
git commit -m "feat: add TarotSpread state machine component"
```

---

## Task 9: 탭 네비게이션 + 메인 페이지 통합

**Files:**
- Modify: `src/components/TabNavigation.tsx`
- Modify: `src/app/page.tsx`

**Step 1: TabNavigation.tsx에 타로 탭 추가**

탭 타입을 `'saju' | 'gunghap' | 'tarot'`으로 확장하고 3번째 버튼 추가.

```tsx
// src/components/TabNavigation.tsx
'use client'

interface TabNavigationProps {
  activeTab: 'saju' | 'gunghap' | 'tarot'
  onTabChange: (tab: 'saju' | 'gunghap' | 'tarot') => void
}

const TABS = [
  { key: 'saju' as const, label: '내 사주' },
  { key: 'gunghap' as const, label: '궁합 보기' },
  { key: 'tarot' as const, label: '타로 운세' },
]

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex gap-2 mb-8">
      {TABS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onTabChange(key)}
          className={`flex-1 py-3 rounded-lg font-medium transition-all ${
            activeTab === key
              ? 'bg-purple-600/30 border border-purple-500/50 text-white'
              : 'bg-transparent border border-white/10 text-gray-400 hover:border-white/30'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
```

**Step 2: page.tsx에 타로 탭 연결**

기존 page.tsx를 수정하여 `'tarot'` 탭 상태와 TarotSpread 컴포넌트를 추가.

- import 추가: `import TarotSpread from '@/components/tarot/TarotSpread'`
- activeTab 타입: `'saju' | 'gunghap' | 'tarot'`
- 렌더링 분기에 타로 탭 추가

**Step 3: 빌드 확인**

```bash
cd /Users/suyul/Desktop/supertest && npx tsc --noEmit
```
Expected: 0 errors

**Step 4: 커밋**

```bash
git add src/components/TabNavigation.tsx src/app/page.tsx
git commit -m "feat: integrate tarot tab into main page"
```

---

## Task 10: 전체 테스트 & 최종 빌드

**Step 1: 전체 테스트 실행**

```bash
cd /Users/suyul/Desktop/supertest && npx vitest run
```
Expected: 모든 테스트 PASS

**Step 2: 정적 빌드 확인**

```bash
cd /Users/suyul/Desktop/supertest && npm run build
```
Expected: 빌드 성공

**Step 3: 최종 커밋 & 푸시**

```bash
git add -A
git commit -m "feat: complete tarot card reading feature"
git push
```

---

## 작업 요약

| Task | 내용 | 핵심 파일 |
|------|------|----------|
| 1 | 타로 타입 정의 | src/lib/tarot/types.ts |
| 2 | 카드 데이터 JSON (22장 × 132 해석) | src/data/tarot.json |
| 3 | 리딩 로직 | src/lib/tarot/reading.ts |
| 4 | CSS 애니메이션 | src/app/globals.css |
| 5 | TarotCard 컴포넌트 | src/components/tarot/TarotCard.tsx |
| 6 | TarotDeck 컴포넌트 (부채꼴 펼침) | src/components/tarot/TarotDeck.tsx |
| 7 | TarotResult 컴포넌트 (해석 표시) | src/components/tarot/TarotResult.tsx |
| 8 | TarotSpread 상태 머신 | src/components/tarot/TarotSpread.tsx |
| 9 | 탭 통합 | TabNavigation.tsx, page.tsx |
| 10 | 테스트 & 빌드 | 전체 검증 |

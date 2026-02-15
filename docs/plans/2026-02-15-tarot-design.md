# 타로 카드 운세 탭 디자인 문서

**작성일**: 2026-02-15
**상태**: 승인됨

---

## 1. 개요

기존 사주팔자 웹앱에 3번째 탭으로 타로 카드 운세 기능을 추가. 메이저 아르카나 22장에서 3장을 뽑아 과거/현재/미래를 해석. 카드 펼침, 선택, 셔플, 뒤집기 전 과정에 애니메이션 적용.

### 핵심 결정 사항
- **카드 덱**: 메이저 아르카나 22장
- **스프레드**: 3카드 스프레드 (과거/현재/미래)
- **정역방향**: 뽑을 때 랜덤으로 정방향/역방향 결정
- **카드 비주얼**: CSS + 이모지 (이미지 파일 없이)
- **애니메이션**: 풀 연출 (펼침 → 선택 → 셔플 → 배치 → 뒤집기)

---

## 2. 사용자 흐름

```
[타로 탭 선택]
→ [카드 덱이 부채꼴로 펼쳐짐]
→ [사용자가 3장 클릭 선택]
→ [선택된 카드가 중앙으로 모여 셔플 모션]
→ [과거/현재/미래 위치에 뒷면으로 배치]
→ [순서대로 3D flip으로 앞면 공개 (0.5초 간격)]
→ [각 카드 아래에 해석 텍스트 표시]
→ [다시 뽑기 버튼]
```

---

## 3. 카드 데이터

### 메이저 아르카나 22장

| 번호 | 이름 | 심볼 |
|------|------|------|
| 0 | 바보 (The Fool) | 🃏 |
| 1 | 마법사 (The Magician) | 🪄 |
| 2 | 여사제 (The High Priestess) | 🌙 |
| 3 | 여황제 (The Empress) | 👑 |
| 4 | 황제 (The Emperor) | 🏛️ |
| 5 | 교황 (The Hierophant) | 📿 |
| 6 | 연인 (The Lovers) | 💑 |
| 7 | 전차 (The Chariot) | 🏇 |
| 8 | 힘 (Strength) | 🦁 |
| 9 | 은둔자 (The Hermit) | 🏮 |
| 10 | 운명의 수레바퀴 (Wheel of Fortune) | 🎡 |
| 11 | 정의 (Justice) | ⚖️ |
| 12 | 매달린 사람 (The Hanged Man) | 🙃 |
| 13 | 죽음 (Death) | 💀 |
| 14 | 절제 (Temperance) | 🏺 |
| 15 | 악마 (The Devil) | 😈 |
| 16 | 탑 (The Tower) | 🗼 |
| 17 | 별 (The Star) | ⭐ |
| 18 | 달 (The Moon) | 🌕 |
| 19 | 태양 (The Sun) | ☀️ |
| 20 | 심판 (Judgement) | 📯 |
| 21 | 세계 (The World) | 🌍 |

### 데이터 구조

```typescript
interface TarotCard {
  number: number
  name: string
  symbol: string
  upright: {
    keyword: string
    past: string      // 과거 위치 해석
    present: string   // 현재 위치 해석
    future: string    // 미래 위치 해석
  }
  reversed: {
    keyword: string
    past: string
    present: string
    future: string
  }
}

interface TarotReading {
  cards: {
    card: TarotCard
    position: 'past' | 'present' | 'future'
    isReversed: boolean
  }[]
}
```

---

## 4. 애니메이션 상세

### 단계 1: 덱 펼침
- 22장이 화면 하단에서 부채꼴(arc)로 펼쳐짐
- 각 카드는 중앙 기준 회전 (약 -50도 ~ +50도 범위)
- CSS `transform: rotate()` + `translateY()` 사용
- duration: 0.8초

### 단계 2: 카드 선택
- 카드 hover 시 위로 살짝 올라옴 (`translateY(-20px)`)
- 클릭 시 선택 표시 (보라색 glow 테두리)
- 3장 선택 완료 시 자동으로 다음 단계 진행
- 선택된 순서가 과거→현재→미래 순서

### 단계 3: 셔플 모션
- 선택된 3장이 화면 중앙으로 모임
- 겹쳐졌다 퍼지는 셔플 애니메이션 (2~3회)
- duration: 1.2초

### 단계 4: 배치
- 3장이 좌(과거)/중(현재)/우(미래) 위치로 이동
- 뒷면 상태로 배치
- duration: 0.5초

### 단계 5: 뒤집기
- 왼쪽부터 순서대로 3D perspective flip
- `transform: rotateY(180deg)` 사용
- 각 카드 0.5초 간격으로 뒤집힘
- 뒤집히면서 앞면 카드 정보 표시
- 역방향 카드는 180도 회전 상태로 표시

### CSS 기술 스택
- CSS `perspective`, `transform-style: preserve-3d`
- `@keyframes` 또는 CSS transition
- 외부 애니메이션 라이브러리 없이 순수 CSS + React state

---

## 5. UI 디자인

### 카드 뒷면
- 짙은 보라색 배경 + 금색 테두리
- 중앙에 별 문양 패턴 (CSS gradient로 구현)
- 크기: 약 100px x 150px

### 카드 앞면
- 어두운 배경에 카드 번호, 심볼 이모지, 한글 이름
- 정방향/역방향 표시
- 키워드 표시
- 역방향일 때 카드가 거꾸로 표시

### 해석 결과
- 각 카드 아래에 위치(과거/현재/미래) 라벨
- 해석 텍스트는 기존 `.card` 스타일 활용
- "다시 뽑기" 버튼으로 초기화

---

## 6. 프로젝트 구조 추가

```
src/
├── components/tarot/
│   ├── TarotSpread.tsx      # 메인 타로 컨테이너 (상태 관리)
│   ├── TarotDeck.tsx        # 카드 덱 펼침 + 선택 UI
│   ├── TarotCard.tsx        # 개별 카드 (앞/뒷면 + 뒤집기)
│   └── TarotResult.tsx      # 해석 결과 표시
├── lib/tarot/
│   ├── types.ts             # 타로 타입 정의
│   └── reading.ts           # 카드 뽑기 + 해석 조합 로직
└── data/
    └── tarot.json           # 22장 카드 데이터 + 해석 텍스트
```

### 기존 파일 수정
- `src/components/TabNavigation.tsx`: 'tarot' 탭 추가
- `src/app/page.tsx`: 타로 탭 상태 + 컴포넌트 연결
- `src/app/globals.css`: 카드 뒤집기 관련 CSS 추가

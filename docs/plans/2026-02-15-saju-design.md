# 사주팔자 웹앱 디자인 문서

**작성일**: 2026-02-15
**상태**: 승인됨

---

## 1. 개요

생년월일과 태어난 시간을 입력받아 사주팔자를 분석하고, 사상체질 판별 및 상세 운세 해석을 제공하는 웹앱. 두 사람의 궁합 분석 기능도 포함.

### 핵심 결정 사항
- **해석 방식**: 사전 정의된 텍스트 (API 비용 없음)
- **기술 스택**: Next.js 15 + TypeScript + Tailwind CSS 4
- **체질 판별**: 오행 분포 기반 사상체질 매핑
- **디자인**: 다크 테마, 신비로운 느낌 (짙은 남색/검정 + 금색/보라색 액센트)
- **배포**: 정적 사이트 (Static Export)

---

## 2. 페이지 레이아웃

단일 메인 페이지에 탭 2개로 구성:

- **탭 1 - 내 사주**: 생년월일/시간/성별 입력 → 사주팔자표 + 섹션별 해석 카드
- **탭 2 - 궁합 보기**: 두 사람의 정보 입력 → 궁합 점수 + 상성 분석 카드

### 디자인 톤
- 배경: 짙은 남색/검정 그라데이션
- 액센트: 금색, 보라색 포인트
- 카드: 반투명 어두운 배경 + 미세한 테두리 발광 효과
- 폰트: 제목은 서예 느낌 웹폰트, 본문은 Pretendard 등 깔끔한 한글 폰트

---

## 3. 사주 계산 로직

### 계산 흐름
```
사용자 입력 (생년월일 + 시간)
→ 음양력 변환 (korean-lunar-calendar)
→ 연주/월주/일주/시주 계산 (천간 + 지지)
→ 오행 분포 분석 (목/화/토/금/수)
→ 사상체질 매핑
→ 해석 텍스트 조합
```

### 데이터 타입
```typescript
type Cheongan = '갑' | '을' | '병' | '정' | '무' | '기' | '경' | '신' | '임' | '계';
type Jiji = '자' | '축' | '인' | '묘' | '진' | '사' | '오' | '미' | '신' | '유' | '술' | '해';
type Ohaeng = '목' | '화' | '토' | '금' | '수';

interface SajuResult {
  yearPillar: { cheongan: Cheongan; jiji: Jiji };
  monthPillar: { cheongan: Cheongan; jiji: Jiji };
  dayPillar: { cheongan: Cheongan; jiji: Jiji };
  hourPillar: { cheongan: Cheongan; jiji: Jiji };
  ohaengDistribution: Record<Ohaeng, number>;
  constitution: '태양인' | '태음인' | '소양인' | '소음인';
}
```

### 오행 → 사상체질 매핑
| 지배적 오행 | 체질 | 근거 |
|------------|------|------|
| 화(火) 강 | 태양인 | 양 중의 양, 열성 |
| 목(木) 강 | 소양인 | 양 중의 음, 상승 기운 |
| 금(金) 강 | 태음인 | 음 중의 음, 수렴 기운 |
| 수(水) 강 | 소음인 | 음 중의 양, 한성 |
| 토(土) 강 또는 균형 | 다음으로 많은 오행으로 판별 |

---

## 4. 해석 결과 화면

### 사주 해석 (탭 1)
상단에 사주팔자표와 오행 분포 시각화 바, 사상체질 배지를 표시하고, 아래에 섹션별 카드가 모두 펼쳐진 상태로 스크롤:

1. **기본 성격 카드** - 일간 기반 성격 해석 (2~3문단)
2. **사상체질 카드** - 체질 특성과 건강 관리법 (2~3문단)
3. **직업운 카드** - 적성과 직업 방향
4. **재물운 카드** - 금전운과 재테크 성향
5. **연애운 카드** - 연애 스타일과 이상형
6. **건강운 카드** - 주의할 건강 사항
7. **종합 조언 카드** - 총괄 조언

각 카드에 관련 오행 아이콘과 색상 액센트 적용. 전체 A4 한 장 이상 분량.

### 궁합 결과 (탭 2)
상단에 두 사람의 일주와 체질 비교, 궁합 점수(100점 만점, 별점) 표시 후 카드:

1. **오행 상성 카드** - 상생/상극 관계 시각화
2. **성격 궁합 카드** - 일주 기반 성격 조합 해석
3. **연애 스타일 카드** - 연애/결혼 관점 궁합
4. **주의할 점 & 조언 카드** - 관계 조언

### 궁합 계산 로직
- 오행 상생/상극 분석 (일간 오행 관계)
- 지지 합/충 분석 (육합/삼합/충/형)
- 사상체질 상성 (태양인-소음인 상보 등)
- 가중 합산으로 100점 만점 점수 산출

---

## 5. 프로젝트 구조

```
supertest/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── TabNavigation.tsx
│   │   ├── saju/
│   │   │   ├── SajuForm.tsx
│   │   │   ├── SajuResult.tsx
│   │   │   ├── PillarTable.tsx
│   │   │   ├── OhaengBar.tsx
│   │   │   └── ResultCard.tsx
│   │   └── gunghap/
│   │       ├── GunghapForm.tsx
│   │       ├── GunghapResult.tsx
│   │       └── ScoreDisplay.tsx
│   ├── lib/
│   │   ├── saju/
│   │   │   ├── calendar.ts
│   │   │   ├── pillars.ts
│   │   │   ├── ohaeng.ts
│   │   │   ├── constitution.ts
│   │   │   └── types.ts
│   │   ├── gunghap/
│   │   │   ├── compatibility.ts
│   │   │   └── score.ts
│   │   └── interpretation.ts
│   └── data/
│       ├── cheongan.json
│       ├── jiji.json
│       ├── ohaeng.json
│       ├── dayPillar.json
│       ├── constitution.json
│       ├── personality.json
│       ├── career.json
│       ├── wealth.json
│       ├── love.json
│       ├── health.json
│       ├── advice.json
│       └── gunghap.json
├── public/fonts/
├── next.config.ts
├── tailwind.config.ts
├── package.json
└── tsconfig.json
```

---

## 6. 핵심 라이브러리

| 패키지 | 용도 |
|--------|------|
| next 15 | 프레임워크 |
| react 19 | UI |
| typescript | 타입 안전성 |
| tailwindcss 4 | 스타일링 |
| korean-lunar-calendar | 음양력 변환 |

---

## 7. 배포

- `next.config.ts`에 `output: 'export'` 설정
- Vercel 또는 GitHub Pages에 정적 배포

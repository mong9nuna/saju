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
  hourPillar: Pillar | null
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

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

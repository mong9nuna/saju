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

import type { SajuResult as SajuResultType } from '@/lib/saju/types'
import type { InterpretationResult } from '@/lib/interpretation'
import PillarTable from './PillarTable'
import OhaengBar from './OhaengBar'
import ResultCard from './ResultCard'

interface SajuResultProps {
  saju: SajuResultType
  interpretation: InterpretationResult
}

const CARDS: { key: keyof InterpretationResult; title: string; icon: string }[] = [
  { key: 'personality', title: '기본 성격', icon: '🌟' },
  { key: 'constitution', title: '사상체질', icon: '🏥' },
  { key: 'career', title: '직업운', icon: '💼' },
  { key: 'wealth', title: '재물운', icon: '💰' },
  { key: 'love', title: '연애운', icon: '💕' },
  { key: 'health', title: '건강운', icon: '🍀' },
  { key: 'advice', title: '종합 조언', icon: '📜' },
]

export default function SajuResult({ saju, interpretation }: SajuResultProps) {
  return (
    <div className="mt-8 space-y-4">
      <PillarTable
        yearPillar={saju.yearPillar}
        monthPillar={saju.monthPillar}
        dayPillar={saju.dayPillar}
        hourPillar={saju.hourPillar}
      />

      <OhaengBar distribution={saju.ohaengDistribution} />

      <div className="card text-center">
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>사상체질</span>
        <div className="text-xl font-bold accent-gold mt-1">{saju.constitution}</div>
      </div>

      {CARDS.map(({ key, title, icon }) => (
        <ResultCard
          key={key}
          title={title}
          icon={icon}
          content={interpretation[key]}
        />
      ))}
    </div>
  )
}

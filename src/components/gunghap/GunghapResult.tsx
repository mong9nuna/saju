import type { SajuResult } from '@/lib/saju/types'
import type { GunghapResult as GunghapResultType } from '@/lib/saju/types'
import ScoreDisplay from './ScoreDisplay'

interface GunghapResultProps {
  result: GunghapResultType & {
    person1: SajuResult
    person2: SajuResult
  }
}

export default function GunghapResult({ result }: GunghapResultProps) {
  const cards = [
    { title: '오행 상성', icon: '☯', content: result.ohaengRelation },
    { title: '지지 관계', icon: '🔗', content: result.jijiRelation },
    { title: '체질 궁합', icon: '💫', content: result.constitutionRelation },
  ]

  return (
    <div className="mt-8 space-y-4">
      <div className="card">
        <div className="grid grid-cols-2 gap-4 text-center text-sm">
          <div>
            <div style={{ color: 'var(--text-secondary)' }}>나</div>
            <div className="text-lg font-bold accent-purple">
              {result.person1.dayPillar.cheongan}{result.person1.dayPillar.jiji}일주
            </div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {result.person1.constitution}
            </div>
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)' }}>상대방</div>
            <div className="text-lg font-bold accent-purple">
              {result.person2.dayPillar.cheongan}{result.person2.dayPillar.jiji}일주
            </div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {result.person2.constitution}
            </div>
          </div>
        </div>
      </div>

      <ScoreDisplay score={result.score} />

      {cards.map(({ title, icon, content }) => (
        <div key={title} className="card">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">{icon}</span>
            <h3 className="font-semibold accent-purple">{title}</h3>
          </div>
          <div className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {content}
          </div>
        </div>
      ))}
    </div>
  )
}

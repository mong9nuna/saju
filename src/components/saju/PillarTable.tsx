import type { Pillar, Ohaeng } from '@/lib/saju/types'
import { CHEONGAN_OHAENG, JIJI_OHAENG } from '@/lib/saju/types'

const OHAENG_COLOR: Record<Ohaeng, string> = {
  '목': '#22c55e',
  '화': '#ef4444',
  '토': '#eab308',
  '금': '#e2e8f0',
  '수': '#3b82f6',
}

interface PillarTableProps {
  yearPillar: Pillar
  monthPillar: Pillar
  dayPillar: Pillar
  hourPillar: Pillar | null
}

function PillarCell({ label, pillar }: { label: string; pillar: Pillar }) {
  const cheonganOhaeng = CHEONGAN_OHAENG[pillar.cheongan]
  const jijiOhaeng = JIJI_OHAENG[pillar.jiji]

  return (
    <div className="text-center">
      <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>{label}</div>
      <div
        className="text-2xl font-bold mb-1"
        style={{ color: OHAENG_COLOR[cheonganOhaeng] }}
      >
        {pillar.cheongan}
      </div>
      <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
        {cheonganOhaeng}
      </div>
      <div
        className="text-2xl font-bold mb-1"
        style={{ color: OHAENG_COLOR[jijiOhaeng] }}
      >
        {pillar.jiji}
      </div>
      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
        {jijiOhaeng}
      </div>
    </div>
  )
}

export default function PillarTable({ yearPillar, monthPillar, dayPillar, hourPillar }: PillarTableProps) {
  return (
    <div className="card">
      <h3 className="text-center text-sm mb-4 accent-gold">사주팔자표</h3>
      <div className={`grid ${hourPillar ? 'grid-cols-4' : 'grid-cols-3'} gap-4`}>
        {hourPillar && <PillarCell label="시주" pillar={hourPillar} />}
        <PillarCell label="일주" pillar={dayPillar} />
        <PillarCell label="월주" pillar={monthPillar} />
        <PillarCell label="연주" pillar={yearPillar} />
      </div>
      {!hourPillar && (
        <p className="text-xs text-center mt-2" style={{ color: 'var(--text-secondary)' }}>
          시간 정보 없음 - 시주는 표시되지 않습니다
        </p>
      )}
    </div>
  )
}

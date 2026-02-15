'use client'

import { useState } from 'react'
import TabNavigation from '@/components/TabNavigation'
import SajuForm from '@/components/saju/SajuForm'
import SajuResultComponent from '@/components/saju/SajuResult'
import GunghapForm from '@/components/gunghap/GunghapForm'
import GunghapResultComponent from '@/components/gunghap/GunghapResult'
import TarotSpread from '@/components/tarot/TarotSpread'
import { calculatePillars } from '@/lib/saju/pillars'
import { analyzeOhaeng } from '@/lib/saju/ohaeng'
import { determineConstitution } from '@/lib/saju/constitution'
import { generateInterpretation } from '@/lib/interpretation'
import { calculateGunghap } from '@/lib/gunghap/compatibility'
import type { SajuResult } from '@/lib/saju/types'
import type { GunghapResult } from '@/lib/saju/types'
import type { InterpretationResult } from '@/lib/interpretation'
import type { DateInput } from '@/lib/saju/calendar'

function buildSajuResult(input: DateInput): SajuResult {
  const pillars = calculatePillars(input)
  const ohaeng = analyzeOhaeng(pillars)
  const constitution = determineConstitution(ohaeng)
  return { ...pillars, ohaengDistribution: ohaeng, constitution }
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'saju' | 'gunghap' | 'tarot'>('saju')
  const [sajuResult, setSajuResult] = useState<SajuResult | null>(null)
  const [interpretation, setInterpretation] = useState<InterpretationResult | null>(null)
  const [gunghapResult, setGunghapResult] = useState<(GunghapResult & { person1: SajuResult; person2: SajuResult }) | null>(null)

  function handleSajuSubmit(input: DateInput) {
    const result = buildSajuResult(input)
    setSajuResult(result)
    setInterpretation(generateInterpretation(result))
  }

  function handleGunghapSubmit(input1: DateInput, input2: DateInput) {
    const p1 = buildSajuResult(input1)
    const p2 = buildSajuResult(input2)
    const gunghap = calculateGunghap(p1, p2)
    setGunghapResult({ person1: p1, person2: p2, ...gunghap })
  }

  return (
    <main>
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'saju' && (
        <>
          <SajuForm onSubmit={handleSajuSubmit} />
          {sajuResult && interpretation && (
            <SajuResultComponent saju={sajuResult} interpretation={interpretation} />
          )}
        </>
      )}
      {activeTab === 'gunghap' && (
        <>
          <GunghapForm onSubmit={handleGunghapSubmit} />
          {gunghapResult && <GunghapResultComponent result={gunghapResult} />}
        </>
      )}
      {activeTab === 'tarot' && <TarotSpread />}
    </main>
  )
}

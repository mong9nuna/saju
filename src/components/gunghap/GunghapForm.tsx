'use client'

import { useState } from 'react'
import type { DateInput } from '@/lib/saju/calendar'

interface GunghapFormProps {
  onSubmit: (person1: DateInput, person2: DateInput) => void
}

function PersonInput({ label, onChange }: { label: string; onChange: (input: DateInput) => void }) {
  const [year, setYear] = useState(1990)
  const [month, setMonth] = useState(1)
  const [day, setDay] = useState(1)
  const [hour, setHour] = useState<number | null>(12)
  const [isLunar, setIsLunar] = useState(false)

  const hours = [
    { value: 0, label: '자시 (23~01)' },
    { value: 1, label: '축시 (01~03)' },
    { value: 3, label: '인시 (03~05)' },
    { value: 5, label: '묘시 (05~07)' },
    { value: 7, label: '진시 (07~09)' },
    { value: 9, label: '사시 (09~11)' },
    { value: 11, label: '오시 (11~13)' },
    { value: 13, label: '미시 (13~15)' },
    { value: 15, label: '신시 (15~17)' },
    { value: 17, label: '유시 (17~19)' },
    { value: 19, label: '술시 (19~21)' },
    { value: 21, label: '해시 (21~23)' },
  ]

  // Notify parent whenever values change
  function notifyChange(y: number, m: number, d: number, h: number | null, l: boolean) {
    onChange({ year: y, month: m, day: d, hour: h, isLunar: l })
  }

  return (
    <div className="space-y-3">
      <h3 className="font-medium accent-purple">{label}</h3>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>년</label>
          <input
            type="number"
            min={1900}
            max={2100}
            value={year}
            onChange={(e) => { const v = Number(e.target.value); setYear(v); notifyChange(v, month, day, hour, isLunar) }}
            className="w-full px-2 py-1.5 text-sm rounded-lg bg-white/5 border border-white/10 text-white focus:border-purple-500 focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>월</label>
          <select
            value={month}
            onChange={(e) => { const v = Number(e.target.value); setMonth(v); notifyChange(year, v, day, hour, isLunar) }}
            className="w-full px-2 py-1.5 text-sm rounded-lg bg-white/5 border border-white/10 text-white focus:border-purple-500 focus:outline-none"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}월</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>일</label>
          <select
            value={day}
            onChange={(e) => { const v = Number(e.target.value); setDay(v); notifyChange(year, month, v, hour, isLunar) }}
            className="w-full px-2 py-1.5 text-sm rounded-lg bg-white/5 border border-white/10 text-white focus:border-purple-500 focus:outline-none"
          >
            {Array.from({ length: 31 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}일</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>시간</label>
        <select
          value={hour ?? 'unknown'}
          onChange={(e) => { const v = e.target.value === 'unknown' ? null : Number(e.target.value); setHour(v); notifyChange(year, month, day, v, isLunar) }}
          className="w-full px-2 py-1.5 text-sm rounded-lg bg-white/5 border border-white/10 text-white focus:border-purple-500 focus:outline-none"
        >
          <option value="unknown">시간 모름</option>
          {hours.map((h) => (
            <option key={h.value} value={h.value}>{h.label}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-1 cursor-pointer text-sm">
          <input type="radio" checked={!isLunar} onChange={() => { setIsLunar(false); notifyChange(year, month, day, hour, false) }} className="accent-purple-500" />
          양력
        </label>
        <label className="flex items-center gap-1 cursor-pointer text-sm">
          <input type="radio" checked={isLunar} onChange={() => { setIsLunar(true); notifyChange(year, month, day, hour, true) }} className="accent-purple-500" />
          음력
        </label>
      </div>
    </div>
  )
}

export default function GunghapForm({ onSubmit }: GunghapFormProps) {
  const [person1, setPerson1] = useState<DateInput>({ year: 1990, month: 1, day: 1, hour: 12, isLunar: false })
  const [person2, setPerson2] = useState<DateInput>({ year: 1992, month: 1, day: 1, hour: 12, isLunar: false })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit(person1, person2)
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-6">
      <h2 className="text-lg font-semibold accent-gold">궁합 정보 입력</h2>
      <PersonInput label="나" onChange={setPerson1} />
      <hr className="border-white/10" />
      <PersonInput label="상대방" onChange={setPerson2} />
      <button
        type="submit"
        className="w-full py-3 rounded-lg font-medium transition-all bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white"
      >
        궁합 보기
      </button>
    </form>
  )
}

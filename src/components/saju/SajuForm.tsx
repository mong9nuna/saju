'use client'

import { useState } from 'react'
import type { DateInput } from '@/lib/saju/calendar'

interface SajuFormProps {
  onSubmit: (input: DateInput) => void
}

export default function SajuForm({ onSubmit }: SajuFormProps) {
  const [year, setYear] = useState(1990)
  const [month, setMonth] = useState(1)
  const [day, setDay] = useState(1)
  const [hour, setHour] = useState<number | null>(12)
  const [isLunar, setIsLunar] = useState(false)

  const hours = [
    { value: 0, label: '자시 (23:00~01:00)' },
    { value: 1, label: '축시 (01:00~03:00)' },
    { value: 3, label: '인시 (03:00~05:00)' },
    { value: 5, label: '묘시 (05:00~07:00)' },
    { value: 7, label: '진시 (07:00~09:00)' },
    { value: 9, label: '사시 (09:00~11:00)' },
    { value: 11, label: '오시 (11:00~13:00)' },
    { value: 13, label: '미시 (13:00~15:00)' },
    { value: 15, label: '신시 (15:00~17:00)' },
    { value: 17, label: '유시 (17:00~19:00)' },
    { value: 19, label: '술시 (19:00~21:00)' },
    { value: 21, label: '해시 (21:00~23:00)' },
  ]

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({ year, month, day, hour, isLunar })
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h2 className="text-lg font-semibold accent-gold">생년월일 입력</h2>

      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>년</label>
          <input
            type="number"
            min={1900}
            max={2100}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-purple-500 focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>월</label>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-purple-500 focus:outline-none"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}월</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>일</label>
          <select
            value={day}
            onChange={(e) => setDay(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-purple-500 focus:outline-none"
          >
            {Array.from({ length: 31 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}일</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>태어난 시간</label>
        <select
          value={hour ?? 'unknown'}
          onChange={(e) => setHour(e.target.value === 'unknown' ? null : Number(e.target.value))}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-purple-500 focus:outline-none"
        >
          <option value="unknown">시간 모름</option>
          {hours.map((h) => (
            <option key={h.value} value={h.value}>{h.label}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={!isLunar}
            onChange={() => setIsLunar(false)}
            className="accent-purple-500"
          />
          <span className="text-sm">양력</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={isLunar}
            onChange={() => setIsLunar(true)}
            className="accent-purple-500"
          />
          <span className="text-sm">음력</span>
        </label>
      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-lg font-medium transition-all bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white"
      >
        사주 보기
      </button>
    </form>
  )
}

'use client'

interface TabNavigationProps {
  activeTab: 'saju' | 'gunghap' | 'tarot'
  onTabChange: (tab: 'saju' | 'gunghap' | 'tarot') => void
}

const TABS = [
  { key: 'saju' as const, label: '내 사주' },
  { key: 'gunghap' as const, label: '궁합 보기' },
  { key: 'tarot' as const, label: '타로 운세' },
]

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex gap-2 mb-8">
      {TABS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onTabChange(key)}
          className={`flex-1 py-3 rounded-lg font-medium transition-all ${
            activeTab === key
              ? 'bg-purple-600/30 border border-purple-500/50 text-white'
              : 'bg-transparent border border-white/10 text-gray-400 hover:border-white/30'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

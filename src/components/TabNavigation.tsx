'use client'

interface TabNavigationProps {
  activeTab: 'saju' | 'gunghap'
  onTabChange: (tab: 'saju' | 'gunghap') => void
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex gap-2 mb-8">
      <button
        onClick={() => onTabChange('saju')}
        className={`flex-1 py-3 rounded-lg font-medium transition-all ${
          activeTab === 'saju'
            ? 'bg-purple-600/30 border border-purple-500/50 text-white'
            : 'bg-transparent border border-white/10 text-gray-400 hover:border-white/30'
        }`}
      >
        내 사주
      </button>
      <button
        onClick={() => onTabChange('gunghap')}
        className={`flex-1 py-3 rounded-lg font-medium transition-all ${
          activeTab === 'gunghap'
            ? 'bg-purple-600/30 border border-purple-500/50 text-white'
            : 'bg-transparent border border-white/10 text-gray-400 hover:border-white/30'
        }`}
      >
        궁합 보기
      </button>
    </div>
  )
}

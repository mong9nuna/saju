interface ScoreDisplayProps {
  score: number
}

function getScoreLabel(score: number): string {
  if (score >= 80) return '천생연분'
  if (score >= 60) return '좋은 인연'
  if (score >= 40) return '보통'
  return '노력 필요'
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#d4a843'
  if (score >= 60) return '#8b5cf6'
  if (score >= 40) return '#6b7280'
  return '#ef4444'
}

export default function ScoreDisplay({ score }: ScoreDisplayProps) {
  const stars = Math.round(score / 20)
  const color = getScoreColor(score)

  return (
    <div className="card text-center py-6">
      <div className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>궁합 점수</div>
      <div className="text-5xl font-bold mb-2" style={{ color }}>
        {score}
      </div>
      <div className="text-2xl mb-2">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} style={{ color: i < stars ? '#d4a843' : '#333' }}>★</span>
        ))}
      </div>
      <div className="text-sm font-medium" style={{ color }}>
        {getScoreLabel(score)}
      </div>
    </div>
  )
}

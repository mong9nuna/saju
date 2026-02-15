interface ResultCardProps {
  title: string
  icon: string
  content: string
  accentColor?: string
}

export default function ResultCard({ title, icon, content, accentColor = 'var(--accent-purple)' }: ResultCardProps) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{icon}</span>
        <h3 className="font-semibold" style={{ color: accentColor }}>{title}</h3>
      </div>
      <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>
        {content}
      </div>
    </div>
  )
}

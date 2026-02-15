import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '사주팔자 - 나의 운명 풀이',
  description: '생년월일로 보는 사주팔자 해석과 궁합 분석',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="dark">
      <head>
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <div className="min-h-screen max-w-2xl mx-auto px-4 py-8">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold accent-gold tracking-wider">
              사주팔자
            </h1>
            <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
              당신의 운명을 풀어드립니다
            </p>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}

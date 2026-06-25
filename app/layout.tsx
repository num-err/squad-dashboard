import type { Metadata } from 'next'
import './globals.css'
import { NavBar } from '@/src/components/NavBar'

export const metadata: Metadata = {
  title: 'Squad OS',
  description: 'Accountability dashboard for a 3-person squad',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0a0f] text-slate-200 antialiased">
        <NavBar />
        <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">{children}</main>
      </body>
    </html>
  )
}

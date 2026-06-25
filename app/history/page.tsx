'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts'
import { SQUAD_MEMBERS } from '@/src/types'
import { History } from 'lucide-react'

interface MonthData {
  month: string
  label: string
  [key: string]: string | number
}

const MEMBER_COLORS: Record<string, string> = {
  Numer: '#14b8a6',
  Zara: '#3b82f6',
  Kai: '#a855f7',
}

const MONTHS = Array.from({ length: 6 }, (_, i) => {
  const d = new Date()
  d.setMonth(d.getMonth() - i)
  return {
    key: d.toISOString().slice(0, 7),
    label: d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
  }
}).reverse()

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm shadow-xl">
      <div className="mb-2 font-semibold text-white">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-400">{p.name}:</span>
          <span className="font-medium text-white">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function HistoryPage() {
  const [lcData, setLcData] = useState<MonthData[]>([])
  const [linkedinData, setLinkedinData] = useState<MonthData[]>([])
  const [appData, setAppData] = useState<MonthData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [lcRes, linkedinRes, appRes] = await Promise.all([
        fetch('/api/leetcode?days=200'),
        fetch('/api/linkedin'),
        fetch('/api/applications'),
      ])
      const [lc, linkedin, apps] = await Promise.all([
        lcRes.json(),
        linkedinRes.json(),
        appRes.json(),
      ])

      const lcLogs: Array<{ member: string; loggedDate: string }> = lc.data ?? []
      const linkedinPosts: Array<{ member: string; postedDate: string }> = linkedin.data ?? []
      const applications: Array<{ member: string; appliedDate: string }> = apps.data ?? []

      const buildMonthData = (
        items: Array<{ member: string; date: string }>,
        dateKey: 'date'
      ): MonthData[] =>
        MONTHS.map(({ key, label }) => {
          const row: MonthData = { month: key, label }
          for (const m of SQUAD_MEMBERS) {
            row[m] = items.filter((i) => i.date.startsWith(key) && i.member === m).length
          }
          return row
        })

      setLcData(
        buildMonthData(lcLogs.map((l) => ({ member: l.member, date: l.loggedDate })), 'date')
      )
      setLinkedinData(
        buildMonthData(linkedinPosts.map((p) => ({ member: p.member, date: p.postedDate })), 'date')
      )
      setAppData(
        buildMonthData(applications.map((a) => ({ member: a.member, date: a.appliedDate })), 'date')
      )
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <History className="h-6 w-6 text-teal-400" />
        <div>
          <h1 className="text-3xl font-black text-white">
            Squad <span className="text-blue-400">History</span>
          </h1>
          <p className="text-slate-400 text-sm">Last 6 months at a glance</p>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center text-slate-500">Loading history...</div>
      ) : (
        <div className="space-y-8">
          {/* LC Chart */}
          <ChartSection title="LeetCode Problems / Month">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={lcData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(v) => <span className="text-xs text-slate-400">{v}</span>}
                />
                {SQUAD_MEMBERS.map((m) => (
                  <Bar key={m} dataKey={m} fill={MEMBER_COLORS[m]} radius={[3, 3, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </ChartSection>

          {/* LinkedIn Chart */}
          <ChartSection title="LinkedIn Posts / Month">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={linkedinData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(v) => <span className="text-xs text-slate-400">{v}</span>} />
                {SQUAD_MEMBERS.map((m) => (
                  <Bar key={m} dataKey={m} fill={MEMBER_COLORS[m]} radius={[3, 3, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </ChartSection>

          {/* Applications Chart */}
          <ChartSection title="Applications / Month">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={appData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(v) => <span className="text-xs text-slate-400">{v}</span>} />
                {SQUAD_MEMBERS.map((m) => (
                  <Bar key={m} dataKey={m} fill={MEMBER_COLORS[m]} radius={[3, 3, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </ChartSection>
        </div>
      )}
    </div>
  )
}

function ChartSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <h2 className="mb-6 font-semibold text-white">{title}</h2>
      {children}
    </div>
  )
}

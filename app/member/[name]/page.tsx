import { notFound } from 'next/navigation'
import { prisma } from '@/src/lib/prisma'
import { SQUAD_MEMBERS, type Application } from '@/src/types'
import { ActivityHeatmap } from '@/src/components/ActivityHeatmap'
import { ApplicationsLog } from '@/src/components/ApplicationsLog'
import { getDateRange, getMonthStart, getMonthEnd, formatDate } from '@/src/lib/utils'
import { Linkedin, ArrowLeft, Zap, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/src/components/ui/badge'

function calcStreak(dates: string[]): number {
  if (!dates.length) return 0
  const sorted = Array.from(new Set(dates)).sort().reverse()
  const current = new Date()

  let streak = 0
  for (const d of sorted) {
    const cur = current.toISOString().slice(0, 10)
    if (d === cur) {
      streak++
      current.setDate(current.getDate() - 1)
    } else if (d < cur) {
      break
    }
  }
  return streak
}

interface Params {
  params: Promise<{ name: string }>
}

export default async function MemberPage({ params }: Params) {
  const { name } = await params
  const memberName = SQUAD_MEMBERS.find((m) => m.toLowerCase() === name.toLowerCase())
  if (!memberName) notFound()

  const range90 = getDateRange(90)
  const monthStart = getMonthStart()
  const monthEnd = getMonthEnd()

  const [lcLogs, linkedin, goals, apps] = await Promise.all([
    prisma.leetcodeLog.findMany({ where: { member: memberName }, orderBy: { loggedDate: 'asc' } }),
    prisma.linkedinPost.findMany({ where: { member: memberName }, orderBy: { postedDate: 'desc' } }),
    prisma.sprintGoal.findMany({ where: { member: memberName }, orderBy: { id: 'desc' } }),
    prisma.application.findMany({ where: { member: memberName }, orderBy: { appliedDate: 'desc' } }),
  ])

  const lcDates = lcLogs.map((l) => l.loggedDate)
  const streak = calcStreak(lcDates)
  const lcThisMonth = lcDates.filter((d) => d >= monthStart && d <= monthEnd).length
  const lcLogs90 = lcLogs.filter((l) => l.loggedDate >= range90.start)

  const currentGoals = goals.slice(0, 8)

  return (
    <div>
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      {/* Hero */}
      <div className="mb-8 rounded-2xl border border-slate-800 bg-gradient-to-br from-teal-500/5 to-transparent p-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-black text-white">{memberName}</h1>
            <p className="text-slate-400 mt-1">Squad member deep-dive</p>
          </div>
          <div className="text-right">
            <div className="text-6xl font-black text-teal-400 tabular-nums leading-none">
              {streak}
            </div>
            <div className="mt-1 flex items-center justify-end gap-1 text-sm text-slate-400">
              <span className="flame-icon">🔥</span>
              <span>day streak</span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Total LC', value: lcLogs.length, color: 'text-teal-400' },
            { label: 'This month', value: lcThisMonth, color: 'text-teal-400' },
            { label: 'LinkedIn posts', value: linkedin.length, color: 'text-purple-400' },
            { label: 'Applications', value: apps.length, color: 'text-amber-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl bg-slate-800/60 p-4">
              <div className={`text-3xl font-black tabular-nums ${color}`}>{value}</div>
              <div className="text-xs text-slate-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* LC Heatmap */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4 text-teal-400" />
            <h2 className="font-semibold text-white">LeetCode Activity</h2>
          </div>
          <ActivityHeatmap logs={lcLogs90.map((l) => ({ loggedDate: l.loggedDate, member: l.member }))} days={90} />
        </div>

        {/* Sprint Goals */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="mb-4 font-semibold text-white">Sprint Goals</h2>
          <div className="space-y-2">
            {currentGoals.map((goal) => (
              <div key={goal.id} className="flex items-start gap-3 rounded-lg bg-slate-800/60 p-3">
                <div className={`mt-0.5 h-2 w-2 flex-shrink-0 rounded-full ${goal.completed ? 'bg-green-500' : 'bg-slate-600'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${goal.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {goal.goalText}
                  </p>
                  <div className="mt-1 flex gap-2">
                    <Badge variant={goal.completed ? 'green' : 'slate'} className="text-xs">
                      {goal.completed ? 'Done' : 'In progress'}
                    </Badge>
                    <Badge variant="default" className="text-xs">{goal.track}</Badge>
                  </div>
                </div>
              </div>
            ))}
            {goals.length === 0 && (
              <div className="py-4 text-center text-sm text-slate-600">No goals yet</div>
            )}
          </div>
        </div>

        {/* Applications */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="mb-4 font-semibold text-white">Applications</h2>
          <ApplicationsLog applications={apps as Application[]} />
        </div>

        {/* LinkedIn Posts */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="mb-4 flex items-center gap-2">
            <Linkedin className="h-4 w-4 text-purple-400" />
            <h2 className="font-semibold text-white">LinkedIn Posts</h2>
          </div>
          <div className="space-y-2">
            {linkedin.map((post) => (
              <div key={post.id} className="rounded-lg bg-slate-800/60 p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-slate-200">{post.theme ?? 'LinkedIn post'}</p>
                  {post.postUrl && (
                    <a
                      href={post.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 text-purple-400 hover:text-purple-300"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
                <div className="mt-1 text-xs text-slate-500">{formatDate(post.postedDate)}</div>
              </div>
            ))}
            {linkedin.length === 0 && (
              <div className="py-4 text-center text-sm text-slate-600">No posts yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

import { prisma } from '@/src/lib/prisma'
import { SQUAD_MEMBERS, SPRINT_REFERENCE_START, type MemberStats, type Track } from '@/src/types'
import { getWeekStart, getMonthStart, getMonthEnd, getSprintDates, getDateRange } from '@/src/lib/utils'
import { MemberCard } from '@/src/components/MemberCard'
import { ActivityHeatmap } from '@/src/components/ActivityHeatmap'
import { WeeklySummary } from '@/src/components/WeeklySummary'
import { CalendarDays, Users } from 'lucide-react'

export const dynamic = 'force-dynamic'

function calcStreak(dates: string[]): number {
  if (!dates.length) return 0
  const sorted = Array.from(new Set(dates)).sort().reverse()
  const today = new Date().toISOString().slice(0, 10)
  let streak = 0
  const current = new Date(today)

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

async function getStats(): Promise<MemberStats[]> {
  const weekStart = getWeekStart()
  const monthStart = getMonthStart()
  const monthEnd = getMonthEnd()
  const sprint = getSprintDates(SPRINT_REFERENCE_START)

  const [allLC, allLinkedin, allGoals, allApps] = await Promise.all([
    prisma.leetcodeLog.findMany(),
    prisma.linkedinPost.findMany({ where: { postedDate: { gte: monthStart, lte: monthEnd } } }),
    prisma.sprintGoal.findMany({ where: { sprintStart: { gte: sprint.start } } }),
    prisma.application.findMany(),
  ])

  return SQUAD_MEMBERS.map((name) => {
    const memberLC = allLC.filter((l) => l.member === name)
    const memberLCDates = memberLC.map((l) => l.loggedDate)
    const tracks = Array.from(new Set(allGoals.filter((g) => g.member === name).map((g) => g.track as Track)))
    const memberGoals = allGoals.filter((g) => g.member === name)

    return {
      name,
      lcStreak: calcStreak(memberLCDates),
      lcThisWeek: memberLCDates.filter((d) => d >= weekStart).length,
      lcThisMonth: memberLCDates.filter((d) => d >= monthStart && d <= monthEnd).length,
      lcTotal: memberLC.length,
      linkedinThisMonth: allLinkedin.filter((p) => p.member === name).length,
      linkedinTarget: 4,
      applications: {
        job: allApps.filter((a) => a.member === name && a.type === 'job').length,
        gradschool: allApps.filter((a) => a.member === name && a.type === 'gradschool').length,
        startup: allApps.filter((a) => a.member === name && a.type === 'startup').length,
        total: allApps.filter((a) => a.member === name).length,
      },
      sprintGoals: {
        total: memberGoals.length,
        completed: memberGoals.filter((g) => g.completed).length,
        pct: memberGoals.length
          ? Math.round((memberGoals.filter((g) => g.completed).length / memberGoals.length) * 100)
          : 0,
      },
      tracks: tracks.length ? tracks : ['job'],
    }
  })
}

export default async function DashboardPage() {
  const [stats, heatmapLogs] = await Promise.all([
    getStats(),
    prisma.leetcodeLog.findMany({
      where: { loggedDate: { gte: getDateRange(90).start } },
      select: { loggedDate: true, member: true },
    }),
  ])

  const sprint = getSprintDates(SPRINT_REFERENCE_START)
  const ranked = [...stats].sort((a, b) => b.lcStreak - a.lcStreak)

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
            <CalendarDays className="h-4 w-4" />
            <span>{today}</span>
          </div>
          <h1 className="text-3xl font-black text-white">
            Squad <span className="text-teal-400">OS</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Accountability. Velocity. No excuses.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-2.5 text-center">
            <div className="text-2xl font-black text-amber-400">{sprint.daysLeft}</div>
            <div className="text-xs text-amber-500/70 uppercase tracking-widest">days left</div>
            <div className="text-xs text-slate-600">in sprint</div>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-center">
            <div className="flex items-center gap-1.5 justify-center">
              <Users className="h-4 w-4 text-slate-400" />
              <div className="text-2xl font-black text-slate-200">{stats.length}</div>
            </div>
            <div className="text-xs text-slate-500 uppercase tracking-widest">members</div>
          </div>
        </div>
      </div>

      {/* 3D Member Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ranked.map((s, i) => (
          <MemberCard key={s.name} stats={s} rank={i + 1} />
        ))}
      </div>

      {/* Combined Activity Heatmap */}
      <div className="mb-8 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="mb-4 font-semibold text-white">LeetCode Activity — Last 90 Days</h2>
        <ActivityHeatmap logs={heatmapLogs} days={90} />
      </div>

      {/* Sprint dates band */}
      <div className="mb-6 flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-2.5 text-sm text-slate-400">
        <CalendarDays className="h-4 w-4 text-teal-400 flex-shrink-0" />
        <span>
          Current sprint: <span className="text-white font-medium">{sprint.start}</span>
          {' → '}
          <span className="text-white font-medium">{sprint.end}</span>
        </span>
        <span className="ml-auto rounded-full bg-teal-500/10 px-2 py-0.5 text-xs text-teal-400 border border-teal-500/20">
          {sprint.daysLeft}d left
        </span>
      </div>

      {/* Weekly AI Summary */}
      <WeeklySummary />
    </div>
  )
}

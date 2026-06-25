import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { SQUAD_MEMBERS, type MemberStats, type Track } from '@/src/types'
import { getWeekStart, getMonthStart, getMonthEnd } from '@/src/lib/utils'

export const dynamic = 'force-dynamic'

function calcStreak(dates: string[]): number {
  if (!dates.length) return 0
  const sorted = Array.from(new Set(dates)).sort().reverse()
  const today = new Date().toISOString().slice(0, 10)
  let streak = 0
  let current = new Date(today)

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

export async function GET() {
  try {
    const weekStart = getWeekStart()
    const monthStart = getMonthStart()
    const monthEnd = getMonthEnd()
    const today = new Date().toISOString().slice(0, 10)
    const sprintStart = new Date()
    sprintStart.setDate(sprintStart.getDate() - 14)
    const sprintStartStr = sprintStart.toISOString().slice(0, 10)

    const [allLC, allLinkedin, allGoals, allApps] = await Promise.all([
      prisma.leetcodeLog.findMany(),
      prisma.linkedinPost.findMany({ where: { postedDate: { gte: monthStart, lte: monthEnd } } }),
      prisma.sprintGoal.findMany({ where: { sprintStart: { gte: sprintStartStr } } }),
      prisma.application.findMany(),
    ])

    const stats: MemberStats[] = SQUAD_MEMBERS.map((name) => {
      const memberLC = allLC.filter((l) => l.member === name)
      const memberLCDates = memberLC.map((l) => l.loggedDate)
      const streak = calcStreak(memberLCDates)
      const lcThisWeek = memberLCDates.filter((d) => d >= weekStart).length
      const lcThisMonth = memberLCDates.filter((d) => d >= monthStart && d <= monthEnd).length

      const memberLinkedin = allLinkedin.filter((p) => p.member === name)
      const memberGoals = allGoals.filter((g) => g.member === name)
      const memberApps = allApps.filter((a) => a.member === name)

      const tracks = Array.from(new Set(memberGoals.map((g) => g.track as Track)))

      return {
        name,
        lcStreak: streak,
        lcThisWeek,
        lcThisMonth,
        lcTotal: memberLC.length,
        linkedinThisMonth: memberLinkedin.length,
        linkedinTarget: 4,
        applications: {
          job: memberApps.filter((a) => a.type === 'job').length,
          gradschool: memberApps.filter((a) => a.type === 'gradschool').length,
          startup: memberApps.filter((a) => a.type === 'startup').length,
          total: memberApps.length,
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

    return NextResponse.json({ data: stats })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch member stats' }, { status: 500 })
  }
}

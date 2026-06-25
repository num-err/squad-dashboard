'use client'

import Link from 'next/link'
import { Flame, Zap, Linkedin, Briefcase, GraduationCap, Rocket, Target } from 'lucide-react'
import { Badge } from '@/src/components/ui/badge'
import { Progress } from '@/src/components/ui/progress'
import { cn } from '@/src/lib/utils'
import type { MemberStats, Track } from '@/src/types'

const TRACK_CONFIG: Record<Track, { label: string; color: string; Icon: React.ComponentType<{ className?: string }> }> = {
  job: { label: 'Job Hunt', color: 'amber', Icon: Briefcase },
  gradschool: { label: 'Grad School', color: 'blue', Icon: GraduationCap },
  startup: { label: 'Startup', color: 'coral', Icon: Rocket },
  leetcode: { label: 'LeetCode', color: 'teal', Icon: Zap },
}

const MEMBER_GRADIENTS: Record<string, string> = {
  Numer: 'from-teal-500/10 via-transparent to-transparent border-teal-500/20',
  Zara: 'from-blue-500/10 via-transparent to-transparent border-blue-500/20',
  Kai: 'from-purple-500/10 via-transparent to-transparent border-purple-500/20',
}

const STREAK_COLORS = (streak: number) => {
  if (streak >= 14) return 'text-orange-400'
  if (streak >= 7) return 'text-amber-400'
  return 'text-teal-400'
}

interface MemberCardProps {
  stats: MemberStats
  rank: number
}

export function MemberCard({ stats, rank }: MemberCardProps) {
  const gradient = MEMBER_GRADIENTS[stats.name] ?? 'from-slate-500/10 via-transparent to-transparent border-slate-500/20'

  return (
    <Link href={`/member/${stats.name.toLowerCase()}`} className="block perspective">
      <div
        className={cn(
          'card-3d relative rounded-xl border bg-gradient-to-br p-5 cursor-pointer',
          'bg-slate-900/80 backdrop-blur-sm',
          gradient
        )}
      >
        {/* Rank badge */}
        <div className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-slate-400">
          #{rank}
        </div>

        {/* Header */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">{stats.name}</h2>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {stats.tracks.map((track) => {
              const cfg = TRACK_CONFIG[track]
              return (
                <Badge key={track} variant={cfg.color as 'amber' | 'blue' | 'coral' | 'teal'} className="gap-1">
                  <cfg.Icon className="h-3 w-3" />
                  {cfg.label}
                </Badge>
              )
            })}
          </div>
        </div>

        {/* Streak — hero stat */}
        <div className="mb-4 flex items-end gap-3">
          <div>
            <div className={cn('text-5xl font-black tabular-nums leading-none', STREAK_COLORS(stats.lcStreak))}>
              {stats.lcStreak}
            </div>
            <div className="mt-1 text-xs text-slate-500 uppercase tracking-widest">day streak</div>
          </div>
          <span className="flame-icon mb-1 text-3xl">🔥</span>
        </div>

        {/* LC Stats row */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-800/60 p-3">
            <div className="text-xl font-bold text-teal-400">{stats.lcThisWeek}</div>
            <div className="text-xs text-slate-500">LC this week</div>
          </div>
          <div className="rounded-lg bg-slate-800/60 p-3">
            <div className="text-xl font-bold text-teal-400">{stats.lcThisMonth}</div>
            <div className="text-xs text-slate-500">LC this month</div>
          </div>
        </div>

        {/* LinkedIn */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Linkedin className="h-4 w-4 text-purple-400" />
            <span>LinkedIn posts</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-purple-400">{stats.linkedinThisMonth}</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-500">{stats.linkedinTarget}</span>
          </div>
        </div>
        <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-purple-500 transition-all duration-700"
            style={{ width: `${Math.min(100, (stats.linkedinThisMonth / stats.linkedinTarget) * 100)}%` }}
          />
        </div>

        {/* Applications */}
        <div className="mb-4 flex gap-2">
          {stats.applications.job > 0 && (
            <div className="flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-1 text-xs">
              <Briefcase className="h-3 w-3 text-amber-400" />
              <span className="font-medium text-amber-400">{stats.applications.job}</span>
            </div>
          )}
          {stats.applications.gradschool > 0 && (
            <div className="flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-1 text-xs">
              <GraduationCap className="h-3 w-3 text-blue-400" />
              <span className="font-medium text-blue-400">{stats.applications.gradschool}</span>
            </div>
          )}
          {stats.applications.startup > 0 && (
            <div className="flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-1 text-xs">
              <Rocket className="h-3 w-3 text-rose-400" />
              <span className="font-medium text-rose-400">{stats.applications.startup}</span>
            </div>
          )}
        </div>

        {/* Sprint goals */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Target className="h-3 w-3" />
              <span>Sprint goals</span>
            </div>
            <span className="text-xs font-semibold text-slate-300">
              {stats.sprintGoals.completed}/{stats.sprintGoals.total} ({stats.sprintGoals.pct}%)
            </span>
          </div>
          <Progress
            value={stats.sprintGoals.pct}
            className="h-1.5"
            indicatorClassName={
              stats.sprintGoals.pct >= 80
                ? 'bg-green-500'
                : stats.sprintGoals.pct >= 50
                ? 'bg-amber-500'
                : 'bg-rose-500'
            }
          />
        </div>
      </div>
    </Link>
  )
}

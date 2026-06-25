'use client'

import { useEffect, useState } from 'react'
import { SQUAD_MEMBERS, SPRINT_REFERENCE_START, type Track } from '@/src/types'
import { getSprintDates, formatDate } from '@/src/lib/utils'
import { SprintGoals } from '@/src/components/SprintGoals'
import { Progress } from '@/src/components/ui/progress'
import { CalendarDays, Target } from 'lucide-react'

interface Goal {
  id: number
  member: string
  goalText: string
  track: Track
  sprintStart: string
  sprintEnd: string
  completed: boolean
  completedAt: string | null
}

export default function SprintPage() {
  const sprint = getSprintDates(SPRINT_REFERENCE_START)
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchGoals() {
    const res = await fetch(`/api/goals?sprintStart=${sprint.start}`)
    const json = await res.json()
    setGoals(json.data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchGoals() }, [])

  async function handleToggle(id: number, completed: boolean) {
    await fetch('/api/goals', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, completed }),
    })
    setGoals((prev) => prev.map((g) => g.id === id ? { ...g, completed, completedAt: completed ? new Date().toISOString() : null } : g))
  }

  async function handleAdd(member: string, goalText: string, track: Track) {
    const res = await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ member, goalText, track, sprintStart: sprint.start, sprintEnd: sprint.end }),
    })
    const json = await res.json()
    if (json.data) setGoals((prev) => [...prev, json.data])
  }

  async function handleDelete(id: number) {
    await fetch(`/api/goals?id=${id}`, { method: 'DELETE' })
    setGoals((prev) => prev.filter((g) => g.id !== id))
  }

  const total = goals.length
  const completed = goals.filter((g) => g.completed).length
  const overallPct = total ? Math.round((completed / total) * 100) : 0

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-1">
          Sprint <span className="text-amber-400">Manager</span>
        </h1>
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <CalendarDays className="h-4 w-4" />
          <span>{formatDate(sprint.start)} → {formatDate(sprint.end)}</span>
          <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400 border border-amber-500/20">
            {sprint.daysLeft}d left
          </span>
        </div>
      </div>

      {/* Overall progress */}
      <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-teal-400" />
            <span className="font-semibold text-white">Squad Progress</span>
          </div>
          <span className="font-bold text-white tabular-nums">
            {completed}/{total} <span className="text-slate-400 font-normal">goals</span>
          </span>
        </div>
        <Progress
          value={overallPct}
          className="h-2"
          indicatorClassName={overallPct >= 75 ? 'bg-green-500' : overallPct >= 50 ? 'bg-teal-500' : 'bg-amber-500'}
        />
        <div className="mt-1 text-right text-xs text-slate-500">{overallPct}%</div>
      </div>

      {/* Per-member goal boards */}
      {loading ? (
        <div className="py-16 text-center text-slate-500">Loading goals...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SQUAD_MEMBERS.map((name) => {
            const memberGoals = goals.filter((g) => g.member === name)
            const mCompleted = memberGoals.filter((g) => g.completed).length
            const mPct = memberGoals.length ? Math.round((mCompleted / memberGoals.length) * 100) : 0

            return (
              <div key={name} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-white">{name}</h2>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-teal-500 transition-all duration-700"
                      style={{ width: `${mPct}%` }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{mPct}% complete</div>
                </div>
                <SprintGoals
                  goals={memberGoals}
                  member={name}
                  sprintStart={sprint.start}
                  sprintEnd={sprint.end}
                  onToggle={handleToggle}
                  onAdd={(goalText, track) => handleAdd(name, goalText, track)}
                  onDelete={handleDelete}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

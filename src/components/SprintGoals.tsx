'use client'

import { useState } from 'react'
import { CheckCircle2, Circle, Plus, Trash2, Zap, Briefcase, GraduationCap, Rocket } from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import { Badge } from '@/src/components/ui/badge'
import { cn } from '@/src/lib/utils'
import type { SprintGoal, Track } from '@/src/types'

const TRACK_ICONS: Record<Track, React.ComponentType<{ className?: string }>> = {
  job: Briefcase,
  gradschool: GraduationCap,
  startup: Rocket,
  leetcode: Zap,
}

const TRACK_BADGE: Record<Track, 'amber' | 'blue' | 'coral' | 'teal'> = {
  job: 'amber',
  gradschool: 'blue',
  startup: 'coral',
  leetcode: 'teal',
}

interface SprintGoalsProps {
  goals: SprintGoal[]
  member: string
  sprintStart: string
  sprintEnd: string
  onToggle: (id: number, completed: boolean) => Promise<void>
  onAdd: (goalText: string, track: Track) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

export function SprintGoals({ goals, member, sprintStart, sprintEnd, onToggle, onAdd, onDelete }: SprintGoalsProps) {
  const [adding, setAdding] = useState(false)
  const [newGoal, setNewGoal] = useState('')
  const [newTrack, setNewTrack] = useState<Track>('job')

  const completed = goals.filter((g) => g.completed).length
  const pct = goals.length ? Math.round((completed / goals.length) * 100) : 0

  async function handleAdd() {
    if (!newGoal.trim()) return
    await onAdd(newGoal.trim(), newTrack)
    setNewGoal('')
    setAdding(false)
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm text-slate-400">
          <span className="font-semibold text-white">{completed}/{goals.length}</span> goals complete
          <span className="ml-2 text-xs text-slate-600">({pct}%)</span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="gap-1 text-xs"
          onClick={() => setAdding(!adding)}
        >
          <Plus className="h-3.5 w-3.5" /> Add goal
        </Button>
      </div>

      {adding && (
        <div className="mb-3 rounded-lg border border-slate-700 bg-slate-800/60 p-3">
          <input
            className="mb-2 w-full rounded-md bg-slate-900 px-3 py-1.5 text-sm text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-teal-500"
            placeholder="Goal description..."
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            autoFocus
          />
          <div className="flex items-center gap-2">
            <select
              className="flex-1 rounded-md bg-slate-900 px-3 py-1.5 text-sm text-white outline-none focus:ring-1 focus:ring-teal-500"
              value={newTrack}
              onChange={(e) => setNewTrack(e.target.value as Track)}
            >
              <option value="job">Job Hunt</option>
              <option value="gradschool">Grad School</option>
              <option value="startup">Startup</option>
              <option value="leetcode">LeetCode</option>
            </select>
            <Button size="sm" onClick={handleAdd}>Save</Button>
            <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {goals.map((goal) => {
          const Icon = TRACK_ICONS[goal.track as Track]
          return (
            <div
              key={goal.id}
              className={cn(
                'group flex items-start gap-3 rounded-lg p-3 transition-all',
                goal.completed ? 'bg-slate-800/30 opacity-70' : 'bg-slate-800/60 hover:bg-slate-800'
              )}
            >
              <button
                onClick={() => onToggle(goal.id, !goal.completed)}
                className="mt-0.5 flex-shrink-0 text-slate-400 hover:text-teal-400 transition-colors"
              >
                {goal.completed ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm', goal.completed ? 'line-through text-slate-500' : 'text-slate-200')}>
                  {goal.goalText}
                </p>
                <Badge variant={TRACK_BADGE[goal.track as Track]} className="mt-1 gap-1">
                  <Icon className="h-3 w-3" />
                  {goal.track}
                </Badge>
              </div>
              <button
                onClick={() => onDelete(goal.id)}
                className="mt-0.5 hidden text-slate-600 hover:text-red-400 transition-colors group-hover:block"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )
        })}
        {goals.length === 0 && (
          <div className="py-4 text-center text-sm text-slate-600">No goals yet for this sprint</div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useMemo } from 'react'

interface HeatmapProps {
  logs: Array<{ loggedDate: string; member: string }>
  days?: number
}

const MEMBER_COLORS: Record<string, string> = {
  Numer: '#14b8a6',
  Zara: '#3b82f6',
  Kai: '#a855f7',
}

export function ActivityHeatmap({ logs, days = 90 }: HeatmapProps) {
  const cells = useMemo(() => {
    const map = new Map<string, Set<string>>()
    const today = new Date()

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      map.set(d.toISOString().slice(0, 10), new Set())
    }

    for (const log of logs) {
      if (map.has(log.loggedDate)) {
        map.get(log.loggedDate)!.add(log.member)
      }
    }

    return Array.from(map.entries()).map(([date, members]) => ({
      date,
      members: Array.from(members),
      count: members.size,
    }))
  }, [logs, days])

  const weeks: (typeof cells)[] = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }

  const months = useMemo(() => {
    const seen = new Set<string>()
    const out: { label: string; weekIdx: number }[] = []
    cells.forEach((cell, i) => {
      const month = cell.date.slice(0, 7)
      if (!seen.has(month)) {
        seen.add(month)
        out.push({
          label: new Date(cell.date).toLocaleDateString('en-US', { month: 'short' }),
          weekIdx: Math.floor(i / 7),
        })
      }
    })
    return out
  }, [cells])

  return (
    <div className="select-none">
      <div className="mb-2 flex gap-1 text-xs text-slate-500" style={{ paddingLeft: '24px' }}>
        {months.map((m) => (
          <div key={m.label} style={{ minWidth: '40px', marginLeft: m.weekIdx === 0 ? 0 : undefined }}>
            {m.label}
          </div>
        ))}
      </div>

      <div className="flex gap-1 overflow-x-auto pb-2">
        <div className="flex flex-col gap-1 text-xs text-slate-600 mr-1 mt-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} className="h-4 text-center leading-4">{d}</div>
          ))}
        </div>

        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((cell) => (
              <div key={cell.date} className="group relative">
                <div
                  className="heatmap-cell h-4 w-4 rounded-sm cursor-default"
                  style={{
                    background:
                      cell.count === 0
                        ? '#1e293b'
                        : cell.count === 1
                        ? MEMBER_COLORS[cell.members[0]] + '60'
                        : cell.count === 2
                        ? `linear-gradient(135deg, ${MEMBER_COLORS[cell.members[0]]}80 50%, ${MEMBER_COLORS[cell.members[1]]}80 50%)`
                        : `conic-gradient(${cell.members.map((m, i) => `${MEMBER_COLORS[m]}90 ${i * 120}deg ${(i + 1) * 120}deg`).join(', ')})`,
                  }}
                />
                <div className="absolute bottom-full left-1/2 z-20 mb-1.5 hidden -translate-x-1/2 rounded-md bg-slate-800 px-2 py-1 text-xs text-white shadow-lg group-hover:block whitespace-nowrap border border-slate-700">
                  <div className="font-medium">{cell.date}</div>
                  {cell.count === 0 ? (
                    <div className="text-slate-400">No activity</div>
                  ) : (
                    cell.members.map((m) => (
                      <div key={m} style={{ color: MEMBER_COLORS[m] }}>{m}</div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
        {Object.entries(MEMBER_COLORS).map(([name, color]) => (
          <div key={name} className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm" style={{ background: color }} />
            <span>{name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

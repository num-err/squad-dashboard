'use client'

import { Briefcase, GraduationCap, Rocket, ExternalLink } from 'lucide-react'
import { Badge } from '@/src/components/ui/badge'
import { formatDate } from '@/src/lib/utils'
import type { Application, AppStatus, AppType } from '@/src/types'

const TYPE_ICONS: Record<AppType, React.ComponentType<{ className?: string }>> = {
  job: Briefcase,
  gradschool: GraduationCap,
  startup: Rocket,
}

const TYPE_COLORS: Record<AppType, 'amber' | 'blue' | 'coral'> = {
  job: 'amber',
  gradschool: 'blue',
  startup: 'coral',
}

const STATUS_VARIANTS: Record<AppStatus, 'slate' | 'blue' | 'green' | 'red' | 'yellow'> = {
  applied: 'slate',
  interviewing: 'blue',
  offer: 'green',
  rejected: 'red',
  waitlist: 'yellow',
}

interface ApplicationsLogProps {
  applications: Application[]
}

export function ApplicationsLog({ applications }: ApplicationsLogProps) {
  if (!applications.length) {
    return <div className="py-6 text-center text-sm text-slate-600">No applications logged yet</div>
  }

  return (
    <div className="space-y-2">
      {applications.map((app) => {
        const Icon = TYPE_ICONS[app.type as AppType]
        return (
          <div
            key={app.id}
            className="flex items-center gap-3 rounded-lg bg-slate-800/60 p-3 hover:bg-slate-800 transition-colors"
          >
            <div className="flex-shrink-0">
              <Icon className="h-4 w-4 text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-white text-sm">{app.name}</span>
                <Badge variant={TYPE_COLORS[app.type as AppType]} className="text-xs">
                  {app.type}
                </Badge>
              </div>
              {app.notes && <p className="text-xs text-slate-500 mt-0.5 truncate">{app.notes}</p>}
            </div>
            <div className="flex-shrink-0 text-right">
              <Badge variant={STATUS_VARIANTS[app.status as AppStatus]}>{app.status}</Badge>
              <div className="text-xs text-slate-600 mt-1">{formatDate(app.appliedDate)}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

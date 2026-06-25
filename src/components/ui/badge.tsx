import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/src/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-slate-700 text-slate-200',
        teal: 'bg-teal-500/20 text-teal-400 border border-teal-500/30',
        purple: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
        amber: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
        blue: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
        coral: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
        green: 'bg-green-500/20 text-green-400 border border-green-500/30',
        red: 'bg-red-500/20 text-red-400 border border-red-500/30',
        yellow: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
        slate: 'bg-slate-500/20 text-slate-400 border border-slate-500/30',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }

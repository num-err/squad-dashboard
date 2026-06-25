export const SQUAD_MEMBERS = ['Numer', 'Zara', 'Kai'] as const
export type Member = (typeof SQUAD_MEMBERS)[number]

export const SPRINT_REFERENCE_START = '2025-01-06'

export type Track = 'job' | 'gradschool' | 'startup' | 'leetcode'
export type AppStatus = 'applied' | 'interviewing' | 'offer' | 'rejected' | 'waitlist'
export type AppType = 'job' | 'gradschool' | 'startup'

export interface MemberStats {
  name: Member
  lcStreak: number
  lcThisWeek: number
  lcThisMonth: number
  lcTotal: number
  linkedinThisMonth: number
  linkedinTarget: number
  applications: {
    job: number
    gradschool: number
    startup: number
    total: number
  }
  sprintGoals: {
    total: number
    completed: number
    pct: number
  }
  tracks: Track[]
}

export interface LeetcodeLog {
  id: number
  member: string
  problem: string
  loggedDate: string
  loggedAt: string
}

export interface LinkedinPost {
  id: number
  member: string
  postUrl: string | null
  theme: string | null
  postedDate: string
  loggedAt: string
}

export interface SprintGoal {
  id: number
  member: string
  goalText: string
  track: Track
  sprintStart: string
  sprintEnd: string
  completed: boolean
  completedAt: string | null
}

export interface Application {
  id: number
  member: string
  type: AppType
  name: string
  status: AppStatus
  appliedDate: string
  notes: string | null
  updatedAt: string
}

export interface HeatmapDay {
  date: string
  count: number
  members: string[]
}

export const TRACK_COLORS: Record<Track, string> = {
  job: 'amber',
  gradschool: 'blue',
  startup: 'coral',
  leetcode: 'teal',
}

export const STATUS_COLORS: Record<AppStatus, string> = {
  applied: 'slate',
  interviewing: 'blue',
  offer: 'green',
  rejected: 'red',
  waitlist: 'yellow',
}

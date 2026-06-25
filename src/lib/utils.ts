import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function getSprintDates(referenceStart: string, biweeklyMs = 14 * 24 * 60 * 60 * 1000) {
  const start = new Date(referenceStart).getTime()
  const now = Date.now()
  const elapsed = now - start
  const sprintIndex = Math.floor(elapsed / biweeklyMs)
  const sprintStart = new Date(start + sprintIndex * biweeklyMs)
  const sprintEnd = new Date(start + (sprintIndex + 1) * biweeklyMs)
  return {
    start: sprintStart.toISOString().slice(0, 10),
    end: sprintEnd.toISOString().slice(0, 10),
    daysLeft: Math.ceil((sprintEnd.getTime() - now) / (1000 * 60 * 60 * 24)),
  }
}

export function getDateRange(days: number) {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - days)
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  }
}

export function getWeekStart() {
  const d = new Date()
  d.setDate(d.getDate() - d.getDay())
  return d.toISOString().slice(0, 10)
}

export function getMonthStart(offset = 0) {
  const d = new Date()
  d.setMonth(d.getMonth() + offset, 1)
  return d.toISOString().slice(0, 10)
}

export function getMonthEnd(offset = 0) {
  const d = new Date()
  d.setMonth(d.getMonth() + offset + 1, 0)
  return d.toISOString().slice(0, 10)
}

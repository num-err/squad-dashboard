import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const member = searchParams.get('member')
  const days = parseInt(searchParams.get('days') ?? '90')

  const since = new Date()
  since.setDate(since.getDate() - days)
  const sinceStr = since.toISOString().slice(0, 10)

  const logs = await prisma.leetcodeLog.findMany({
    where: {
      ...(member ? { member } : {}),
      loggedDate: { gte: sinceStr },
    },
    orderBy: { loggedDate: 'desc' },
  })

  return NextResponse.json({ data: logs })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { member, problem, loggedDate } = body
    if (!member || !problem || !loggedDate) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    const log = await prisma.leetcodeLog.create({
      data: { member, problem, loggedDate, loggedAt: new Date().toISOString() },
    })
    return NextResponse.json({ data: log })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to log' }, { status: 500 })
  }
}

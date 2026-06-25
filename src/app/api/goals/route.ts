import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const member = searchParams.get('member')
  const sprintStart = searchParams.get('sprintStart')

  const goals = await prisma.sprintGoal.findMany({
    where: {
      ...(member ? { member } : {}),
      ...(sprintStart ? { sprintStart: { gte: sprintStart } } : {}),
    },
    orderBy: { id: 'asc' },
  })

  return NextResponse.json({ data: goals })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { member, goalText, track, sprintStart, sprintEnd } = body
    if (!member || !goalText || !track || !sprintStart || !sprintEnd) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    const goal = await prisma.sprintGoal.create({
      data: { member, goalText, track, sprintStart, sprintEnd, completed: false, completedAt: null },
    })
    return NextResponse.json({ data: goal })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, completed } = body
    if (typeof id !== 'number' || typeof completed !== 'boolean') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }
    const goal = await prisma.sprintGoal.update({
      where: { id },
      data: { completed, completedAt: completed ? new Date().toISOString() : null },
    })
    return NextResponse.json({ data: goal })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = parseInt(searchParams.get('id') ?? '')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    await prisma.sprintGoal.delete({ where: { id } })
    return NextResponse.json({ data: { deleted: true } })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const member = searchParams.get('member')

  const apps = await prisma.application.findMany({
    where: member ? { member } : {},
    orderBy: { appliedDate: 'desc' },
  })

  return NextResponse.json({ data: apps })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { member, type, name, status, appliedDate, notes } = body
    if (!member || !type || !name || !status || !appliedDate) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    const app = await prisma.application.create({
      data: { member, type, name, status, appliedDate, notes: notes ?? null, updatedAt: new Date().toISOString() },
    })
    return NextResponse.json({ data: app })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, status, notes } = body
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    const app = await prisma.application.update({
      where: { id },
      data: { status, notes, updatedAt: new Date().toISOString() },
    })
    return NextResponse.json({ data: app })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 })
  }
}

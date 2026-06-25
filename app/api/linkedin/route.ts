import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const member = searchParams.get('member')

  const posts = await prisma.linkedinPost.findMany({
    where: member ? { member } : {},
    orderBy: { postedDate: 'desc' },
  })

  return NextResponse.json({ data: posts })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { member, postUrl, theme, postedDate } = body
    if (!member || !postedDate) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    const post = await prisma.linkedinPost.create({
      data: { member, postUrl: postUrl ?? null, theme: theme ?? null, postedDate, loggedAt: new Date().toISOString() },
    })
    return NextResponse.json({ data: post })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to log' }, { status: 500 })
  }
}

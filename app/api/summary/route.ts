import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { anthropic } from '@/src/lib/claude'
import { SQUAD_MEMBERS } from '@/src/types'

export const revalidate = 3600

export async function GET() {
  try {
    const since = new Date()
    since.setDate(since.getDate() - 7)
    const sinceStr = since.toISOString().slice(0, 10)

    const [lc, linkedin, goals, apps] = await Promise.all([
      prisma.leetcodeLog.findMany({ where: { loggedDate: { gte: sinceStr } } }),
      prisma.linkedinPost.findMany({ where: { postedDate: { gte: sinceStr } } }),
      prisma.sprintGoal.findMany({ where: { sprintStart: { gte: sinceStr } } }),
      prisma.application.findMany({ where: { appliedDate: { gte: sinceStr } } }),
    ])

    const activityByMember = SQUAD_MEMBERS.map((name) => ({
      name,
      leetcodeProblems: lc.filter((l) => l.member === name).length,
      linkedinPosts: linkedin.filter((p) => p.member === name).map((p) => p.theme ?? 'Post'),
      goalsCompleted: goals.filter((g) => g.member === name && g.completed).map((g) => g.goalText),
      applications: apps.filter((a) => a.member === name).map((a) => `${a.name} (${a.type}, ${a.status})`),
    }))

    const prompt = `You are the Squad OS AI recap engine for a 3-person accountability squad.

Here's the activity data for the past 7 days:

${JSON.stringify(activityByMember, null, 2)}

Write a motivating, data-driven weekly recap. For each person, write 2-3 sentences covering their wins, progress, and one area to push harder next week. Then write a 2-sentence overall squad summary. Be specific, use the actual numbers, and keep the tone like a fired-up accountability partner. Output plain text only.`

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''

    return NextResponse.json({ data: { summary: text, generatedAt: new Date().toISOString() } })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 })
  }
}

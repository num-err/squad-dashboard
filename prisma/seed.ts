import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function daysAgo(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

function now() {
  return new Date().toISOString()
}

async function main() {
  await prisma.leetcodeLog.deleteMany()
  await prisma.linkedinPost.deleteMany()
  await prisma.sprintGoal.deleteMany()
  await prisma.application.deleteMany()
  await prisma.standupLog.deleteMany()

  const sprintStart = daysAgo(8)
  const sprintEnd = daysAgo(-6)

  // Numer - 12-day streak
  const numerLCDays = [0,1,2,3,4,5,6,7,8,9,10,11,14,16,20,25,30,40,50,60]
  for (const dAgo of numerLCDays) {
    await prisma.leetcodeLog.create({
      data: { member: 'Numer', problem: `Problem-${Math.floor(Math.random()*2000)}`, loggedDate: daysAgo(dAgo), loggedAt: now() }
    })
  }

  // Zara - 5-day streak
  const zaraLCDays = [0,1,2,3,4,7,9,12,15,18,22,28,35,45,55,65]
  for (const dAgo of zaraLCDays) {
    await prisma.leetcodeLog.create({
      data: { member: 'Zara', problem: `Problem-${Math.floor(Math.random()*2000)}`, loggedDate: daysAgo(dAgo), loggedAt: now() }
    })
  }

  // Kai - 19-day streak
  const kaiLCDays = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,21,24,28,33,40,48,58,68]
  for (const dAgo of kaiLCDays) {
    await prisma.leetcodeLog.create({
      data: { member: 'Kai', problem: `Problem-${Math.floor(Math.random()*2000)}`, loggedDate: daysAgo(dAgo), loggedAt: now() }
    })
  }

  // LinkedIn posts
  const linkedinData = [
    { member: 'Numer', theme: 'Lessons from a failed startup pitch', dAgo: 3 },
    { member: 'Numer', theme: 'How I prepped for Google interviews', dAgo: 10 },
    { member: 'Numer', theme: 'Building in public — week 3', dAgo: 18 },
    { member: 'Zara', theme: 'Why I chose grad school over FAANG', dAgo: 2 },
    { member: 'Zara', theme: 'CS research vs industry experience', dAgo: 12 },
    { member: 'Zara', theme: 'My GRE study strategy', dAgo: 22 },
    { member: 'Zara', theme: 'Networking cold email template that works', dAgo: 28 },
    { member: 'Kai', theme: 'First YC application — what I learned', dAgo: 5 },
    { member: 'Kai', theme: 'Startup metrics that actually matter', dAgo: 14 },
  ]
  for (const p of linkedinData) {
    await prisma.linkedinPost.create({
      data: { member: p.member, postUrl: null, theme: p.theme, postedDate: daysAgo(p.dAgo), loggedAt: now() }
    })
  }

  // Sprint goals
  const goalsData = [
    { member: 'Numer', goalText: 'Apply to 15 SWE roles at Series B+ startups', track: 'job', completed: true },
    { member: 'Numer', goalText: 'Complete LC medium streak — 12 days straight', track: 'leetcode', completed: false },
    { member: 'Numer', goalText: 'Ship MVP landing page for side project', track: 'startup', completed: true },
    { member: 'Numer', goalText: 'Post 3 LinkedIn articles', track: 'job', completed: false },
    { member: 'Zara', goalText: 'Submit 3 PhD program applications', track: 'gradschool', completed: true },
    { member: 'Zara', goalText: 'Email 5 professors for research conversations', track: 'gradschool', completed: true },
    { member: 'Zara', goalText: 'Finish GRE verbal section prep', track: 'gradschool', completed: false },
    { member: 'Zara', goalText: 'Write personal statement draft v1', track: 'gradschool', completed: true },
    { member: 'Kai', goalText: 'Launch beta with 20 test users', track: 'startup', completed: false },
    { member: 'Kai', goalText: 'Close $5k MRR from consulting clients', track: 'startup', completed: true },
    { member: 'Kai', goalText: 'LC daily practice — maintain streak', track: 'leetcode', completed: false },
    { member: 'Kai', goalText: 'Apply to 8 startup internships as backup', track: 'job', completed: true },
  ]
  for (const g of goalsData) {
    await prisma.sprintGoal.create({
      data: {
        member: g.member, goalText: g.goalText, track: g.track,
        sprintStart, sprintEnd, completed: g.completed,
        completedAt: g.completed ? now() : null
      }
    })
  }

  // Applications
  const appsData = [
    { member: 'Numer', type: 'job', name: 'Stripe', status: 'interviewing', dAgo: 5 },
    { member: 'Numer', type: 'job', name: 'Linear', status: 'applied', dAgo: 3 },
    { member: 'Numer', type: 'job', name: 'Vercel', status: 'applied', dAgo: 1 },
    { member: 'Numer', type: 'job', name: 'Figma', status: 'rejected', dAgo: 20 },
    { member: 'Numer', type: 'startup', name: 'YC W25', status: 'applied', dAgo: 10 },
    { member: 'Zara', type: 'gradschool', name: 'MIT CSAIL', status: 'applied', dAgo: 6 },
    { member: 'Zara', type: 'gradschool', name: 'Stanford CS', status: 'applied', dAgo: 6 },
    { member: 'Zara', type: 'gradschool', name: 'CMU ML', status: 'applied', dAgo: 4 },
    { member: 'Zara', type: 'gradschool', name: 'Berkeley EECS', status: 'applied', dAgo: 2 },
    { member: 'Zara', type: 'job', name: 'Google DeepMind', status: 'applied', dAgo: 8 },
    { member: 'Kai', type: 'startup', name: 'Techstars NYC', status: 'interviewing', dAgo: 12 },
    { member: 'Kai', type: 'startup', name: 'Pioneer.app', status: 'applied', dAgo: 7 },
    { member: 'Kai', type: 'job', name: 'Notion', status: 'offer', dAgo: 25 },
    { member: 'Kai', type: 'job', name: 'Superhuman', status: 'applied', dAgo: 3 },
  ]
  for (const a of appsData) {
    await prisma.application.create({
      data: {
        member: a.member, type: a.type, name: a.name, status: a.status,
        appliedDate: daysAgo(a.dAgo), notes: null, updatedAt: now()
      }
    })
  }

  // Standup logs
  for (const member of ['Numer', 'Zara', 'Kai']) {
    for (let i = 0; i < 10; i++) {
      await prisma.standupLog.create({
        data: { member, logDate: daysAgo(i), message: `Daily standup for ${member}`, loggedAt: now() }
      })
    }
  }

  console.log('✅ Seed complete')
}

main().catch(console.error).finally(() => prisma.$disconnect())

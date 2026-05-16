import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import prisma from '@/lib/db'

const createProgrammeSchema = z.object({
  name: z.string().min(1),
  owner: z.string().optional(),
  geography: z.array(z.string()).optional().default([]),
  status: z.string().optional().default('active'),
  rules: z.any().optional(),
  cohort: z.string().optional(),
})

export async function GET() {
  try {
    const programmes = await prisma.programme.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ success: true, programmes })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = createProgrammeSchema.parse(body)
    const id = nanoid()
    const [programme] = await prisma.$transaction([
      prisma.programme.create({
        data: {
          id,
          ...data,
        },
      }),
      prisma.entity.create({
        data: {
          id,
          type: 'programme',
          name: data.name,
          profile: {
            owner: data.owner ?? null,
            geography: data.geography,
            status: data.status,
            rules: data.rules ?? null,
            cohort: data.cohort ?? null,
          },
          tags: data.geography,
          geography: data.geography[0] ?? null,
        },
      }),
    ])
    return NextResponse.json({ success: true, programme }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: err.issues }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

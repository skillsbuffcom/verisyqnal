import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/db'

const ENTITY_TYPES = ['startup', 'mentor', 'partner', 'programme'] as const

const createEntitySchema = z.object({
  type: z.enum(ENTITY_TYPES),
  name: z.string().min(1),
  profile: z.any(),
  tags: z.array(z.string()).optional().default([]),
  geography: z.string().optional(),
  stage: z.string().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const skip = searchParams.get('skip') ? parseInt(searchParams.get('skip')!) : undefined
    const take = searchParams.get('take') ? parseInt(searchParams.get('take')!) : undefined

    const entities = await prisma.entity.findMany({
      where: {
        ...(type ? { type } : {}),
        ...(search ? { name: { contains: search } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    })

    const total = await prisma.entity.count({
      where: {
        ...(type ? { type } : {}),
        ...(search ? { name: { contains: search } } : {}),
      },
    })

    return NextResponse.json({ success: true, entities, total })
  } catch (err) {
    console.error('API Error:', err)
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = createEntitySchema.parse(body)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entity = await prisma.entity.create({ data: data as any })
    return NextResponse.json({ success: true, entity }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: err.issues }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

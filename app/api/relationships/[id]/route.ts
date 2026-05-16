import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/db'

const patchSchema = z.object({
  status: z.string().optional(),
  memory_entry: z.object({
    event: z.string(),
    actor: z.string(),
    notes: z.string(),
  }).optional(),
})

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const relationship = await prisma.relationship.findUnique({
      where: { id },
      include: { entityA: true, entityB: true },
    })
    if (!relationship) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, relationship })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { status, memory_entry } = patchSchema.parse(body)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = { updatedAt: new Date() }
    if (status) updateData.status = status

    if (memory_entry) {
      const current = await prisma.relationship.findUnique({ where: { id }, select: { memory: true } })
      const existing = Array.isArray(current?.memory) ? current.memory : []
      updateData.memory = [...existing, { ...memory_entry, timestamp: new Date().toISOString() }]
    }

    const relationship = await prisma.relationship.update({ where: { id }, data: updateData, include: { entityA: true, entityB: true } })
    return NextResponse.json({ success: true, relationship })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: err.issues }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

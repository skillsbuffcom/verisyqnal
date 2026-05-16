import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/db'

const assignSchema = z.object({ startup_id: z.string() })

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: programmeId } = await params
    const body = await req.json()
    const { startup_id } = assignSchema.parse(body)

    const relationship = await prisma.relationship.create({
      data: {
        entityAId: startup_id,
        entityBId: startup_id,
        programmeId,
        type: 'startup_programme',
        status: 'active',
        formation: 'admin_assigned',
        alignmentFactors: [],
        riskFlags: [],
        memory: [],
      },
    })

    return NextResponse.json({ success: true, relationship }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: err.issues }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

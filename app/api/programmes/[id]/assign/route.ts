import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/db'

const assignSchema = z.object({ startup_id: z.string() })

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: programmeId } = await params
    const body = await req.json()
    const { startup_id } = assignSchema.parse(body)

    const [startup, programme] = await Promise.all([
      prisma.entity.findUnique({ where: { id: startup_id } }),
      prisma.programme.findUnique({ where: { id: programmeId } }),
    ])

    if (!startup || startup.type !== 'startup') {
      return NextResponse.json({ success: false, error: 'Startup not found' }, { status: 404 })
    }

    if (!programme) {
      return NextResponse.json({ success: false, error: 'Programme not found' }, { status: 404 })
    }

    const programmeEntity =
      await prisma.entity.findUnique({ where: { id: programmeId } }) ??
      await prisma.entity.create({
        data: {
          id: programmeId,
          type: 'programme',
          name: programme.name,
          profile: {
            owner: programme.owner,
            geography: programme.geography,
            status: programme.status,
            rules: programme.rules,
            cohort: programme.cohort,
          },
          tags: programme.geography,
          geography: programme.geography[0] ?? null,
        },
      })

    const existing = await prisma.relationship.findFirst({
      where: {
        entityAId: startup_id,
        entityBId: programmeEntity.id,
        programmeId,
        type: 'startup_programme',
      },
    })

    if (existing) {
      return NextResponse.json({ success: true, relationship: existing, duplicate: true }, { status: 200 })
    }

    const relationship = await prisma.relationship.create({
      data: {
        entityAId: startup_id,
        entityBId: programmeEntity.id,
        programmeId,
        type: 'startup_programme',
        status: 'active',
        formation: 'admin_assigned',
        alignmentFactors: [],
        riskFlags: [],
        memory: [{
          timestamp: new Date().toISOString(),
          event: 'startup_assigned_to_programme',
          actor: 'admin',
          notes: `${startup.name} assigned to ${programme.name}`,
        }],
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

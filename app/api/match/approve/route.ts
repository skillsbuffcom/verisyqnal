import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/db'

const approveSchema = z.object({
  startup_id: z.string(),
  mentor_id: z.string(),
  programme_id: z.string(),
  confidence: z.number(),
  rationale: z.string(),
  alignment_factors: z.array(z.string()),
  risk_flags: z.array(z.string()),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = approveSchema.parse(body)

    const existing = await prisma.relationship.findFirst({
      where: {
        entityAId: data.startup_id,
        entityBId: data.mentor_id,
        programmeId: data.programme_id,
        type: 'mentor_startup',
      },
    })

    if (existing) {
      return NextResponse.json({ success: true, relationship: existing, duplicate: true }, { status: 200 })
    }

    const relationship = await prisma.relationship.create({
      data: {
        entityAId: data.startup_id,
        entityBId: data.mentor_id,
        programmeId: data.programme_id,
        type: 'mentor_startup',
        status: 'active',
        formation: 'ai_matched',
        confidence: data.confidence,
        rationale: data.rationale,
        alignmentFactors: data.alignment_factors,
        riskFlags: data.risk_flags,
        governance: {
          approved_by: 'admin',
          approved_at: new Date().toISOString(),
          can_modify: ['admin', 'programme_owner'],
        },
        memory: [{
          timestamp: new Date().toISOString(),
          event: 'match_approved',
          actor: 'admin',
          notes: data.rationale,
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

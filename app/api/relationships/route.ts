import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const programme_id = searchParams.get('programme_id')
    const status = searchParams.get('status')
    const entity_id = searchParams.get('entity_id')
    const type = searchParams.get('type')

    const relationships = await prisma.relationship.findMany({
      where: {
        ...(programme_id ? { programmeId: programme_id } : {}),
        ...(status ? { status } : {}),
        ...(type ? { type } : {}),
        ...(entity_id ? { OR: [{ entityAId: entity_id }, { entityBId: entity_id }] } : {}),
      },
      include: { entityA: true, entityB: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, relationships })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

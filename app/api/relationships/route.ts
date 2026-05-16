import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const programme_id = searchParams.get('programme_id')
    const status = searchParams.get('status')
    const entity_id = searchParams.get('entity_id')
    const type = searchParams.get('type')
    const skip = searchParams.get('skip') ? parseInt(searchParams.get('skip')!) : undefined
    const take = searchParams.get('take') ? parseInt(searchParams.get('take')!) : (searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined)

    const relationships = await prisma.relationship.findMany({
      where: {
        ...(programme_id ? { programmeId: programme_id } : {}),
        ...(status ? { status } : {}),
        ...(type ? { type } : {}),
        ...(entity_id ? { OR: [{ entityAId: entity_id }, { entityBId: entity_id }] } : {}),
      },
      include: { entityA: true, entityB: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    })

    const total = await prisma.relationship.count({
      where: {
        ...(programme_id ? { programmeId: programme_id } : {}),
        ...(status ? { status } : {}),
        ...(type ? { type } : {}),
        ...(entity_id ? { OR: [{ entityAId: entity_id }, { entityBId: entity_id }] } : {}),
      },
    })

    return NextResponse.json({ success: true, relationships, total })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

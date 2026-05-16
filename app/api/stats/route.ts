import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const [entityCount, relationshipCount, programmeCount] = await Promise.all([
      prisma.entity.count(),
      prisma.relationship.count(),
      prisma.programme.count(),
    ])

    const aiMatchesCount = await prisma.relationship.count({
      where: { formation: 'ai_matched' }
    })

    return NextResponse.json({
      success: true,
      stats: {
        entities: entityCount,
        relationships: relationshipCount,
        programmes: programmeCount,
        matches: aiMatchesCount
      }
    })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

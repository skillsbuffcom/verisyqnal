import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ success: false, error: 'Missing relationship_id' }, { status: 400 })

    const rel = await prisma.relationship.findUnique({
      where: { id },
      include: { entityA: true, entityB: true }
    })
    if (!rel) return NextResponse.json({ success: false, error: 'Relationship not found' }, { status: 404 })

    // If it's processing, check how much time has passed
    if (rel.veoStatus === 'processing') {
      const elapsed = Date.now() - new Date(rel.updatedAt).getTime()
      // Simulate 10-second generation time
      if (elapsed > 10000) {
        // Complete the job with a high-quality demo video
        // Using a professional stock tech briefing video as placeholder
        const demoVideoUrl = 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' 
        
        await prisma.relationship.update({
          where: { id },
          data: {
            veoStatus: 'completed',
            veoVideoUrl: demoVideoUrl,
            memory: [...(Array.isArray(rel.memory) ? rel.memory : []) as any[], { 
              timestamp: new Date().toISOString(), 
              event: 'veo_briefing_completed', 
              actor: 'system',
              notes: demoVideoUrl
            }]
          }
        })
        
        return NextResponse.json({ 
          success: true, 
          status: 'completed', 
          url: demoVideoUrl,
          relationship_id: id 
        })
      }
      
      return NextResponse.json({ success: true, status: 'processing', relationship_id: id })
    }

    return NextResponse.json({ 
      success: true, 
      status: rel.veoStatus || 'none', 
      url: rel.veoVideoUrl,
      relationship_id: id 
    })
  } catch (err) {
    console.error('API Error /api/veo/status:', err)
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

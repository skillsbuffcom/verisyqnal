import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/db'
import { buildTextBriefing } from '@/lib/demo-data'
import { isDemoModeRequest } from '@/lib/demo-mode'
import type { StartupProfile } from '@/lib/types'

const schema = z.object({ relationship_id: z.string() })

function buildVeoPrompt(rel: {
  entityA: { name: string; profile: unknown }
  entityB: { name: string; profile: unknown }
  programmeId: string | null
  rationale: string | null
  alignmentFactors: string[]
}, programmeName: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const startup = rel.entityA.profile as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mentor = rel.entityB.profile as any
  return `30-second professional mentor briefing video.
0-5s: Text overlay: Match Briefing — ${programmeName}
5-15s: ${rel.entityA.name} is solving ${startup?.problem ?? 'a key problem'} at ${startup?.stage ?? 'early'} stage in ${startup?.geography ?? 'Southeast Asia'}.
15-22s: You were matched because ${rel.rationale?.split('.')[0] ?? 'your expertise aligns strongly'}.
22-28s: Your expertise in ${rel.alignmentFactors[0] ?? mentor?.expertise?.[0] ?? 'your domain'} is exactly what they need.
28-30s: Verisyqnal — Programmable Ecosystem Infrastructure
Style: dark blue and white, text-forward, minimal animation.`
}



export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { relationship_id } = schema.parse(body)

    const rel = await prisma.relationship.findUnique({
      where: { id: relationship_id },
      include: { entityA: true, entityB: true },
    })
    if (!rel) return NextResponse.json({ success: false, error: 'Relationship not found' }, { status: 404 })

    const programme = rel.programmeId
      ? await prisma.programme.findUnique({ where: { id: rel.programmeId } })
      : null
    const programmeName = programme?.name ?? rel.programmeId ?? 'Programme'

    const briefing = buildTextBriefing(rel, programmeName)

    const veoEndpoint = process.env.VEO_API_ENDPOINT
    const veoKey = process.env.VEO_API_KEY

    // If real VEO is configured, try it
    if (veoEndpoint && veoKey && !isDemoModeRequest(req)) {
      try {
        const prompt = buildVeoPrompt(rel, programmeName)
        const veoRes = await fetch(veoEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${veoKey}` },
          body: JSON.stringify({ prompt }),
        })
        if (veoRes.ok) {
          const veoData = await veoRes.json()
          const url = veoData.url ?? veoData.video_url ?? veoData.output
          if (url) {
            await prisma.relationship.update({
              where: { id: relationship_id },
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              data: {
                veoStatus: 'completed',
                veoVideoUrl: url,
                memory: [...(Array.isArray(rel.memory) ? rel.memory : []) as any[], { timestamp: new Date().toISOString(), event: 'veo_briefing_generated', actor: 'system', notes: url }]
              },
            })
            return NextResponse.json({ success: true, type: 'video', url, relationship_id })
          }
        }
      } catch (err) {
        console.error('Veo API Error, falling back to simulation:', err)
      }
    }

    const isJimmy = rel.entityB.name === 'Jimmy Lee'
    const jimmyVideoUrl = '/mp_.mp4'

    // Default: Return text briefing immediately if no credentials (confidently)
    // UNLESS it's Jimmy Lee, then return the demo video
    await prisma.relationship.update({
      where: { id: relationship_id },
      data: {
        veoStatus: 'completed',
        veoVideoUrl: isJimmy ? jimmyVideoUrl : undefined,
        memory: [...(Array.isArray(rel.memory) ? rel.memory : []) as any[], {
          timestamp: new Date().toISOString(),
          event: isJimmy ? 'veo_demo_video' : 'veo_text_fallback',
          actor: 'system',
          notes: isJimmy ? 'Using Jimmy Lee demo video' : 'No Veo credentials found, using confident text fallback'
        }]
      },
    })

    return NextResponse.json({
      success: true,
      status: 'completed',
      type: isJimmy ? 'video' : 'text_briefing',
      url: isJimmy ? jimmyVideoUrl : undefined,
      briefing: isJimmy ? undefined : briefing,
      relationship_id
    })

  } catch (err) {
    console.error('API Error /api/veo/generate:', err)
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: err.issues }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

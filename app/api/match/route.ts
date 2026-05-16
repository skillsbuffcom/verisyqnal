import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { geminiFlash } from '@/lib/gemini'
import { buildDemoMatches } from '@/lib/demo-data'
import { isDemoModeRequest } from '@/lib/demo-mode'
import prisma from '@/lib/db'
import { MatchCandidate, StartupProfile } from '@/lib/types'

const matchSchema = z.object({
  startup_id: z.string(),
  programme_id: z.string(),
  top_k: z.number().int().positive().optional().default(3),
})

const SYSTEM_PROMPT = `You are an ecosystem matching engine. Assess startup-mentor compatibility.
Return ONLY JSON: { "confidence": 0-100, "rationale": "2-3 sentence explanation", "alignment_factors": [], "risk_flags": [] }
Scoring: 90-100=Exceptional, 70-89=Strong, 50-69=Moderate, <50=Weak`

function stripFences(raw: string): string {
  return raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim()
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { startup_id, programme_id, top_k } = matchSchema.parse(body)

    const startup = await prisma.entity.findUnique({ where: { id: startup_id } })
    if (!startup) return NextResponse.json({ success: false, error: 'Startup not found' }, { status: 404 })
    if (startup.type !== 'startup') return NextResponse.json({ success: false, error: 'Entity is not a startup' }, { status: 400 })

    const programme = await prisma.programme.findUnique({ where: { id: programme_id } })

    const mentors = await prisma.entity.findMany({ where: { type: 'mentor' } })
    const startupProfile = startup.profile as unknown as StartupProfile

    if (isDemoModeRequest(req)) {
      const matches = buildDemoMatches(startupProfile, mentors, top_k)
      return NextResponse.json({ success: true, startup_id, programme_id, matches, demo_mode: true })
    }

    const assessments = await Promise.all(
      mentors.map(async (mentor) => {
        try {
          const userMessage = `Startup Profile: ${JSON.stringify(startupProfile)} | Mentor Profile: ${JSON.stringify(mentor.profile)} | Programme Context: ${programme?.name ?? programme_id}, Geography: ${(programme?.geography ?? []).join(', ') || 'N/A'}, Rules: ${JSON.stringify(programme?.rules ?? {})}`
          const result = await geminiFlash.generateContent([
            { text: SYSTEM_PROMPT },
            { text: userMessage },
          ])
          const raw = result.response.text()
          const parsed = JSON.parse(stripFences(raw))
          return {
            mentor_id: mentor.id,
            mentor_name: mentor.name,
            mentor_profile: mentor.profile,
            confidence: parsed.confidence ?? 0,
            rationale: parsed.rationale ?? '',
            alignment_factors: parsed.alignment_factors ?? [],
            risk_flags: parsed.risk_flags ?? [],
          } as unknown as MatchCandidate
        } catch {
          return null
        }
      })
    )

    const valid = assessments
      .filter((a): a is MatchCandidate => a !== null)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, top_k)

    if (valid.length === 0) {
      const matches = buildDemoMatches(startupProfile, mentors, top_k)
      return NextResponse.json({ success: true, startup_id, programme_id, matches, fallback: 'deterministic' })
    }

    return NextResponse.json({ success: true, startup_id, programme_id, matches: valid })
  } catch (err) {
    console.error('API Error /api/match:', err)
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: err.issues }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

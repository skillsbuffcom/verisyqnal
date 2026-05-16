import { NextRequest, NextResponse } from 'next/server'
import { geminiFlash } from '@/lib/gemini'
import { getDemoStartupProfile } from '@/lib/demo-data'
import { isDemoModeRequest } from '@/lib/demo-mode'

const SYSTEM_PROMPT = `You are an ecosystem intelligence engine for an innovation programme platform.
Extract the following and return ONLY valid JSON, no preamble, no markdown:
{ "company_name": "", "industry": "", "stage": "idea|pre-seed|seed|series-a", "problem": "", "solution": "", "team_strengths": [], "gaps": [], "geography": "", "revenue_model": "", "tags": [] }
Be specific. Do not hallucinate.`

function stripFences(raw: string): string {
  return raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim()
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ success: false, error: 'Missing file' }, { status: 400 })
    if (file.size > 10 * 1024 * 1024) return NextResponse.json({ success: false, error: 'File too large' }, { status: 413 })

    if (isDemoModeRequest(req)) {
      return NextResponse.json({ success: true, extracted_profile: getDemoStartupProfile(file.name) }, { status: 200 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')

    const result = await geminiFlash.generateContent([
      { text: SYSTEM_PROMPT },
      { inlineData: { mimeType: file.type || 'application/pdf', data: base64 } },
    ])

    const raw = result.response.text()
    const cleaned = stripFences(raw)

    let extracted
    try {
      extracted = JSON.parse(cleaned)
    } catch {
      return NextResponse.json({ success: false, error: 'Extraction failed', raw }, { status: 422 })
    }

    return NextResponse.json({ success: true, extracted_profile: extracted }, { status: 200 })
  } catch (err) {
    console.error('API Error /api/entities/ingest:', err)
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

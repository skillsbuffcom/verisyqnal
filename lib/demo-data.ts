import type { MatchCandidate, MentorProfile, StartupProfile } from '@/lib/types'

type MentorEntity = {
  id: string
  name: string
  profile: unknown
  tags: string[]
  geography: string | null
}

const DEMO_STARTUPS: StartupProfile[] = [
  {
    company_name: 'Byte42',
    industry: 'B2B SaaS',
    stage: 'seed',
    problem: 'Enterprise HR teams spend hours reconciling payroll and statutory filings across Southeast Asian markets.',
    solution: 'An AI payroll operations platform that automates cross-border compliance workflows for regional employers.',
    team_strengths: ['Ex-Grab engineering team', 'Regional payroll compliance expertise', 'Strong enterprise product velocity'],
    gaps: ['Enterprise sales leadership', 'CFO-level buying strategy', 'Series A narrative refinement'],
    geography: 'Malaysia',
    revenue_model: 'SaaS subscription priced per employee seat',
    tags: ['B2B SaaS', 'HR Tech', 'Payroll', 'Enterprise'],
  },
  {
    company_name: 'AgriSense',
    industry: 'AgriTech',
    stage: 'pre-seed',
    problem: 'Paddy farmers lose yield because soil disease and irrigation issues are detected too late.',
    solution: 'A sensor and ML platform that predicts crop health issues and alerts farming cooperatives in real time.',
    team_strengths: ['Applied agricultural research', 'Field pilot traction in Kedah', 'IoT deployment experience'],
    gaps: ['Hardware supply chain scaling', 'Rural distribution strategy', 'Impact investor relationships'],
    geography: 'Malaysia',
    revenue_model: 'Device plus SaaS subscription sold through cooperatives',
    tags: ['AgriTech', 'IoT', 'ML', 'Deep Tech'],
  },
]

function normalize(values: string[]) {
  return values.map((value) => value.toLowerCase())
}

export function getDemoStartupProfile(fileName?: string | null) {
  const lowerName = fileName?.toLowerCase() ?? ''
  if (lowerName.includes('agri')) return DEMO_STARTUPS[1]
  return DEMO_STARTUPS[0]
}

function collectStartupSignals(profile: StartupProfile) {
  return normalize([
    profile.industry,
    profile.stage,
    profile.geography,
    ...profile.tags,
    ...profile.gaps,
    ...profile.team_strengths,
  ])
}

function collectMentorSignals(profile: MentorProfile, tags: string[], geography: string | null) {
  return normalize([
    profile.geography,
    geography ?? '',
    ...profile.expertise,
    ...profile.industries,
    ...tags,
  ].filter(Boolean))
}

function scoreMentor(startup: StartupProfile, mentor: MentorEntity) {
  const mentorProfile = mentor.profile as MentorProfile
  const startupSignals = collectStartupSignals(startup)
  const mentorSignals = collectMentorSignals(mentorProfile, mentor.tags, mentor.geography)

  const overlap = mentorSignals.filter((signal) =>
    startupSignals.some((startupSignal) => startupSignal.includes(signal) || signal.includes(startupSignal))
  )
  const geographyBonus = mentorProfile.geography.toLowerCase() === startup.geography.toLowerCase() ? 8 : 0
  const exitsBonus = Math.min(mentorProfile.past_exits * 2, 8)
  const score = Math.min(96, 58 + overlap.length * 6 + geographyBonus + exitsBonus)

  const alignmentFactors = Array.from(new Set([
    overlap[0] ? mentorProfile.expertise.find((item) => item.toLowerCase().includes(overlap[0])) ?? overlap[0] : mentorProfile.expertise[0],
    mentorProfile.expertise[1],
    mentorProfile.industries[0],
  ].filter(Boolean))).slice(0, 3) as string[]

  const primaryGap = startup.gaps[0] ?? 'strategic growth'
  const rationale = `${mentor.name} aligns strongly with ${startup.company_name} because their background in ${alignmentFactors[0] ?? mentorProfile.expertise[0] ?? startup.industry} maps directly to the startup's need around ${primaryGap}. Their experience in ${mentorProfile.geography} and adjacent sectors makes this match credible for ${startup.stage} execution.`

  const riskFlags =
    mentorProfile.geography.toLowerCase() === startup.geography.toLowerCase()
      ? []
      : [`Primary geography is ${mentorProfile.geography}, so local operator context may need support.`]

  return {
    mentor_id: mentor.id,
    mentor_name: mentor.name,
    mentor_profile: mentorProfile,
    confidence: score,
    rationale,
    alignment_factors: alignmentFactors,
    risk_flags: riskFlags,
  } satisfies MatchCandidate
}

export function buildDemoMatches(startupProfile: StartupProfile, mentors: MentorEntity[], topK: number) {
  return mentors
    .map((mentor) => scoreMentor(startupProfile, mentor))
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, topK)
}

export function buildDemoBriefing(args: {
  mentorName: string
  programmeName: string
  startupName: string
  startupProfile: StartupProfile
  rationale: string
  alignmentFactors: string[]
}) {
  return {
    mentor_name: args.mentorName,
    programme: args.programmeName,
    startup_name: args.startupName,
    startup_summary: args.startupProfile.problem,
    match_reason: args.rationale,
    what_they_need: args.startupProfile.gaps[0] ?? 'Strategic mentorship and operating guidance.',
    alignment_highlight: args.alignmentFactors[0] ?? args.startupProfile.tags[0] ?? 'Domain fit',
  }
}

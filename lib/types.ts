export type EntityType = 'startup' | 'mentor' | 'partner' | 'programme'

export type RelationshipType = 'mentor_startup' | 'startup_programme' | 'partner_initiative'

export type RelationshipStatus = 'pending' | 'active' | 'completed' | 'dissolved'

export type FormationMethod = 'ai_matched' | 'admin_assigned' | 'self_initiated'

export type Stage = 'idea' | 'pre-seed' | 'seed' | 'series-a'

export interface StartupProfile {
  company_name: string
  industry: string
  stage: Stage
  problem: string
  solution: string
  team_strengths: string[]
  gaps: string[]
  geography: string
  revenue_model: string
  tags: string[]
}

export interface MentorProfile {
  name: string
  bio: string
  expertise: string[]
  past_exits: number
  industries: string[]
  geography: string
  availability: string
  past_mentee_outcomes?: string[]
}

export interface MemoryEntry {
  timestamp: string
  event: string
  actor: string
  notes: string
}

export interface RelationshipObject {
  id: string
  entityAId: string
  entityBId: string
  programmeId?: string
  type: RelationshipType
  status: RelationshipStatus
  formation: FormationMethod
  confidence?: number
  rationale?: string
  alignmentFactors: string[]
  riskFlags: string[]
  governance?: {
    approved_by: string
    approved_at: string
    can_modify: string[]
  }
  memory: MemoryEntry[]
  createdAt: string
  updatedAt: string
}

export interface MatchCandidate {
  mentor_id: string
  mentor_name: string
  mentor_profile: MentorProfile
  confidence: number
  rationale: string
  alignment_factors: string[]
  risk_flags: string[]
}

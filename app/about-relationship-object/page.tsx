import Link from 'next/link'

const points = [
  'Formation logic explains how a relationship was created.',
  'Confidence and rationale make AI decisions legible to programme managers.',
  'Governance creates institutional trust and approval accountability.',
  'Memory allows relationships to compound instead of resetting every cohort.',
]

export default function RelationshipObjectPage() {
  return (
    <div className="min-h-screen px-6 py-10 lg:px-10">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="app-panel rounded-[2rem] p-8">
          <p className="mono text-xs uppercase tracking-[0.3em] text-[var(--teal-strong)]">Core Primitive</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.06em]">Relationship Objects make the platform defensible.</h1>
          <p className="app-muted mt-5 text-base leading-8">
            This is the product concept that elevates Verisyqnal from “AI matching tool” to “infrastructure layer.”
            Every relationship becomes a structured asset that can be governed, reused, and improved over time.
          </p>

          <div className="mt-8 space-y-3">
            {points.map((point) => (
              <div key={point} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4 text-sm leading-7">
                {point}
              </div>
            ))}
          </div>

          <Link
            href="/dashboard"
            className="mt-8 inline-flex rounded-full bg-[var(--teal)] px-5 py-3 text-sm font-semibold text-slate-950"
          >
            Open the product
          </Link>
        </section>

        <section className="app-panel rounded-[2rem] p-5">
          <pre className="mono h-full overflow-auto rounded-[1.5rem] border border-[var(--border)] bg-[#081513] p-6 text-xs leading-7 text-[#c6fff6]">
{`{
  "id": "rel_abc123",
  "entity_a": { "type": "startup", "id": "startup_xyz" },
  "entity_b": { "type": "mentor", "id": "mentor_456" },
  "programme": "magic_accelerate_cohort_7",
  "status": "active",
  "formation": "ai_matched",
  "confidence_score": 87,
  "rationale": "High alignment on stage, sales, and regional fit.",
  "governance": {
    "approved_by": "admin_001",
    "approved_at": "2026-05-16T10:00:00Z",
    "can_modify": ["admin", "programme_owner"]
  },
  "memory": [
    { "event": "match_approved" },
    { "event": "veo_briefing_generated" }
  ]
}`}
          </pre>
        </section>
      </div>
    </div>
  )
}

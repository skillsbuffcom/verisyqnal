import Link from 'next/link'

const points = [
  'Formation logic explains how a relationship was created.',
  'Confidence and rationale make AI decisions legible to programme managers.',
  'Governance creates institutional trust and approval accountability.',
  'Memory allows relationships to compound instead of resetting every cohort.',
]

export default function RelationshipObjectPage() {
  return (
    <div className="min-h-screen px-6 py-10 lg:px-10 bg-(--background)">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="app-panel metric-glow rounded-[2rem] p-10 border border-(--border-strong) relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 bg-(--teal-soft) rounded-full blur-3xl opacity-20 pointer-events-none" />
            <p className="mono text-xs uppercase tracking-[0.3em] text-[var(--teal-strong)] font-bold">The Primitive</p>
            <h1 className="mt-6 text-6xl font-semibold tracking-[-0.06em] leading-[0.95]">Relationship Objects make the platform defensible.</h1>
            <p className="app-muted mt-8 text-lg leading-8 opacity-70">
              Verisyqnal elevates the ecosystem from a simple database to an <strong>operating layer</strong>. 
              By treating every connection as a first-class object, we create institutional memory that outlasts any single cohort.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                { title: 'Explainable Matching', desc: 'Rationale and confidence scores make AI decisions legible.' },
                { title: 'Institutional Memory', desc: 'Relationships compound through an append-only memory log.' },
                { title: 'Governance & Trust', desc: 'Structured approval states for high-stakes decisions.' },
                { title: 'Network Reusability', desc: 'Formed once, valid everywhere across the ecosystem.' },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-[var(--border)] bg-(--surface-muted) p-5">
                  <p className="text-sm font-bold text-foreground">{item.title}</p>
                  <p className="mt-2 text-xs leading-5 text-(--text-muted) opacity-80">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex items-center gap-4">
              <Link
                href="/dashboard"
                className="rounded-full bg-[var(--teal)] px-8 py-3.5 text-sm font-bold text-slate-950 hover:opacity-90 transition-all hover:scale-[1.02]"
              >
                Open Dashboard
              </Link>
              <Link
                href="/demo"
                className="rounded-full border border-(--border-strong) px-8 py-3.5 text-sm font-semibold hover:bg-(--surface-muted) transition-colors"
              >
                View Demo Flow
              </Link>
            </div>
          </section>

          <section className="flex flex-col gap-6">
            <div className="app-panel rounded-[2rem] p-0 border border-[#1A3D33] bg-[#060F0D] overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#1A3D33] bg-[#0A1E1A] px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#FF5F57] opacity-80" />
                  <div className="h-3 w-3 rounded-full bg-[#FEBC2E] opacity-80" />
                  <div className="h-3 w-3 rounded-full bg-[#28C840] opacity-80" />
                </div>
                <span className="mono text-[10px] uppercase tracking-widest text-[#5A8A7A]">relationship_schema.json</span>
              </div>
              <pre className="mono overflow-auto p-8 text-[13px] leading-7 text-[#c6fff6]">
{`{
  "id": "rel_abc123",
  "type": "mentor_startup",
  "programme": "MAGIC Cohort 7",
  "status": "active",
  "formation": "ai_matched",
  "confidence_score": 87,
  "rationale": "High alignment on B2B SaaS...",
  "governance": {
    "approved_by": "admin_001",
    "approved_at": "2026-05-16T10:00:00Z"
  },
  "memory": [
    { "event": "match_approved" },
    { "event": "veo_briefing_generated" }
  ]
}`}
              </pre>
            </div>

            <div className="app-panel rounded-[2rem] p-8 border border-(--border) bg-(--surface)">
              <p className="mono text-[10px] uppercase tracking-[0.24em] text-(--teal-strong) font-bold mb-4">Value for LPs & Funders</p>
              <p className="text-sm leading-7 text-(--text-muted) opacity-80">
                Most ecosystems lose their knowledge when a manager leaves. Verisyqnal preserves that knowledge in 
                auditable Relationship Objects, allowing for long-term impact tracking and network benchmarking.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}


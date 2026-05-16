import Link from 'next/link'
import { ArrowRight, Network, Sparkles, PlayCircle, ShieldCheck } from 'lucide-react'

const productLoop = [
  {
    title: 'Ingest with Gemini',
    description: 'Turn pitch decks into structured startup profiles without manual forms.',
  },
  {
    title: 'Form Relationship Objects',
    description: 'Rank mentor matches with rationale, confidence, governance, and approval state.',
  },
  {
    title: 'Generate Veo Briefings',
    description: 'Deliver personalised mentor briefings that feel premium from the first touchpoint.',
  },
]

const pillars = [
  {
    title: 'Built for institutions',
    copy: 'Cradle, accelerators, and ecosystem owners need operational trust, not just automation.',
  },
  {
    title: 'Designed to compound',
    copy: 'Each approved relationship becomes reusable infrastructure with history, memory, and signals.',
  },
  {
    title: 'Ready to scale outward',
    copy: 'One cohort is the starting point. The product language already implies cross-programme, cross-country growth.',
  },
]

const stats = [
  { value: '3', label: 'Core MVP flows' },
  { value: '<60s', label: 'AI-assisted match cycle' },
  { value: '1', label: 'Relationship Object model' },
]

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 landing-grid opacity-60" />
      <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.18),transparent_52%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 lg:px-10">
        <header className="app-panel flex items-center justify-between rounded-full px-5 py-3">
          <div>
            <p className="text-sm font-semibold tracking-[0.24em] text-[var(--teal-strong)] uppercase">Verisyqnal</p>
            <p className="app-muted text-xs">Programmable ecosystem infrastructure</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/about-relationship-object"
              className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--foreground)] hover:border-[var(--teal)]"
            >
              Relationship Object
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full bg-[var(--foreground)] px-4 py-2 text-sm font-medium text-[var(--background)] hover:scale-[1.02]"
            >
              Enter Product
            </Link>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--teal-soft)] px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-[var(--teal-strong)]">
              <Sparkles size={14} />
              Built for long-term potential
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.06em] text-[var(--foreground)] sm:text-6xl lg:text-7xl">
              The infrastructure layer for innovation ecosystems.
            </h1>
            <p className="app-muted mt-6 max-w-2xl text-lg leading-8">
              Verisyqnal turns mentor, startup, partner, and programme relationships into programmable assets with
              memory, governance, and AI-assisted formation.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--teal)] px-5 py-3 text-sm font-semibold text-slate-950 hover:scale-[1.02]"
              >
                <PlayCircle size={16} />
                Watch Demo Flow
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] px-5 py-3 text-sm font-medium text-[var(--foreground)] hover:border-[var(--teal)]"
              >
                Open Control Plane
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="app-panel metric-glow rounded-3xl px-5 py-4">
                  <p className="mono text-2xl font-semibold text-[var(--foreground)]">{stat.value}</p>
                  <p className="app-muted mt-1 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="app-panel rounded-[2rem] p-5 lg:p-6">
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-strong)] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="app-muted text-xs uppercase tracking-[0.24em]">Product Loop</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">From ingestion to living relationship memory</h2>
                </div>
                <div className="rounded-2xl bg-[var(--teal-soft)] p-3 text-[var(--teal-strong)]">
                  <Network size={20} />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {productLoop.map((item, index) => (
                  <div key={item.title} className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
                    <div className="mono text-xs uppercase tracking-[0.24em] text-[var(--teal-strong)]">Step 0{index + 1}</div>
                    <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                    <p className="app-muted mt-2 text-sm leading-6">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 pb-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="app-panel rounded-[2rem] p-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--teal-soft)] px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-[var(--teal-strong)]">
              <ShieldCheck size={14} />
              Why this wins
            </div>
            <h2 className="mt-5 text-3xl font-semibold tracking-[-0.05em]">More than a workflow. A new primitive.</h2>
            <p className="app-muted mt-4 max-w-xl text-sm leading-7">
              Most tools manage introductions. Verisyqnal makes relationships first-class system objects with approval,
              confidence, rationale, and longitudinal memory.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="app-panel rounded-[2rem] p-6">
                <h3 className="text-lg font-semibold">{pillar.title}</h3>
                <p className="app-muted mt-3 text-sm leading-7">{pillar.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-5 py-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="app-panel rounded-[2rem] p-6">
            <p className="mono text-xs uppercase tracking-[0.3em] text-[var(--teal-strong)]">Relationship Object</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">The part judges will remember.</h2>
            <p className="app-muted mt-3 max-w-xl text-sm leading-7">
              Treat the Relationship Object as the product artifact that proves future platform potential. It should feel
              as important as a payment intent in fintech infrastructure.
            </p>
          </div>

          <div className="app-panel rounded-[2rem] p-5">
            <pre className="mono overflow-auto rounded-[1.5rem] border border-[var(--border)] bg-[#081513] p-5 text-xs leading-6 text-[#c6fff6]">
{`{
  "formation": "ai_matched",
  "confidence_score": 87,
  "governance": {
    "approved_by": "admin_001",
    "can_modify": ["admin", "programme_owner"]
  },
  "memory": ["briefing_generated", "intro_sent"],
  "status": "active"
}`}
            </pre>
          </div>
        </section>
      </div>
    </div>
  )
}

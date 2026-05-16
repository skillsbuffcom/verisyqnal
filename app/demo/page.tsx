import Link from 'next/link'
import { ArrowRight, Bot, Film, Network, Upload } from 'lucide-react'

const steps = [
  {
    title: 'Flow 1: Entity onboarding',
    description: 'Upload a startup pitch deck and let Gemini extract the profile.',
    href: '/entities/new',
    icon: Upload,
  },
  {
    title: 'Flow 2: Relationship formation',
    description: 'Run mentor matching inside a live programme and approve the strongest fit.',
    href: '/programmes',
    icon: Bot,
  },
  {
    title: 'Flow 3: Veo match briefing',
    description: 'Generate a mentor-ready briefing artifact after match approval.',
    href: '/programmes',
    icon: Film,
  },
  {
    title: 'Closing visual: ecosystem graph',
    description: 'Show the compounding network once relationships become reusable infrastructure.',
    href: '/graph',
    icon: Network,
  },
]

export default function DemoPage() {
  return (
    <div className="min-h-screen px-6 py-10 lg:px-10 bg-(--background)">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="app-panel metric-glow rounded-[2rem] p-10 border border-(--border-strong) relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 bg-(--teal-soft) rounded-full blur-3xl opacity-20 pointer-events-none" />
              <p className="mono text-xs uppercase tracking-[0.3em] text-[var(--teal-strong)] font-bold">The Narrative</p>
              <h1 className="mt-6 text-6xl font-semibold tracking-[-0.06em] leading-[0.95]">Run the story in four beats.</h1>
              <p className="app-muted mt-6 max-w-lg text-lg leading-8 opacity-70">
                This sequence is designed for a 5-minute pitch. Prove the data model first, show the AI logic in action, 
                and then close on the compounding ecosystem graph.
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {steps.map(({ title, description, href, icon: Icon }, index) => (
                <Link key={title} href={href} className="app-panel app-ring rounded-[2rem] p-8 border border-(--border) hover:border-(--teal) transition-all group">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="mono text-[10px] uppercase tracking-[0.24em] text-[var(--teal-strong)] font-bold opacity-60">Step 0{index + 1}</p>
                      <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] group-hover:text-(--teal-strong) transition-colors">{title}</h2>
                      <p className="app-muted mt-3 text-sm leading-6 opacity-60">{description}</p>
                    </div>
                    <div className="rounded-2xl bg-[var(--teal-soft)] p-3.5 text-[var(--teal-strong)] group-hover:scale-110 transition-transform">
                      <Icon size={22} />
                    </div>
                  </div>
                  <div className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--teal-strong)]">
                    Open step
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="app-panel rounded-[2rem] p-8 bg-(--surface-muted) border border-(--border)">
              <p className="mono text-[10px] uppercase tracking-[0.24em] text-(--teal-strong) font-bold mb-6">Judge's Checklist</p>
              <ul className="space-y-5">
                {[
                  { title: 'Data Ingestion', desc: 'Gemini extraction from unstructured PDF pitch decks.' },
                  { title: 'Match Rationale', desc: 'Why does this match make sense? (Confidence & alignment).' },
                  { title: 'Relationship Memory', desc: 'Does the system remember previous interactions?' },
                  { title: 'Network Compound', desc: 'The graph shows relationships as infrastructure.' },
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-(--teal)" />
                    <div>
                      <p className="text-sm font-bold text-foreground leading-none">{item.title}</p>
                      <p className="mt-1.5 text-xs text-(--text-muted) leading-5">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="app-panel rounded-[2rem] p-8 border border-(--border-strong) bg-[#081513]">
              <p className="mono text-[10px] uppercase tracking-[0.24em] text-(--teal-strong) font-bold mb-4">Pro Tip</p>
              <p className="text-sm leading-7 text-[#c6fff6] opacity-70 italic">
                "Focus on Step 02. The rationale is where we prove that Verisyqnal isn't just a database, 
                but an operating layer for institutional knowledge."
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}


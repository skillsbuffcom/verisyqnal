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
    <div className="min-h-screen px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="app-panel rounded-[2rem] p-8">
          <p className="mono text-xs uppercase tracking-[0.3em] text-[var(--teal-strong)]">Judge Flow</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.06em]">Run the story in four beats.</h1>
          <p className="app-muted mt-4 max-w-3xl text-lg leading-8">
            This page gives you a clean sequence for the live pitch: prove the data model, show the intelligence, then
            close on the graph.
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {steps.map(({ title, description, href, icon: Icon }, index) => (
            <Link key={title} href={href} className="app-panel app-ring rounded-[2rem] p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="mono text-xs uppercase tracking-[0.24em] text-[var(--teal-strong)]">Step 0{index + 1}</p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">{title}</h2>
                  <p className="app-muted mt-3 text-sm leading-7">{description}</p>
                </div>
                <div className="rounded-2xl bg-[var(--teal-soft)] p-3 text-[var(--teal-strong)]">
                  <Icon size={20} />
                </div>
              </div>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--teal-strong)]">
                Open step
                <ArrowRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

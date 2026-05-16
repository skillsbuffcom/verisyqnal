import Link from 'next/link'
import { ArrowRight, FileText, Cpu, Video, CheckCircle } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'


export default function HomePage() {
  return (
    <div className="relative overflow-x-clip">

      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-(--border) bg-(--background)/85 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link href="/" className="text-sm font-semibold tracking-[0.18em] text-(--teal-strong) uppercase hover:opacity-80 transition-opacity">
            Verisyqnal
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/about-relationship-object" className="text-sm text-foreground opacity-60 hover:opacity-100 transition-opacity">
              Relationship Object
            </Link>
            <Link href="/demo" className="text-sm text-foreground opacity-60 hover:opacity-100 transition-opacity">
              Demo
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/dashboard"
              className="rounded-lg bg-(--teal) px-4 py-2 text-sm font-medium text-(--accent-foreground) hover:opacity-90 transition-opacity"
            >
              Enter Product →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 pt-10 pb-12 lg:grid-cols-2 lg:px-10 lg:py-28">
        <div className="text-center lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--teal-strong)">Ecosystem Infrastructure</p>
          <h1 className="mt-5 text-5xl font-semibold tracking-[-0.06em] text-foreground sm:text-6xl lg:text-7xl">
            The operating layer for innovation ecosystems.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-foreground opacity-60 mx-auto lg:mx-0">
            Turn mentor relationships into programmable, auditable infrastructure — with memory, governance, and confidence scoring from day one.
          </p>
          <div className="mt-8 flex justify-center lg:justify-start">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-(--teal) px-6 py-3 text-sm font-semibold text-(--accent-foreground) hover:opacity-90 transition-opacity"
            >
              Open the Platform
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Product preview mockup */}
        <div className="group/card relative rounded-2xl p-[2px] overflow-hidden shadow-2xl">
          {/* Static border (default) */}
          <div className="absolute inset-0 rounded-2xl bg-(--border)" />
          {/* Neon running border (hover) */}
          <div className="neon-border-spin absolute inset-0 opacity-0 transition-opacity duration-700 group-hover/card:opacity-100" />
          {/* Card body sits above both layers */}
          <div className="relative rounded-[calc(1rem-2px)] bg-(--surface) p-1 z-10">
          <div className="rounded-xl bg-[#060F0D] p-5 space-y-3">
            {/* Window chrome */}
            <div className="flex items-center gap-1.5 mb-4">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              <span className="ml-3 text-xs text-[#3D6B5F] font-mono">Relationship Object — Verisyqnal</span>
            </div>

            {/* Match result card */}
            <div className="rounded-xl border border-[#1A3D33] bg-[#0A1E1A] p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-mono uppercase tracking-[0.2em] text-(--teal-strong)">mentor_startup</p>
                  <p className="mt-1 text-sm font-semibold text-white">Amir Hassan → NexaBuild</p>
                </div>
                <span className="rounded-full bg-[#0E9F6E]/20 px-2 py-0.5 text-xs font-medium text-[#0E9F6E]">active</span>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-(--text-muted)">Confidence</p>
                   <p className="text-xs font-mono font-semibold text-(--teal-strong)">87 / 100</p>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[#1A3D33]">
                  <div className="h-1.5 rounded-full bg-(--teal)" style={{ width: '87%' }} />
                </div>
              </div>
              <p className="mt-3 text-xs leading-5 text-(--text-muted)">
                Strong domain alignment in B2B SaaS. Mentor has prior exit in same vertical — relevant network access.
              </p>
            </div>

            {/* Memory entries */}
            <div className="rounded-xl border border-[#1A3D33] bg-[#0A1E1A] px-4 py-3 space-y-2">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#3D6B5F]">Memory</p>
              {[
                { event: 'briefing_generated', time: 'Today 09:14' },
                { event: 'match_approved', time: 'Today 09:12' },
              ].map((m) => (
                <div key={m.event} className="flex items-center gap-2">
                  <CheckCircle size={12} className="text-(--teal-strong) shrink-0" />
                  <span className="text-xs text-(--text-muted)">{m.event}</span>
                  <span className="ml-auto text-xs text-[#3D6B5F]">{m.time}</span>
                </div>
              ))}
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Relationship Object — dark centrepiece */}
      <section className="bg-[#040C0A] pt-8 pb-12 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid items-center gap-12 lg:grid-cols-2">

            {/* Terminal Illustration */}
            <div className="relative group order-2 lg:order-1">
              {/* Outer glow */}
              <div className="absolute -inset-2 rounded-[2.5rem] bg-linear-to-r from-(--teal) to-(--teal-strong) opacity-10 blur-2xl transition duration-1000 group-hover:opacity-20"></div>
              
              <div className="relative overflow-hidden rounded-2xl border border-[#1A3D33] bg-[#060F0D] shadow-2xl">
                {/* Header / Chrome */}
                <div className="flex items-center justify-between border-b border-[#1A3D33] bg-[#0A1E1A] px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#FF5F57] opacity-80" />
                    <div className="h-3 w-3 rounded-full bg-[#FEBC2E] opacity-80" />
                    <div className="h-3 w-3 rounded-full bg-[#28C840] opacity-80" />
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[#3D6B5F]">
                    <span className="opacity-40">Objects /</span>
                    <span className="text-[#5A8A7A]">Relationship_87.json</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-1 w-1 rounded-full bg-[#1A3D33]" />
                    <div className="h-1 w-1 rounded-full bg-[#1A3D33]" />
                  </div>
                </div>

                {/* Code Area */}
                <div className="relative max-h-[440px] overflow-hidden p-8 font-mono text-[13px] leading-7">
                  <div className="flex gap-6">
                    {/* Line numbers */}
                    <div className="hidden select-none flex-col text-right text-[#1A3D33] sm:flex">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="h-7">{String(i + 1).padStart(2, '0')}</div>
                      ))}
                    </div>
                    
                    {/* Code lines */}
                    <div className="flex-1 space-y-0">
                      <div className="h-7 text-[#c6fff6] opacity-40">{'{'}</div>
                      <div className="h-7 text-[#c6fff6] ml-4"><span className="text-[#96d0ff]">"id"</span>: <span className="text-[#f69d50]">"rel_01JQHM7K"</span>,</div>
                      <div className="h-7 text-[#c6fff6] ml-4"><span className="text-[#96d0ff]">"type"</span>: <span className="text-[#f69d50]">"mentor_startup"</span>,</div>
                      
                      {/* Diff style lines */}
                      <div className="h-7 ml-4 flex items-center -mx-4 px-4 bg-[#f47067]/10 text-[#f47067]">
                        <span className="w-4 shrink-0 opacity-50">-</span>
                        <span><span className="text-[#f47067]">"status"</span>: <span className="text-[#f47067]">"pending"</span>,</span>
                      </div>
                      <div className="h-7 ml-4 flex items-center -mx-4 px-4 bg-[#57ab5a]/15 text-[#57ab5a]">
                        <span className="w-4 shrink-0 opacity-80">+</span>
                        <span><span className="text-[#57ab5a]">"status"</span>: <span className="text-[#57ab5a]">"active"</span>,</span>
                      </div>

                      <div className="h-7 text-[#c6fff6] ml-4"><span className="text-[#96d0ff]">"formation"</span>: <span className="text-[#f69d50]">"ai_matched"</span>,</div>
                      <div className="h-7" />
                      <div className="h-7 text-[#c6fff6] ml-4"><span className="text-[#96d0ff]">"confidence_score"</span>: <span className="text-[#6cb6ff]">87</span>,</div>
                      <div className="h-7 text-[#c6fff6] ml-4"><span className="text-[#96d0ff]">"rationale"</span>: <span className="text-[#f69d50]">"Strong domain alignment..."</span>,</div>
                      <div className="h-7" />
                      <div className="h-7 text-[#c6fff6] ml-4"><span className="text-[#96d0ff]">"governance"</span>: {'{'}</div>
                      <div className="h-7 text-[#c6fff6] ml-8"><span className="text-[#96d0ff]">"approved_by"</span>: <span className="text-[#f69d50]">"admin_001"</span>,</div>
                      <div className="h-7 text-[#c6fff6] ml-8"><span className="text-[#96d0ff]">"programme"</span>: <span className="text-[#f69d50]">"MAGIC Cohort 8"</span></div>
                      <div className="h-7 text-[#c6fff6] ml-4">{'}'},</div>
                      <div className="h-7" />
                      <div className="h-7 text-[#c6fff6] ml-4"><span className="text-[#96d0ff]">"memory"</span>: [</div>
                      <div className="h-7 text-[#c6fff6] ml-8"><span className="text-[#f69d50]">"match_approved"</span>,</div>
                      <div className="h-7 text-[#c6fff6] ml-8"><span className="text-[#f69d50]">"briefing_generated"</span></div>
                      <div className="h-7 text-[#c6fff6] ml-4">]</div>
                      <div className="h-7 text-[#c6fff6]">{ '}' }</div>
                    </div>
                  </div>

                  {/* Bottom Gradient Fade */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-[#060F0D] via-[#060F0D]/80 to-transparent" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--teal-strong)">The Relationship Object</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tighter text-white sm:text-5xl">
                One object. Every relationship.
              </h2>
              <p className="mt-5 text-base leading-7 text-white/70">
                Confidence, governance, memory, and approval state — baked in from the moment a relationship is formed.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  { field: 'confidence_score', desc: 'AI-generated match quality, 0–100' },
                  { field: 'governance', desc: 'Who approved it, who can modify it' },
                  { field: 'memory', desc: 'Append-only event log from formation onward' },
                  { field: 'formation', desc: 'How the relationship was created — ai_matched, manual, or imported' },
                ].map(({ field, desc }) => (
                  <li key={field} className="flex gap-3">
                    <span className="mt-0.5 shrink-0 rounded bg-[#0A1E1A] border border-[#1A3D33] px-2 py-0.5 font-mono text-xs text-[#2dd4bf]">{field}</span>
                    <span className="text-sm text-white/60 leading-6">{desc}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <Link
                  href="/about-relationship-object"
                  className="inline-flex items-center gap-2 rounded-lg bg-(--teal) px-6 py-3 text-sm font-semibold text-(--accent-foreground) hover:opacity-90 transition-opacity"
                >
                  Learn about the Object
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-6 pt-12 pb-24 lg:px-10 lg:py-24">
        <div className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--teal-strong)">How it works</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tighter text-foreground">
            From pitch deck to live relationship in minutes.
          </h2>
        </div>

        <div className="grid gap-px border border-(--border) rounded-2xl overflow-hidden bg-(--border) lg:grid-cols-3">

          {/* ── Card 1: Ingest ── */}
          <div className="flex flex-col bg-background relative group">
            <div className="relative h-64 overflow-hidden bg-background">
              <div className="absolute top-6 right-8 z-10 rounded-full border border-(--teal-strong)/20 bg-(--teal-soft) px-2.5 py-1 text-[10px] font-mono font-bold tracking-[0.2em] text-(--teal-strong) opacity-50 group-hover:opacity-100 transition-opacity backdrop-blur-sm">STEP 01</div>
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, #1A3D33 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-xl border border-[#1A3D33] p-4 shadow-2xl" style={{ width: '152px', backgroundColor: '#0A1E1A' }}>
                  <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-[#1A3D33]">
                    <div className="w-7 h-8 rounded border flex items-center justify-center shrink-0" style={{ borderColor: 'rgba(45,212,191,0.3)', backgroundColor: '#0D2620' }}>
                      <span className="text-[7px] font-mono text-[#2dd4bf]">PDF</span>
                    </div>
                    <div>
                      <div className="text-[9px] text-white font-medium">pitch.pdf</div>
                      <div className="text-[8px] text-[#3D6B5F]">2.4 MB</div>
                    </div>
                  </div>
                  <div className="space-y-1.5 mb-3">
                    {([['100%', 0], ['78%', 0.15], ['90%', 0.3], ['55%', 0.45]] as [string, number][]).map(([w, d], i) => (
                      <div key={i} className="h-1 rounded-full overflow-hidden" style={{ width: w }}>
                        <div className="h-full rounded-full" style={{ backgroundColor: '#2dd4bf', transformOrigin: 'left', animationFillMode: 'backwards', animation: `ingest-scan 4.5s ease-in-out infinite`, animationDelay: `${d}s` }} />
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-[#1A3D33] pt-2 space-y-1">
                    {[['name', 'NexaBuild', 1.2], ['stage', 'seed', 1.5], ['tags', '[SaaS, B2B]', 1.8]].map(([k, v, d]) => (
                      <div key={k as string} className="flex gap-1"
                        style={{ animation: 'ingest-field 4.5s ease-in-out infinite', animationDelay: `${d}s` }}>
                        <span className="text-[8px] font-mono text-[#5A8A7A]">{k}:</span>
                        <span className="text-[8px] font-mono text-[#2dd4bf]">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-3">
                <FileText size={18} className="text-(--teal-strong)" />
                <h3 className="text-xl font-semibold tracking-[-0.03em] text-foreground">Ingest</h3>
              </div>
              <p className="text-sm leading-7 text-foreground opacity-60">Upload a pitch deck. Structured profiles are extracted automatically — no forms.</p>
            </div>
          </div>

          {/* ── Card 2: Match ── */}
          <div className="flex flex-col bg-background relative group">
            <div className="relative h-64 overflow-hidden bg-background">
              <div className="absolute top-6 right-8 z-10 rounded-full border border-(--teal-strong)/20 bg-(--teal-soft) px-2.5 py-1 text-[10px] font-mono font-bold tracking-[0.2em] text-(--teal-strong) opacity-50 group-hover:opacity-100 transition-opacity backdrop-blur-sm">STEP 02</div>
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, #1A3D33 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 px-8">
                <div className="self-start rounded-lg border border-[#1A3D33] px-2.5 py-1.5 flex items-center gap-1.5" style={{ backgroundColor: '#0A1E1A' }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1A56DB]" />
                  <span className="text-[9px] font-mono text-white">NexaBuild</span>
                  <span className="text-[8px] text-[#3D6B5F]">startup</span>
                </div>
                <div className="relative w-full h-5 flex items-center">
                  <div className="relative w-full h-px" style={{ backgroundColor: '#1A3D33' }}>
                    <div className="absolute inset-y-0 left-0 h-px w-full"
                      style={{ backgroundColor: '#2dd4bf', transformOrigin: 'left', animationFillMode: 'backwards', animation: 'match-draw 4.5s ease-in-out infinite' }} />
                    <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                      style={{ backgroundColor: '#2dd4bf', boxShadow: '0 0 8px #2dd4bf', animationFillMode: 'backwards', animation: 'match-dot 4.5s ease-in-out infinite' }} />
                  </div>
                </div>
                <div className="self-end rounded-lg border border-[#1A3D33] px-2.5 py-1.5 flex items-center gap-1.5" style={{ backgroundColor: '#0A1E1A' }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0E9F6E]" />
                  <span className="text-[9px] font-mono text-white">Amir Hassan</span>
                  <span className="text-[8px] text-[#3D6B5F]">mentor</span>
                </div>
                <div className="w-full mt-1.5">
                  <div className="flex justify-between mb-1">
                    <span className="text-[8px] font-mono text-[#3D6B5F]">confidence</span>
                    <span className="text-[8px] font-mono text-[#2dd4bf]">87 / 100</span>
                  </div>
                  <div className="h-1 w-full rounded-full" style={{ backgroundColor: '#1A3D33' }}>
                    <div className="h-1 w-full rounded-full"
                      style={{ backgroundColor: '#2dd4bf', transformOrigin: 'left', animationFillMode: 'backwards', animation: 'match-bar 4.5s ease-in-out infinite' }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-3">
                <Cpu size={18} className="text-(--teal-strong)" />
                <h3 className="text-xl font-semibold tracking-[-0.03em] text-foreground">Match</h3>
              </div>
              <p className="text-sm leading-7 text-foreground opacity-60">Every mentor is scored against the startup. Confidence, rationale, and alignment factors returned instantly.</p>
            </div>
          </div>

          {/* ── Card 3: Brief ── */}
          <div className="flex flex-col bg-background relative group">
            <div className="relative h-64 overflow-hidden bg-background">
              <div className="absolute top-6 right-8 z-10 rounded-full border border-(--teal-strong)/20 bg-(--teal-soft) px-2.5 py-1 text-[10px] font-mono font-bold tracking-[0.2em] text-(--teal-strong) opacity-50 group-hover:opacity-100 transition-opacity backdrop-blur-sm">STEP 03</div>
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, #1A3D33 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-xl border border-[#1A3D33] overflow-hidden shadow-2xl" style={{ width: '168px', backgroundColor: '#0A1E1A' }}>
                  <div className="border-b border-[#1A3D33] px-3 py-2 flex items-center gap-2" style={{ backgroundColor: '#0D2620' }}>
                    <div className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: '#2dd4bf', animation: 'brief-dot-pulse 2s ease-in-out infinite' }} />
                    <span className="text-[7px] font-mono text-[#2dd4bf] uppercase tracking-widest">Match Briefing</span>
                  </div>
                  <div className="p-3 space-y-2">
                    {([['92%', 0.2], ['76%', 0.6], ['88%', 1.0], ['62%', 1.4], ['84%', 1.8], ['38%', 2.2]] as [string, number][]).map(([w, d], i) => (
                      <div key={i} className="flex items-center gap-1">
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ width: w }}>
                          <div className="h-full w-full rounded-full"
                            style={{ backgroundColor: 'rgba(45,212,191,0.65)', transformOrigin: 'left', animationFillMode: 'backwards', animation: 'brief-stream 5s ease-in-out infinite', animationDelay: `${d}s` }} />
                        </div>
                        {i === 5 && (
                          <div className="w-px h-2.5"
                            style={{ backgroundColor: '#2dd4bf', animation: 'brief-cursor 0.9s ease-in-out infinite', animationDelay: '2.2s' }} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-3">
                <Video size={18} className="text-(--teal-strong)" />
                <h3 className="text-xl font-semibold tracking-[-0.03em] text-foreground">Brief</h3>
              </div>
              <p className="text-sm leading-7 text-foreground opacity-60">Approved matches generate a personalised briefing. The relationship is live, tracked, and auditable.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Footer strip */}
      <section className="bg-[#040C0A] py-24">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-10">
          <h2 className="text-4xl font-semibold tracking-tighter text-white sm:text-5xl">
            Ready to map your ecosystem?
          </h2>
          <p className="mt-4 text-base text-white/70">
            Verisyqnal — programmable infrastructure for innovation ecosystems.
          </p>
          <div className="mt-10">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-(--teal) px-8 py-4 text-base font-semibold text-(--accent-foreground) hover:opacity-90 transition-opacity"
            >
              Open the Platform
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

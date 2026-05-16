interface TextBriefing {
  mentor_name: string
  programme: string
  startup_name: string
  startup_summary: string
  match_reason: string
  what_they_need: string
  alignment_highlight: string
}

interface BriefingCardProps {
  type: 'video' | 'text_briefing'
  videoUrl?: string
  briefing?: TextBriefing
}

const BRIEFING_LABELS: Record<keyof TextBriefing, string> = {
  mentor_name: 'Mentor',
  programme: 'Programme',
  startup_name: 'Startup',
  startup_summary: 'What They Do',
  match_reason: 'Why You Were Matched',
  what_they_need: 'What They Need',
  alignment_highlight: 'Your Key Strength',
}

export function BriefingCard({ type, videoUrl, briefing }: BriefingCardProps) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-[var(--border)] shadow-[var(--shadow-soft)]">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#071311] px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#8ef0df]">Match Briefing</p>
          <p className="text-sm font-bold text-white">Verisyqnal</p>
        </div>
        <div className="text-xs text-slate-400">
          {type === 'video' ? 'Powered by Veo' : 'Verisyqnal AI'}
        </div>
      </div>

      {/* Body */}
      {type === 'video' && videoUrl ? (
        <video src={videoUrl} controls className="w-full" />
      ) : briefing ? (
        <div className="divide-y divide-[var(--border)] bg-[var(--surface-strong)]">
          {(Object.keys(BRIEFING_LABELS) as (keyof TextBriefing)[]).map((key) => (
            <div key={key} className="px-5 py-3">
              <p className="mb-0.5 text-xs uppercase tracking-wide text-[var(--text-muted)]">{BRIEFING_LABELS[key]}</p>
              <p className="text-sm font-medium text-[var(--foreground)] max-w-2xl">{briefing[key]}</p>
            </div>
          ))}

        </div>
      ) : null}

      {/* Footer */}
      <div className="bg-[var(--surface)] px-5 py-2 text-right">
        <span className="text-xs text-[var(--text-muted)]">
          {type === 'video' ? 'Powered by Veo' : 'Verisyqnal AI'}
        </span>
      </div>
    </div>
  )
}

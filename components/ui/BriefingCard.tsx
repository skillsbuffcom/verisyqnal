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
    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-md">
      {/* Header */}
      <div className="bg-[#0F172A] px-5 py-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-widest">Match Briefing</p>
          <p className="text-white font-bold text-sm">Verisyqnal</p>
        </div>
        <div className="text-xs text-slate-400">
          {type === 'video' ? 'Powered by Veo' : 'Verisyqnal AI'}
        </div>
      </div>

      {/* Body */}
      {type === 'video' && videoUrl ? (
        <video src={videoUrl} controls className="w-full" />
      ) : briefing ? (
        <div className="bg-white divide-y divide-gray-100">
          {(Object.keys(BRIEFING_LABELS) as (keyof TextBriefing)[]).map((key) => (
            <div key={key} className="px-5 py-3">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{BRIEFING_LABELS[key]}</p>
              <p className="text-sm font-medium text-gray-900">{briefing[key]}</p>
            </div>
          ))}
          {type === 'text_briefing' && (
            <div className="px-5 py-2 bg-amber-50">
              <p className="text-xs text-amber-600">Video briefing unavailable — showing text summary</p>
            </div>
          )}
        </div>
      ) : null}

      {/* Footer */}
      <div className="bg-gray-50 px-5 py-2 text-right">
        <span className="text-xs text-gray-400">
          {type === 'video' ? 'Powered by Veo' : 'Verisyqnal AI'}
        </span>
      </div>
    </div>
  )
}

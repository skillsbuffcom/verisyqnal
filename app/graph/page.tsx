'use client'

import { useEffect, useState, useMemo, useCallback, memo } from 'react'
import ReactFlow, {
  Node, Edge, Background, Controls, MiniMap,
  useNodesState, useEdgesState, BackgroundVariant, NodeProps, Handle, Position,
  BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { EntityCard } from '@/components/ui/EntityCard'
import { RelationshipCard } from '@/components/ui/RelationshipCard'
import { EntityType, RelationshipType, RelationshipStatus } from '@/lib/types'

type Entity = { id: string; type: EntityType; name: string; tags: string[]; geography: string | null; stage: string | null }
type Relationship = { id: string; entityA: Entity; entityB: Entity; entityAId: string; entityBId: string; type: RelationshipType; status: RelationshipStatus; formation: string; confidence: number | null; rationale: string | null; alignmentFactors: string[]; memory: unknown[] }

const NODE_COLORS: Record<EntityType, string> = {
  startup:   '#2dd4bf',
  mentor:    '#0E9F6E',
  partner:   '#7c3aed',
  programme: '#f59e0b',
}

const EDGE_STYLES: Record<RelationshipStatus, React.CSSProperties> = {
  active:    { stroke: '#2dd4bf', strokeWidth: 2 },
  pending:   { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '5,5' },
  completed: { stroke: '#94a3b8', strokeWidth: 1.5 },
  dissolved: { stroke: '#ef4444', strokeWidth: 1, strokeDasharray: '2,4' },
}

const TIER: Record<EntityType, number> = { programme: 0, startup: 1, mentor: 2, partner: 2 }

// ── Custom node ──────────────────────────────────────────────────────────────
const EntityNode = memo(({ data }: NodeProps) => {
  const entity: Entity = data.entity
  const color = NODE_COLORS[entity.type] ?? '#94a3b8'
  return (
    <>
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <div
        style={{ borderColor: color, boxShadow: `0 0 0 1px var(--border), 0 4px 16px rgba(0,0,0,0.18)` }}
        className="relative w-44 rounded-2xl border-2 bg-(--surface-strong) px-4 py-3 backdrop-blur-md"
      >
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
          <p className="text-[13px] font-bold leading-tight text-foreground wrap-break-word">{entity.name}</p>
        </div>
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color }}>
          {entity.type}
        </p>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </>
  )
})
EntityNode.displayName = 'EntityNode'

const StartupProgrammeEdge = memo((props: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath(props)

  return (
    <>
      <BaseEdge id={props.id} path={edgePath} style={props.style} />
      <EdgeLabelRenderer>
        <div
          className="pointer-events-none absolute rounded-lg border border-(--teal) bg-(--surface-strong) px-2.5 py-1 text-center text-[10px] font-semibold uppercase leading-4 tracking-[0.18em] text-(--teal-strong) shadow-sm"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
        >
          <div>startup</div>
          <div>programme</div>
        </div>
      </EdgeLabelRenderer>
    </>
  )
})
StartupProgrammeEdge.displayName = 'StartupProgrammeEdge'

const MentorStartupEdge = memo((props: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath(props)

  return (
    <>
      <BaseEdge id={props.id} path={edgePath} style={props.style} />
      <EdgeLabelRenderer>
        <div
          className="pointer-events-none absolute rounded-lg border border-(--teal) bg-(--surface-strong) px-2.5 py-1 text-center text-[10px] font-semibold uppercase leading-4 tracking-[0.18em] text-(--teal-strong) shadow-sm"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
        >
          <div>mentor</div>
          <div>startup</div>
        </div>
      </EdgeLabelRenderer>
    </>
  )
})
MentorStartupEdge.displayName = 'MentorStartupEdge'

const nodeTypes = { entityNode: EntityNode }
const edgeTypes = {
  startupProgrammeEdge: StartupProgrammeEdge,
  mentorStartupEdge: MentorStartupEdge,
}

// ── Layout builder ───────────────────────────────────────────────────────────
const MAX_PER_ROW = 5
const TIER_Y: Record<number, number> = { 0: -80, 1: 260, 2: 560 }

function buildLayout(entities: Entity[], relationships: Relationship[]) {
  const tiers: Record<number, Entity[]> = { 0: [], 1: [], 2: [] }
  entities.forEach(e => tiers[TIER[e.type] ?? 2].push(e))

  const nodes: Node[] = []
  Object.entries(tiers).forEach(([tier, ents]) => {
    const tierBase = TIER_Y[parseInt(tier)] ?? parseInt(tier) * 280
    ents.forEach((e, i) => {
      const row = Math.floor(i / MAX_PER_ROW)
      const col = i % MAX_PER_ROW
      const rowCount = Math.min(ents.length - row * MAX_PER_ROW, MAX_PER_ROW)
      nodes.push({
        id: e.id,
        type: 'entityNode',
        position: { x: (col - (rowCount - 1) / 2) * 220, y: tierBase + row * 130 },
        data: { label: e.name, entity: e },
      })
    })
  })

  const edges: Edge[] = relationships.map(r => ({
    id: r.id,
    source: r.entityAId,
    target: r.entityBId,
    ...(r.type === 'startup_programme'
      ? { type: 'startupProgrammeEdge' }
      : r.type === 'mentor_startup'
        ? { type: 'mentorStartupEdge' }
        : { label: r.type.replace(/_/g, ' ') }),
    labelStyle: { fontSize: 10, fill: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' as const },
    labelBgStyle: { fill: 'var(--surface-strong)', fillOpacity: 0.85 },
    labelBgPadding: [6, 3] as [number, number],
    labelBgBorderRadius: 6,
    style: EDGE_STYLES[r.status] ?? EDGE_STYLES.active,
    data: { relationship: r },
  }))

  return { nodes, edges }
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function GraphPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null)
  const [selectedRel, setSelectedRel] = useState<Relationship | null>(null)
  const [programmes, setProgrammes] = useState<{ id: string; name: string }[]>([])
  const [filterProgramme, setFilterProgramme] = useState('')
  const [allEntities, setAllEntities] = useState<Entity[]>([])
  const [allRels, setAllRels] = useState<Relationship[]>([])

  async function fetchAll() {
    setLoading(true)
    setError(null)
    try {
      const [eRes, rRes, pRes] = await Promise.all([
        fetch('/api/entities').then(r => r.json()),
        fetch('/api/relationships').then(r => r.json()),
        fetch('/api/programmes').then(r => r.json()),
      ])
      
      if (!eRes.success) throw new Error(eRes.error || 'Failed to fetch entities')
      if (!rRes.success) throw new Error(rRes.error || 'Failed to fetch relationships')
      if (!pRes.success) throw new Error(pRes.error || 'Failed to fetch programmes')

      setAllEntities(eRes.entities ?? [])
      setAllRels(rRes.relationships ?? [])
      setProgrammes(pRes.programmes ?? [])
    } catch (err) {
      console.error('Graph Fetch Error:', err)
      setError(String(err))
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchAll() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Optimized: Memoize layout calculations
  const { nodes: layoutNodes, edges: layoutEdges } = useMemo(() => {
    if (!filterProgramme) {
      return buildLayout(allEntities, allRels)
    }
    const progRels = allRels.filter(r => (r as unknown as { programmeId?: string }).programmeId === filterProgramme)
    const ids = new Set(progRels.flatMap(r => [r.entityAId, r.entityBId]))
    const filteredEntities = allEntities.filter(e => ids.has(e.id))
    return buildLayout(filteredEntities, progRels)
  }, [allEntities, allRels, filterProgramme])

  // Sync ReactFlow state with memoized layout when data/filter changes
  useEffect(() => {
    setNodes(layoutNodes)
    setEdges(layoutEdges)
  }, [layoutNodes, layoutEdges, setNodes, setEdges])

  return (
    <div className="flex h-[calc(100vh-64px)] lg:h-full bg-background overflow-hidden">
      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <LoadingSpinner label="Compiling ecosystem graph..." />
          </div>
        )}

        {error && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md p-8 text-center">
            <div className="max-w-md app-panel p-8 rounded-4xl border border-red-500/20">
              <h3 className="text-xl font-bold text-red-500 mb-2 tracking-tight">Failed to Load Graph</h3>
              <p className="text-(--text-muted) mb-6 text-sm leading-relaxed">{error}</p>
              <button onClick={fetchAll} className="w-full py-3 bg-(--teal) text-(--accent-foreground) rounded-xl text-sm font-bold shadow-lg transition-all hover:scale-[1.02]">
                Retry Connection
              </button>
            </div>
          </div>
        )}

        {/* Controls bar */}
        <div className="absolute left-6 top-6 z-10 flex flex-wrap gap-3">
          <select
            className="rounded-xl border border-(--border) bg-(--surface-strong) px-4 py-2 text-sm font-semibold text-foreground shadow-lg focus:outline-none focus:ring-2 focus:ring-(--teal-soft) transition-all"
            value={filterProgramme}
            onChange={(e) => setFilterProgramme(e.target.value)}
          >
            <option value="">All Programmes</option>
            {programmes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button
            onClick={fetchAll}
            className="rounded-xl bg-(--teal) px-4 py-2 text-sm font-bold text-(--accent-foreground) shadow-lg hover:opacity-90 transition-all hover:scale-[1.03]"
          >
            Sync Data
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-6 left-16 z-10 hidden rounded-2xl border border-(--border-strong) bg-(--surface-strong) p-5 text-xs shadow-2xl backdrop-blur-md space-y-3 md:block min-w-44">
          <p className="font-bold text-(--teal-strong) uppercase tracking-widest text-[10px] font-mono">Legend</p>
          <div className="space-y-2">
            {(Object.entries(NODE_COLORS) as [EntityType, string][]).map(([t, c]) => (
              <div key={t} className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full" style={{ background: c }} />
                <span className="text-foreground font-semibold capitalize">{t}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-(--border) pt-3 space-y-2">
            <div className="flex items-center gap-2.5"><div className="w-7 h-0.5 rounded-full bg-[#2dd4bf]" /><span className="text-foreground opacity-70">Active</span></div>
            <div className="flex items-center gap-2.5"><div className="w-7 border-t-2 border-dashed border-[#f59e0b]" /><span className="text-foreground opacity-70">Pending</span></div>
            <div className="flex items-center gap-2.5"><div className="w-7 h-0.5 rounded-full bg-[#94a3b8]" /><span className="text-foreground opacity-70">Completed</span></div>
            <div className="flex items-center gap-2.5"><div className="w-7 border-t border-dotted border-[#ef4444]" /><span className="text-foreground opacity-70">Dissolved</span></div>
          </div>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          edgeTypes={edgeTypes}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={(_, node) => { setSelectedEntity(node.data.entity); setSelectedRel(null) }}
          onEdgeClick={(_, edge) => { setSelectedRel(edge.data.relationship); setSelectedEntity(null) }}
          fitView
          minZoom={0.2}
          maxZoom={2}
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="var(--teal-soft)" />
          <Controls
            style={{
              background: 'var(--surface-strong)',
              border: '1px solid var(--border)',
              borderRadius: '0.75rem',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-soft)',
            }}
          />
          <MiniMap
            position="bottom-right"
            nodeColor={(n) => NODE_COLORS[n.data?.entity?.type as EntityType] ?? '#94a3b8'}
            style={{
              background: 'var(--surface-strong)',
              border: '1px solid var(--border-strong)',
              borderRadius: '1rem',
              boxShadow: 'var(--shadow-soft)',
            }}
            maskColor="var(--teal-soft)"
          />
        </ReactFlow>
      </div>

      {/* Side panel */}
      {(selectedEntity || selectedRel) && (
        <div className="absolute inset-x-0 bottom-0 z-40 max-h-[60vh] overflow-auto border-t border-(--border-strong) bg-(--surface-strong) p-6 shadow-2xl backdrop-blur-xl lg:static lg:max-h-none lg:w-96 lg:shrink-0 lg:border-l lg:border-t-0 lg:shadow-none">
          <div className="flex items-center justify-between mb-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-(--teal-strong) font-bold">Inspector</p>
            <button
              onClick={() => { setSelectedEntity(null); setSelectedRel(null) }}
              className="rounded-full bg-(--surface-muted) px-3 py-1 text-xs font-bold text-(--text-muted) hover:text-foreground transition-colors"
            >
              ✕ Close
            </button>
          </div>

          <div className="space-y-6">
            {selectedEntity && <EntityCard {...selectedEntity} />}
            {selectedRel && (
              <RelationshipCard
                entityAName={selectedRel.entityA.name}
                entityBName={selectedRel.entityB.name}
                type={selectedRel.type}
                status={selectedRel.status}
                formation={selectedRel.formation}
                confidence={selectedRel.confidence}
                rationale={selectedRel.rationale}
                alignmentFactors={selectedRel.alignmentFactors}
              />
            )}
            {selectedRel && Array.isArray(selectedRel.memory) && selectedRel.memory.length > 0 && (
              <div className="rounded-2xl border border-(--border) bg-(--surface) p-5">
                <p className="font-mono text-[10px] font-bold text-(--teal-strong) mb-4 uppercase tracking-widest">Memory</p>
                <div className="space-y-4">
                  {(selectedRel.memory as { timestamp: string; event: string; actor: string; notes: string }[]).map((m, i) => (
                    <div key={i} className="text-xs border-l-2 border-(--teal-soft) pl-4 relative">
                      <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-(--teal)" />
                      <p className="font-bold text-foreground">{m.event.replace(/_/g, ' ')}</p>
                      <p className="mt-1 font-mono text-(--text-muted) opacity-60">{new Date(m.timestamp).toLocaleString()}</p>
                      {m.notes && <p className="mt-2 italic text-(--text-muted) leading-relaxed">{m.notes}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

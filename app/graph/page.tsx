'use client'

import { useEffect, useState, useMemo } from 'react'
import ReactFlow, {
  Node, Edge, Background, Controls, MiniMap,
  useNodesState, useEdgesState, BackgroundVariant,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { EntityCard } from '@/components/ui/EntityCard'
import { RelationshipCard } from '@/components/ui/RelationshipCard'
import { EntityType, RelationshipType, RelationshipStatus } from '@/lib/types'

type Entity = { id: string; type: EntityType; name: string; tags: string[]; geography: string | null; stage: string | null }
type Relationship = { id: string; entityA: Entity; entityB: Entity; entityAId: string; entityBId: string; type: RelationshipType; status: RelationshipStatus; formation: string; confidence: number | null; rationale: string | null; alignmentFactors: string[]; memory: unknown[] }

const NODE_COLORS: Record<EntityType, string> = {
  startup: '#1A56DB',
  mentor: '#0E9F6E',
  partner: '#7C3AED',
  programme: '#D97706',
}

const EDGE_STYLES: Record<RelationshipStatus, React.CSSProperties> = {
  active: { stroke: '#0E9F6E', strokeWidth: 2 },
  pending: { stroke: '#F59E0B', strokeWidth: 2, strokeDasharray: '5,5' },
  completed: { stroke: '#9CA3AF', strokeWidth: 1 },
  dissolved: { stroke: '#E02424', strokeWidth: 1, strokeDasharray: '2,4' },
}

const TIER: Record<EntityType, number> = { programme: 0, startup: 1, mentor: 2, partner: 2 }

function buildLayout(entities: Entity[], relationships: Relationship[]) {
  const tiers: Record<number, Entity[]> = { 0: [], 1: [], 2: [] }
  entities.forEach(e => tiers[TIER[e.type] ?? 2].push(e))

  const nodes: Node[] = []
  Object.entries(tiers).forEach(([tier, ents]) => {
    ents.forEach((e, i) => {
      const total = ents.length
      nodes.push({
        id: e.id,
        position: { x: (i - (total - 1) / 2) * 220, y: parseInt(tier) * 180 },
        data: { label: e.name.slice(0, 20), entity: e },
        style: {
          background: NODE_COLORS[e.type], color: '#fff', borderRadius: 8,
          width: 160, height: 50, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontWeight: 600, fontSize: 13,
        },
      })
    })
  })

  const edges: Edge[] = relationships.map(r => ({
    id: r.id,
    source: r.entityAId,
    target: r.entityBId,
    label: r.type.replace('_', ' '),
    labelStyle: { fontSize: 10, fill: '#6B7280' },
    style: EDGE_STYLES[r.status] ?? EDGE_STYLES.active,
    data: { relationship: r },
  }))

  return { nodes, edges }
}

export default function GraphPage() {
  const [loading, setLoading] = useState(true)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null)
  const [selectedRel, setSelectedRel] = useState<Relationship | null>(null)
  const [programmes, setProgrammes] = useState<{ id: string; name: string }[]>([])
  const [filterProgramme, setFilterProgramme] = useState('')
  const [allEntities, setAllEntities] = useState<Entity[]>([])
  const [allRels, setAllRels] = useState<Relationship[]>([])

  const [error, setError] = useState<string | null>(null)

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

  useEffect(() => { fetchAll() }, [])

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
    <div className="flex h-full">
      <div className="flex-1 relative">
        {loading && <div className="absolute inset-0 z-10 bg-white flex items-center justify-center"><LoadingSpinner label="Loading ecosystem..." /></div>}
        {error && (
          <div className="absolute inset-0 z-10 bg-white flex items-center justify-center p-8 text-center">
            <div className="max-w-md">
              <h3 className="text-lg font-bold text-red-600 mb-2">Failed to Load Graph</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button onClick={fetchAll} className="px-4 py-2 bg-[#1A56DB] text-white rounded-lg text-sm font-semibold">Retry</button>
            </div>
          </div>
        )}

        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <select
            className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm shadow-sm text-gray-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={filterProgramme}
            onChange={(e) => setFilterProgramme(e.target.value)}
          >
            <option value="">All Programmes</option>
            {programmes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button onClick={fetchAll} className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm shadow-sm hover:bg-gray-50 transition-colors text-gray-900 font-medium focus:outline-none select-none">
            Refresh
          </button>
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 left-4 z-10 bg-white border border-gray-200 rounded-xl p-3 shadow-sm text-xs space-y-1">
          <p className="font-semibold text-gray-700 mb-1">Legend</p>
          {(Object.entries(NODE_COLORS) as [EntityType, string][]).map(([t, c]) => (
            <div key={t} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ background: c }} />
              <span className="text-gray-600 capitalize">{t}</span>
            </div>
          ))}
          <div className="border-t border-gray-100 mt-1 pt-1 space-y-1">
            <div className="flex items-center gap-2"><div className="w-6 h-0.5 bg-[#0E9F6E]" /><span>Active</span></div>
            <div className="flex items-center gap-2"><div className="w-6 h-0.5 border-t-2 border-dashed border-amber-400" /><span>Pending</span></div>
            <div className="flex items-center gap-2"><div className="w-6 h-0.5 bg-gray-400" /><span>Completed</span></div>
            <div className="flex items-center gap-2"><div className="w-6 h-0.5 border-t border-dotted border-red-500" /><span>Dissolved</span></div>
          </div>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={(_, node) => { setSelectedEntity(node.data.entity); setSelectedRel(null) }}
          onEdgeClick={(_, edge) => { setSelectedRel(edge.data.relationship); setSelectedEntity(null) }}
          fitView
          minZoom={0.3}
        >
          <Background variant={BackgroundVariant.Dots} />
          <Controls />
          <MiniMap position="bottom-right" nodeColor={(n) => NODE_COLORS[n.data?.entity?.type as EntityType] ?? '#ccc'} />
        </ReactFlow>
      </div>

      {(selectedEntity || selectedRel) && (
        <div className="w-80 shrink-0 border-l border-gray-200 bg-white p-4 overflow-auto">
          <button onClick={() => { setSelectedEntity(null); setSelectedRel(null) }} className="text-xs text-gray-400 mb-3 hover:text-gray-600 transition-colors">✕ Close</button>
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
            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Memory</p>
              {(selectedRel.memory as { timestamp: string; event: string; actor: string; notes: string }[]).map((m, i) => (
                <div key={i} className="text-xs text-gray-600 border-l-2 border-gray-200 pl-2 mb-2">
                  <p className="font-medium">{m.event}</p>
                  <p className="text-gray-400">{new Date(m.timestamp).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

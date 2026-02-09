import { useState, useCallback } from 'react'
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'

interface DragDropPair {
  itemId: string
  itemLabel: string
  zoneId: string
  zoneLabel: string
}

interface DragDropExerciseProps {
  id: string
  title: string
  description: string
  pairs: DragDropPair[]
  onComplete?: () => void
}

function DraggableItem({ id, label, isPlaced }: { id: string; label: string; isPlaced: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id })

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined

  if (isPlaced) return null

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`px-3 py-2 text-sm font-mono bg-blue-50 border border-blue-200 rounded-lg cursor-grab active:cursor-grabbing transition-shadow ${
        isDragging ? 'opacity-50 shadow-lg' : 'hover:shadow-md'
      }`}
      data-testid={`drag-item-${id}`}
    >
      {label}
    </button>
  )
}

function DroppableZone({
  id,
  label,
  placedItem,
  isCorrect,
  submitted,
}: {
  id: string
  label: string
  placedItem?: { id: string; label: string }
  isCorrect?: boolean
  submitted: boolean
}) {
  const { isOver, setNodeRef } = useDroppable({ id })

  let borderClass = 'border-dashed border-slate-300'
  if (submitted && isCorrect) {
    borderClass = 'border-solid border-green-400 bg-green-50'
  } else if (submitted && isCorrect === false) {
    borderClass = 'border-solid border-red-400 bg-red-50'
  } else if (isOver) {
    borderClass = 'border-dashed border-blue-400 bg-blue-50'
  } else if (placedItem) {
    borderClass = 'border-solid border-blue-300 bg-blue-50'
  }

  return (
    <div
      ref={setNodeRef}
      className={`flex items-center gap-3 p-3 rounded-lg border-2 min-h-[52px] transition-colors ${borderClass}`}
      data-testid={`drop-zone-${id}`}
    >
      <span className="text-sm text-slate-700 flex-1">{label}</span>
      <div className="min-w-[100px] text-right">
        {placedItem ? (
          <span className="px-2 py-1 text-sm font-mono bg-white border border-slate-200 rounded">
            {placedItem.label}
          </span>
        ) : (
          <span className="text-xs text-slate-400 italic">Hierher ziehen</span>
        )}
      </div>
    </div>
  )
}

export default function DragDropExercise({
  id,
  title,
  description,
  pairs,
  onComplete,
}: DragDropExerciseProps) {
  // placements: zoneId -> { itemId, itemLabel }
  const [placements, setPlacements] = useState<Record<string, { id: string; label: string }>>({})
  const [activeId, setActiveId] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState<Record<string, boolean>>({})

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor),
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id))
  }, [])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event
    if (!over) return

    const itemId = String(active.id)
    const zoneId = String(over.id)
    const pair = pairs.find((p) => p.itemId === itemId)
    if (!pair) return

    // Remove item from any previous zone
    setPlacements((prev) => {
      const next = { ...prev }
      for (const [key, val] of Object.entries(next)) {
        if (val.id === itemId) delete next[key]
      }
      next[zoneId] = { id: itemId, label: pair.itemLabel }
      return next
    })

    if (submitted) {
      setSubmitted(false)
      setResults({})
    }
  }, [pairs, submitted])

  const handleSubmit = useCallback(() => {
    const newResults: Record<string, boolean> = {}
    let allCorrect = true
    for (const pair of pairs) {
      const placed = placements[pair.zoneId]
      const correct = placed?.id === pair.itemId
      newResults[pair.zoneId] = correct
      if (!correct) allCorrect = false
    }
    setResults(newResults)
    setSubmitted(true)
    if (allCorrect) onComplete?.()
  }, [pairs, placements, onComplete])

  const handleReset = useCallback(() => {
    setPlacements({})
    setSubmitted(false)
    setResults({})
  }, [])

  const allPlaced = pairs.every((p) => placements[p.zoneId])
  const allCorrect = submitted && pairs.every((p) => results[p.zoneId])
  const activeItem = pairs.find((p) => p.itemId === activeId)

  return (
    <div
      className="rounded-xl border border-slate-200 bg-white p-6 my-6"
      data-testid={`dragdrop-exercise-${id}`}
    >
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 mb-4">{description}</p>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs font-medium text-slate-500 mb-2">Begriffe:</p>
            <div className="flex flex-wrap gap-2">
              {pairs.map((pair) => (
                <DraggableItem
                  key={pair.itemId}
                  id={pair.itemId}
                  label={pair.itemLabel}
                  isPlaced={Object.values(placements).some((p) => p.id === pair.itemId)}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500 mb-2">Zuordnung:</p>
            <div className="flex flex-col gap-2">
              {pairs.map((pair) => (
                <DroppableZone
                  key={pair.zoneId}
                  id={pair.zoneId}
                  label={pair.zoneLabel}
                  placedItem={placements[pair.zoneId]}
                  isCorrect={submitted ? results[pair.zoneId] : undefined}
                  submitted={submitted}
                />
              ))}
            </div>
          </div>
        </div>

        <DragOverlay>
          {activeItem ? (
            <div className="px-3 py-2 text-sm font-mono bg-blue-100 border border-blue-300 rounded-lg shadow-xl">
              {activeItem.itemLabel}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={handleSubmit}
          disabled={!allPlaced || allCorrect}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Überprüfen
        </button>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 text-sm text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
        >
          Zurücksetzen
        </button>
        {submitted && (
          <span
            className={`text-sm font-medium ${allCorrect ? 'text-green-700' : 'text-red-700'}`}
            role="status"
            data-testid="dragdrop-result"
          >
            {allCorrect ? 'Alle richtig zugeordnet!' : 'Noch nicht alle korrekt.'}
          </span>
        )}
      </div>
    </div>
  )
}

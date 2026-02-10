import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ChapterProgress, LearningProgress } from '../types'

const STORE_VERSION = 3

const CHAPTER_IDS = [
  'warum-numpy',
  'array-grundlagen',
  'indexing-slicing',
  'array-operationen',
  'broadcasting',
  'reshape-manipulation',
  'statistische-auswertung',
  'praxisprojekt',
] as const

function createDefaultChapters(): Record<string, ChapterProgress> {
  const chapters: Record<string, ChapterProgress> = {}
  for (const id of CHAPTER_IDS) {
    chapters[id] = {
      id,
      visited: false,
      exercisesCompleted: 0,
      exercisesTotal: 0,
      completedExerciseIds: [],
    }
  }
  return chapters
}

/** Deep-merge persisted chapters with defaults: preserves progress, adds missing chapters */
function mergeChapters(
  persisted: Record<string, Partial<ChapterProgress>> | undefined,
): Record<string, ChapterProgress> {
  const defaults = createDefaultChapters()
  if (!persisted) return defaults

  for (const [id, saved] of Object.entries(persisted)) {
    if (!saved) continue
    const base = defaults[id] ?? { id, visited: false, exercisesCompleted: 0, exercisesTotal: 0, completedExerciseIds: [] }
    const ids = Array.isArray(saved.completedExerciseIds) ? saved.completedExerciseIds : []
    defaults[id] = {
      ...base,
      ...saved,
      completedExerciseIds: ids,
      exercisesCompleted: ids.length,
    }
  }

  return defaults
}

/** Recompute totalExercisesCompleted from actual chapter data */
function computeTotal(chapters: Record<string, ChapterProgress>): number {
  return Object.values(chapters).reduce(
    (sum, ch) => sum + ch.completedExerciseIds.length,
    0,
  )
}

interface ProgressActions {
  markChapterVisited: (chapterId: string) => void
  completeExercise: (chapterId: string, exerciseId: string) => void
  setExercisesTotal: (chapterId: string, total: number) => void
  addBadge: (badge: string) => void
  resetProgress: () => void
  getChapterProgress: (chapterId: string) => ChapterProgress | undefined
}

type ProgressStore = LearningProgress & ProgressActions

const defaultState: LearningProgress = {
  chapters: createDefaultChapters(),
  totalExercisesCompleted: 0,
  badges: [],
  lastVisited: undefined,
  version: STORE_VERSION,
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      ...defaultState,

      markChapterVisited: (chapterId: string) =>
        set((state) => {
          const chapter = state.chapters[chapterId]
          if (!chapter || chapter.visited) return state
          return {
            chapters: {
              ...state.chapters,
              [chapterId]: { ...chapter, visited: true },
            },
            lastVisited: chapterId,
          }
        }),

      completeExercise: (chapterId: string, exerciseId: string) =>
        set((state) => {
          const chapter = state.chapters[chapterId]
          if (!chapter) return state
          if (chapter.completedExerciseIds.includes(exerciseId)) return state
          const newIds = [...chapter.completedExerciseIds, exerciseId]
          const newChapters = {
            ...state.chapters,
            [chapterId]: {
              ...chapter,
              exercisesCompleted: newIds.length,
              completedExerciseIds: newIds,
            },
          }
          return {
            chapters: newChapters,
            totalExercisesCompleted: computeTotal(newChapters),
          }
        }),

      setExercisesTotal: (chapterId: string, total: number) =>
        set((state) => {
          const chapter = state.chapters[chapterId]
          if (!chapter || chapter.exercisesTotal === total) return state
          return {
            chapters: {
              ...state.chapters,
              [chapterId]: { ...chapter, exercisesTotal: total },
            },
          }
        }),

      addBadge: (badge: string) =>
        set((state) => {
          if (state.badges.includes(badge)) return state
          return { badges: [...state.badges, badge] }
        }),

      resetProgress: () => set(defaultState),

      getChapterProgress: (chapterId: string) => get().chapters[chapterId],
    }),
    {
      name: 'numpy-learning-progress',
      version: STORE_VERSION,
      // Only persist data fields, not action methods
      partialize: (state) => ({
        chapters: state.chapters,
        totalExercisesCompleted: state.totalExercisesCompleted,
        badges: state.badges,
        lastVisited: state.lastVisited,
        version: state.version,
      }),
      migrate: (persisted, version) => {
        if (version < STORE_VERSION) {
          const p = persisted as Partial<LearningProgress>
          const chapters = mergeChapters(p?.chapters as Record<string, Partial<ChapterProgress>> | undefined)
          return {
            ...defaultState,
            badges: Array.isArray(p?.badges) ? p.badges : [],
            lastVisited: p?.lastVisited,
            chapters,
            totalExercisesCompleted: computeTotal(chapters),
            version: STORE_VERSION,
          }
        }
        return persisted as LearningProgress
      },
      // Deep-merge chapters on every hydration to catch new chapters
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<LearningProgress> | undefined
        if (!persisted) return currentState
        const chapters = mergeChapters(persisted.chapters as Record<string, Partial<ChapterProgress>> | undefined)
        return {
          ...currentState,
          ...persisted,
          chapters,
          totalExercisesCompleted: computeTotal(chapters),
        }
      },
    },
  ),
)

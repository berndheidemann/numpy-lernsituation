import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ChapterProgress, LearningProgress } from '../types'

const STORE_VERSION = 2

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
          return {
            chapters: {
              ...state.chapters,
              [chapterId]: {
                ...chapter,
                exercisesCompleted: newIds.length,
                completedExerciseIds: newIds,
              },
            },
            totalExercisesCompleted: state.totalExercisesCompleted + 1,
          }
        }),

      setExercisesTotal: (chapterId: string, total: number) =>
        set((state) => {
          const chapter = state.chapters[chapterId]
          if (!chapter) return state
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
      migrate: (persisted, version) => {
        if (version < STORE_VERSION) {
          return { ...defaultState, ...(persisted as Partial<LearningProgress>) }
        }
        return persisted as ProgressStore
      },
    },
  ),
)

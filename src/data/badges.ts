import type { LearningProgress } from '../types'

export interface BadgeDefinition {
  id: string
  title: string
  description: string
  icon: string
  check: (state: LearningProgress) => boolean
}

const CHAPTER_BADGES: BadgeDefinition[] = [
  {
    id: 'chapter-warum-numpy',
    title: 'Warum NumPy?',
    description: 'Alle Übungen in Kapitel 1 abgeschlossen',
    icon: '🚀',
    check: (s) => {
      const ch = s.chapters['warum-numpy']
      return !!ch && ch.exercisesTotal > 0 && ch.exercisesCompleted >= ch.exercisesTotal
    },
  },
  {
    id: 'chapter-array-grundlagen',
    title: 'Array-Grundlagen',
    description: 'Alle Übungen in Kapitel 2 abgeschlossen',
    icon: '🧱',
    check: (s) => {
      const ch = s.chapters['array-grundlagen']
      return !!ch && ch.exercisesTotal > 0 && ch.exercisesCompleted >= ch.exercisesTotal
    },
  },
  {
    id: 'chapter-indexing-slicing',
    title: 'Indexing & Slicing',
    description: 'Alle Übungen in Kapitel 3 abgeschlossen',
    icon: '🔍',
    check: (s) => {
      const ch = s.chapters['indexing-slicing']
      return !!ch && ch.exercisesTotal > 0 && ch.exercisesCompleted >= ch.exercisesTotal
    },
  },
  {
    id: 'chapter-array-operationen',
    title: 'Array-Operationen',
    description: 'Alle Übungen in Kapitel 4 abgeschlossen',
    icon: '🔢',
    check: (s) => {
      const ch = s.chapters['array-operationen']
      return !!ch && ch.exercisesTotal > 0 && ch.exercisesCompleted >= ch.exercisesTotal
    },
  },
  {
    id: 'chapter-broadcasting',
    title: 'Broadcasting',
    description: 'Alle Übungen in Kapitel 6 abgeschlossen',
    icon: '📡',
    check: (s) => {
      const ch = s.chapters['broadcasting']
      return !!ch && ch.exercisesTotal > 0 && ch.exercisesCompleted >= ch.exercisesTotal
    },
  },
  {
    id: 'chapter-reshape-manipulation',
    title: 'Reshape & Manipulation',
    description: 'Alle Übungen in Kapitel 5 abgeschlossen',
    icon: '🔄',
    check: (s) => {
      const ch = s.chapters['reshape-manipulation']
      return !!ch && ch.exercisesTotal > 0 && ch.exercisesCompleted >= ch.exercisesTotal
    },
  },
  {
    id: 'chapter-statistische-auswertung',
    title: 'Statistische Auswertung',
    description: 'Alle Übungen in Kapitel 7 abgeschlossen',
    icon: '📊',
    check: (s) => {
      const ch = s.chapters['statistische-auswertung']
      return !!ch && ch.exercisesTotal > 0 && ch.exercisesCompleted >= ch.exercisesTotal
    },
  },
  {
    id: 'chapter-praxisprojekt',
    title: 'Praxisprojekt',
    description: 'Alle Übungen in Kapitel 8 abgeschlossen',
    icon: '🏆',
    check: (s) => {
      const ch = s.chapters['praxisprojekt']
      return !!ch && ch.exercisesTotal > 0 && ch.exercisesCompleted >= ch.exercisesTotal
    },
  },
]

const MILESTONE_BADGES: BadgeDefinition[] = [
  {
    id: 'milestone-first',
    title: 'Erster Schritt',
    description: 'Erste Übung gelöst',
    icon: '⭐',
    check: (s) => s.totalExercisesCompleted >= 1,
  },
  {
    id: 'milestone-halfway',
    title: 'Halbzeit',
    description: '24 Übungen gelöst',
    icon: '🌟',
    check: (s) => s.totalExercisesCompleted >= 24,
  },
  {
    id: 'milestone-master',
    title: 'NumPy-Meister',
    description: 'Alle 48 Übungen gelöst',
    icon: '👑',
    check: (s) => s.totalExercisesCompleted >= 48,
  },
]

export const BADGE_DEFINITIONS: BadgeDefinition[] = [...CHAPTER_BADGES, ...MILESTONE_BADGES]

export function evaluateBadges(
  state: LearningProgress,
  addBadge: (badge: string) => void,
): void {
  for (const badge of BADGE_DEFINITIONS) {
    if (!state.badges.includes(badge.id) && badge.check(state)) {
      addBadge(badge.id)
    }
  }
}

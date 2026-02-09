import { describe, it, expect } from 'vitest'
import { BADGE_DEFINITIONS, evaluateBadges } from './badges'
import type { LearningProgress } from '../types'

function createState(overrides: Partial<LearningProgress> = {}): LearningProgress {
  return {
    chapters: {
      'warum-numpy': { id: 'warum-numpy', visited: false, exercisesCompleted: 0, exercisesTotal: 3, completedExerciseIds: [] },
      'array-grundlagen': { id: 'array-grundlagen', visited: false, exercisesCompleted: 0, exercisesTotal: 7, completedExerciseIds: [] },
      'indexing-slicing': { id: 'indexing-slicing', visited: false, exercisesCompleted: 0, exercisesTotal: 9, completedExerciseIds: [] },
      'array-operationen': { id: 'array-operationen', visited: false, exercisesCompleted: 0, exercisesTotal: 7, completedExerciseIds: [] },
      'broadcasting': { id: 'broadcasting', visited: false, exercisesCompleted: 0, exercisesTotal: 5, completedExerciseIds: [] },
      'reshape-manipulation': { id: 'reshape-manipulation', visited: false, exercisesCompleted: 0, exercisesTotal: 6, completedExerciseIds: [] },
      'statistische-auswertung': { id: 'statistische-auswertung', visited: false, exercisesCompleted: 0, exercisesTotal: 7, completedExerciseIds: [] },
      'praxisprojekt': { id: 'praxisprojekt', visited: false, exercisesCompleted: 0, exercisesTotal: 4, completedExerciseIds: [] },
    },
    totalExercisesCompleted: 0,
    badges: [],
    version: 2,
    ...overrides,
  }
}

describe('BADGE_DEFINITIONS', () => {
  it('has 11 badge definitions (8 chapter + 3 milestone)', () => {
    expect(BADGE_DEFINITIONS).toHaveLength(11)
  })

  it('milestone-first triggers at 1 exercise completed', () => {
    const badge = BADGE_DEFINITIONS.find((b) => b.id === 'milestone-first')!
    expect(badge.check(createState({ totalExercisesCompleted: 0 }))).toBe(false)
    expect(badge.check(createState({ totalExercisesCompleted: 1 }))).toBe(true)
  })

  it('milestone-halfway triggers at 24 exercises completed', () => {
    const badge = BADGE_DEFINITIONS.find((b) => b.id === 'milestone-halfway')!
    expect(badge.check(createState({ totalExercisesCompleted: 23 }))).toBe(false)
    expect(badge.check(createState({ totalExercisesCompleted: 24 }))).toBe(true)
  })

  it('milestone-master triggers at 48 exercises completed', () => {
    const badge = BADGE_DEFINITIONS.find((b) => b.id === 'milestone-master')!
    expect(badge.check(createState({ totalExercisesCompleted: 47 }))).toBe(false)
    expect(badge.check(createState({ totalExercisesCompleted: 48 }))).toBe(true)
  })

  it('chapter badge triggers when all exercises in chapter are completed', () => {
    const badge = BADGE_DEFINITIONS.find((b) => b.id === 'chapter-warum-numpy')!
    const state = createState()
    state.chapters['warum-numpy'].exercisesCompleted = 3
    expect(badge.check(state)).toBe(true)
  })

  it('chapter badge does not trigger with 0 exercisesTotal', () => {
    const badge = BADGE_DEFINITIONS.find((b) => b.id === 'chapter-warum-numpy')!
    const state = createState()
    state.chapters['warum-numpy'].exercisesTotal = 0
    state.chapters['warum-numpy'].exercisesCompleted = 0
    expect(badge.check(state)).toBe(false)
  })
})

describe('evaluateBadges', () => {
  it('calls addBadge for newly earned badges', () => {
    const added: string[] = []
    const state = createState({ totalExercisesCompleted: 1 })
    evaluateBadges(state, (id) => added.push(id))
    expect(added).toContain('milestone-first')
  })

  it('does not call addBadge for already earned badges', () => {
    const added: string[] = []
    const state = createState({ totalExercisesCompleted: 1, badges: ['milestone-first'] })
    evaluateBadges(state, (id) => added.push(id))
    expect(added).not.toContain('milestone-first')
  })
})

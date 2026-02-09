import { describe, it, expect, beforeEach } from 'vitest'
import { useProgressStore } from './progressStore'

describe('progressStore', () => {
  beforeEach(() => {
    useProgressStore.getState().resetProgress()
  })

  it('markChapterVisited marks a chapter as visited', () => {
    useProgressStore.getState().markChapterVisited('warum-numpy')
    const ch = useProgressStore.getState().chapters['warum-numpy']
    expect(ch.visited).toBe(true)
    expect(useProgressStore.getState().lastVisited).toBe('warum-numpy')
  })

  it('markChapterVisited is idempotent', () => {
    useProgressStore.getState().markChapterVisited('warum-numpy')
    useProgressStore.getState().markChapterVisited('warum-numpy')
    expect(useProgressStore.getState().chapters['warum-numpy'].visited).toBe(true)
  })

  it('completeExercise increments count and adds exercise id', () => {
    useProgressStore.getState().completeExercise('warum-numpy', 'ex-1')
    const ch = useProgressStore.getState().chapters['warum-numpy']
    expect(ch.exercisesCompleted).toBe(1)
    expect(ch.completedExerciseIds).toEqual(['ex-1'])
    expect(useProgressStore.getState().totalExercisesCompleted).toBe(1)
  })

  it('completeExercise deduplicates by exerciseId', () => {
    useProgressStore.getState().completeExercise('warum-numpy', 'ex-1')
    useProgressStore.getState().completeExercise('warum-numpy', 'ex-1')
    const ch = useProgressStore.getState().chapters['warum-numpy']
    expect(ch.exercisesCompleted).toBe(1)
    expect(ch.completedExerciseIds).toEqual(['ex-1'])
    expect(useProgressStore.getState().totalExercisesCompleted).toBe(1)
  })

  it('completeExercise allows different exercises in same chapter', () => {
    useProgressStore.getState().completeExercise('warum-numpy', 'ex-1')
    useProgressStore.getState().completeExercise('warum-numpy', 'ex-2')
    const ch = useProgressStore.getState().chapters['warum-numpy']
    expect(ch.exercisesCompleted).toBe(2)
    expect(ch.completedExerciseIds).toEqual(['ex-1', 'ex-2'])
    expect(useProgressStore.getState().totalExercisesCompleted).toBe(2)
  })

  it('setExercisesTotal sets the total for a chapter', () => {
    useProgressStore.getState().setExercisesTotal('array-grundlagen', 7)
    expect(useProgressStore.getState().chapters['array-grundlagen'].exercisesTotal).toBe(7)
  })

  it('addBadge adds a badge', () => {
    useProgressStore.getState().addBadge('milestone-first')
    expect(useProgressStore.getState().badges).toEqual(['milestone-first'])
  })

  it('addBadge deduplicates', () => {
    useProgressStore.getState().addBadge('milestone-first')
    useProgressStore.getState().addBadge('milestone-first')
    expect(useProgressStore.getState().badges).toEqual(['milestone-first'])
  })

  it('resetProgress resets to default state', () => {
    useProgressStore.getState().markChapterVisited('warum-numpy')
    useProgressStore.getState().completeExercise('warum-numpy', 'ex-1')
    useProgressStore.getState().addBadge('milestone-first')

    useProgressStore.getState().resetProgress()

    expect(useProgressStore.getState().totalExercisesCompleted).toBe(0)
    expect(useProgressStore.getState().badges).toEqual([])
    expect(useProgressStore.getState().chapters['warum-numpy'].visited).toBe(false)
    expect(useProgressStore.getState().chapters['warum-numpy'].exercisesCompleted).toBe(0)
    expect(useProgressStore.getState().chapters['warum-numpy'].completedExerciseIds).toEqual([])
  })

  it('completeExercise ignores unknown chapters', () => {
    const before = useProgressStore.getState().totalExercisesCompleted
    useProgressStore.getState().completeExercise('nonexistent', 'ex-1')
    expect(useProgressStore.getState().totalExercisesCompleted).toBe(before)
  })
})

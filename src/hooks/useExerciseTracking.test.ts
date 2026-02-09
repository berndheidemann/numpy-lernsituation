import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useExerciseTracking } from './useExerciseTracking'
import { useProgressStore } from '../store/progressStore'

describe('useExerciseTracking', () => {
  beforeEach(() => {
    useProgressStore.getState().resetProgress()
  })

  it('sets exercisesTotal on mount', () => {
    renderHook(() => useExerciseTracking('warum-numpy', 5))
    expect(useProgressStore.getState().chapters['warum-numpy'].exercisesTotal).toBe(5)
  })

  it('createOnComplete calls completeExercise with correct ids', () => {
    const { result } = renderHook(() => useExerciseTracking('warum-numpy', 1))

    act(() => {
      result.current.createOnComplete('ex-1')()
    })

    const ch = useProgressStore.getState().chapters['warum-numpy']
    expect(ch.exercisesCompleted).toBe(1)
    expect(ch.completedExerciseIds).toEqual(['ex-1'])
  })

  it('dedup works through createOnComplete', () => {
    const { result } = renderHook(() => useExerciseTracking('warum-numpy', 1))

    act(() => {
      const onComplete = result.current.createOnComplete('ex-1')
      onComplete()
      onComplete()
    })

    const ch = useProgressStore.getState().chapters['warum-numpy']
    expect(ch.exercisesCompleted).toBe(1)
  })
})

import { useEffect, useCallback, useRef } from 'react'
import { useProgressStore } from '../store/progressStore'
import { evaluateBadges } from '../data/badges'

export function useExerciseTracking(chapterId: string, exerciseCount: number) {
  const setExercisesTotal = useProgressStore((s) => s.setExercisesTotal)
  const completeExercise = useProgressStore((s) => s.completeExercise)
  const addBadge = useProgressStore((s) => s.addBadge)
  const mounted = useRef(false)

  useEffect(() => {
    if (!mounted.current) {
      setExercisesTotal(chapterId, exerciseCount)
      mounted.current = true
    }
  }, [chapterId, exerciseCount, setExercisesTotal])

  const createOnComplete = useCallback(
    (exerciseId: string) => () => {
      completeExercise(chapterId, exerciseId)
      const state = useProgressStore.getState()
      evaluateBadges(state, addBadge)
    },
    [chapterId, completeExercise, addBadge],
  )

  return { createOnComplete }
}

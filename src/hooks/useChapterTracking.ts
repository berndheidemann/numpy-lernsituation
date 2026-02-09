import { useEffect } from 'react'
import { useProgressStore } from '../store/progressStore'

export function useChapterTracking(chapterId: string) {
  const markChapterVisited = useProgressStore((s) => s.markChapterVisited)

  useEffect(() => {
    markChapterVisited(chapterId)
  }, [chapterId, markChapterVisited])
}

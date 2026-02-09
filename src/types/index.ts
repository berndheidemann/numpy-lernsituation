/** Status einer einzelnen Übung */
export type ExerciseStatus = 'pending' | 'in_progress' | 'completed'

/** Ergebnis einer Coding-Übung */
export interface CodingResult {
  passed: boolean
  output: string
  error?: string
}

/** Fortschritt für ein Kapitel */
export interface ChapterProgress {
  id: string
  visited: boolean
  exercisesCompleted: number
  exercisesTotal: number
}

/** Globaler Lernfortschritt */
export interface LearningProgress {
  chapters: Record<string, ChapterProgress>
  totalExercisesCompleted: number
  badges: string[]
  lastVisited?: string
  version: number
}

/** Python-Ausführungsergebnis */
export interface PythonResult {
  stdout: string
  stderr: string
  error?: string
  executionTime?: number
}

/** Status der Pyodide-Umgebung */
export type PyodideStatus = 'idle' | 'loading' | 'ready' | 'error'

/** Coding-Übung Definition */
export interface CodingExerciseDefinition {
  id: string
  title: string
  description: string
  starterCode: string
  solution?: string
  validationCode: string
  hints?: string[]
}

/** Quiz-Frage */
export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

/** Drag & Drop Item */
export interface DragItem {
  id: string
  content: string
}

/** Drag & Drop Zone */
export interface DropZone {
  id: string
  label: string
  acceptedItemId: string
}

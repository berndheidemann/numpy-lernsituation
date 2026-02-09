import { useEffect, useRef, useCallback, useState } from 'react'
import { EditorView, keymap } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { basicSetup } from 'codemirror'
import { python } from '@codemirror/lang-python'
import { indentWithTab } from '@codemirror/commands'

interface PythonEditorProps {
  defaultCode: string
  onRun: (code: string) => void
  onReset?: () => void
  running?: boolean
  readOnly?: boolean
}

const editorTheme = EditorView.theme({
  '&': {
    fontSize: '14px',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
  },
  '.cm-content': {
    fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
    padding: '8px 0',
  },
  '.cm-gutters': {
    backgroundColor: '#f8fafc',
    borderRight: '1px solid #e2e8f0',
    color: '#94a3b8',
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#e2e8f0',
  },
  '.cm-activeLine': {
    backgroundColor: '#f1f5f9',
  },
  '&.cm-focused': {
    outline: '2px solid #3b82f6',
    outlineOffset: '-1px',
  },
})

export default function PythonEditor({
  defaultCode,
  onRun,
  onReset,
  running = false,
  readOnly = false,
}: PythonEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const [code, setCode] = useState(defaultCode)

  useEffect(() => {
    if (!editorRef.current) return

    const state = EditorState.create({
      doc: defaultCode,
      extensions: [
        basicSetup,
        python(),
        editorTheme,
        keymap.of([indentWithTab]),
        EditorState.tabSize.of(4),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            setCode(update.state.doc.toString())
          }
        }),
        ...(readOnly ? [EditorState.readOnly.of(true)] : []),
      ],
    })

    const view = new EditorView({
      state,
      parent: editorRef.current,
    })

    viewRef.current = view

    return () => {
      view.destroy()
      viewRef.current = null
    }
    // Only recreate editor when defaultCode identity changes (reset)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultCode, readOnly])

  const handleRun = useCallback(() => {
    if (!running) {
      onRun(code)
    }
  }, [code, onRun, running])

  const handleReset = useCallback(() => {
    if (viewRef.current) {
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: defaultCode,
        },
      })
    }
    onReset?.()
  }, [defaultCode, onReset])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button
          onClick={handleRun}
          disabled={running}
          className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Code ausführen"
        >
          {running ? (
            <>
              <span className="animate-spin inline-block h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
              Läuft...
            </>
          ) : (
            <>
              <span aria-hidden="true">&#9654;</span>
              Ausführen
            </>
          )}
        </button>
        <button
          onClick={handleReset}
          disabled={running}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 disabled:opacity-50 transition-colors"
          aria-label="Code zurücksetzen"
        >
          <span aria-hidden="true">&#8634;</span>
          Zurücksetzen
        </button>
      </div>
      <div ref={editorRef} data-testid="python-editor" />
    </div>
  )
}

import { useEffect, useRef } from 'react'
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { basicSetup } from 'codemirror'
import { python } from '@codemirror/lang-python'

interface CodeBlockProps {
  code: string
  title?: string
}

const readOnlyTheme = EditorView.theme({
  '&': {
    fontSize: '13px',
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
  '.cm-cursor': {
    display: 'none',
  },
})

export default function CodeBlock({ code, title }: CodeBlockProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!editorRef.current) return

    const state = EditorState.create({
      doc: code.trim(),
      extensions: [
        basicSetup,
        python(),
        readOnlyTheme,
        EditorState.readOnly.of(true),
        EditorView.editable.of(false),
      ],
    })

    const view = new EditorView({
      state,
      parent: editorRef.current,
    })

    return () => view.destroy()
  }, [code])

  return (
    <div className="my-4">
      {title && (
        <p className="text-xs font-medium text-slate-500 mb-1">{title}</p>
      )}
      <div ref={editorRef} data-testid="code-block" />
    </div>
  )
}

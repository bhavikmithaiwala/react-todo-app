import { useState } from 'react'
import type { TaskDraft } from '../../types/task'
import { parseQuickAdd } from '../../utils/quickAdd'
export function QuickAdd({ onAdd }: { onAdd: (draft: TaskDraft) => void }) {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const draft = parseQuickAdd(input)
  return <section className="panel quick-add"><div className="section-heading"><h2>A thought into a task</h2><span className="category">Smart Quick Add</span></div><form onSubmit={event => { event.preventDefault(); if (!draft.title || draft.title.length > 200 || draft.category.length > 100) { setError('Enter a title of 1–200 characters and a category up to 100 characters.'); return } onAdd(draft); setInput(''); setError('') }}><label htmlFor="quick-add">What’s next?</label><div className="quick-row"><input id="quick-add" value={input} onChange={event => setInput(event.target.value)} placeholder="Finish portfolio tomorrow #career !high" /><button className="primary">Add task</button></div>{input && <p className="quick-preview">Preview: {draft.title || '(title needed)'} · {draft.category} · {draft.priority}{draft.dueDate && ` · ${draft.dueDate}`}</p>}{error && <p role="alert">{error}</p>}</form><p className="quick-hint">Try #category and !high, !medium, or !low.</p></section>
}

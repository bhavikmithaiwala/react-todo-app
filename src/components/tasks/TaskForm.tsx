import { useState } from 'react'
import type { TaskDraft } from '../../types/task'
import { emptyDraft } from '../../types/task'

export function TaskForm({ onSave, initial = emptyDraft, onCancel }: { onSave: (draft: TaskDraft) => void; initial?: TaskDraft; onCancel?: () => void }) {
  const [draft, setDraft] = useState(initial)
  const [error, setError] = useState('')
  return <form onSubmit={event => {
    event.preventDefault()
    if (!draft.title.trim()) { setError('Please enter a task title.'); return }
    if (draft.title.trim().length > 200) { setError('Use 200 characters or fewer.'); return }
    onSave({ ...draft, title: draft.title.trim(), description: draft.description.trim(), category: draft.category.trim() || 'Personal' })
    setDraft(emptyDraft); setError('')
  }}><label htmlFor="task-title">Task title</label><input id="task-title" value={draft.title} aria-invalid={!!error} aria-describedby={error ? 'title-error' : undefined} onChange={event => setDraft({ ...draft, title: event.target.value })} placeholder="What would you like to get done?" />{error && <p id="title-error" role="alert">{error}</p>}<label htmlFor="task-description">Description</label><textarea id="task-description" maxLength={10000} rows={3} value={draft.description} onChange={event => setDraft({ ...draft, description: event.target.value })} placeholder="Add a little context (optional)" /><div className="form-actions">{onCancel && <button type="button" onClick={onCancel}>Cancel</button>}<button className="primary" type="submit">{onCancel ? 'Save changes' : 'Add task'}</button></div></form>
}


import { useState } from 'react'
import type { TaskDraft } from '../../types/task'
import { emptyDraft } from '../../types/task'

export function TaskForm({ onSave, initial = emptyDraft, onCancel }: { onSave: (draft: TaskDraft) => void; initial?: TaskDraft; onCancel?: () => void }) {
  const [draft, setDraft] = useState(initial)
  return <form onSubmit={event => { event.preventDefault(); onSave(draft); setDraft(emptyDraft) }}><label htmlFor="task-title">Task title</label><input id="task-title" value={draft.title} onChange={event => setDraft({ ...draft, title: event.target.value })} placeholder="What would you like to get done?" /><div className="form-actions">{onCancel && <button type="button" onClick={onCancel}>Cancel</button>}<button className="primary" type="submit">{onCancel ? 'Save changes' : 'Add task'}</button></div></form>
}

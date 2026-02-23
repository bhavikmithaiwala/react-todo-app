import { useState } from 'react'
import type { TaskDraft } from '../../types/task'
import { emptyDraft } from '../../types/task'

export function TaskForm({
  onSave,
  initial = emptyDraft,
  onCancel,
}: {
  onSave: (draft: TaskDraft) => void
  initial?: TaskDraft
  onCancel?: () => void
}) {
  const [draft, setDraft] = useState(initial)
  const [error, setError] = useState('')
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        if (!draft.title.trim()) {
          setError('Please enter a task title.')
          return
        }
        if (draft.title.trim().length > 200) {
          setError('Use 200 characters or fewer.')
          return
        }
        onSave({
          ...draft,
          title: draft.title.trim(),
          description: draft.description.trim(),
          category: draft.category.trim() || 'Personal',
        })
        setDraft(emptyDraft)
        setError('')
      }}
    >
      <label htmlFor="task-title">Task title</label>
      <input
        id="task-title"
        value={draft.title}
        aria-invalid={!!error}
        aria-describedby={error ? 'title-error' : undefined}
        onChange={(event) => setDraft({ ...draft, title: event.target.value })}
        placeholder="What would you like to get done?"
      />
      {error && (
        <p id="title-error" role="alert">
          {error}
        </p>
      )}
      <label htmlFor="task-description">Description</label>
      <textarea
        id="task-description"
        maxLength={10000}
        rows={3}
        value={draft.description}
        onChange={(event) =>
          setDraft({ ...draft, description: event.target.value })
        }
        placeholder="Add a little context (optional)"
      />
      <label htmlFor="task-priority">Priority</label>
      <select
        id="task-priority"
        value={draft.priority}
        onChange={(event) =>
          setDraft({
            ...draft,
            priority: event.target.value as TaskDraft['priority'],
          })
        }
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <label htmlFor="task-due">Due date</label>
      <input
        id="task-due"
        type="date"
        value={draft.dueDate}
        onChange={(event) =>
          setDraft({ ...draft, dueDate: event.target.value })
        }
      />
      <label htmlFor="task-category">Category</label>
      <input
        id="task-category"
        maxLength={100}
        value={draft.category}
        onChange={(event) =>
          setDraft({ ...draft, category: event.target.value })
        }
        list="categories"
      />
      <datalist id="categories">
        <option>Personal</option>
        <option>Work</option>
        <option>Study</option>
        <option>Career</option>
      </datalist>
      <div className="form-actions">
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button className="primary" type="submit">
          {onCancel ? 'Save changes' : 'Add task'}
        </button>
      </div>
    </form>
  )
}

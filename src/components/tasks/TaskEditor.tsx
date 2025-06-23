import { useEffect, useRef } from 'react'
import type { Task, TaskDraft } from '../../types/task'
import { TaskForm } from './TaskForm'
export function TaskEditor({
  task,
  onSave,
  onClose,
}: {
  task: Task | null
  onSave: (draft: TaskDraft) => void
  onClose: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current
    dialog?.showModal()
    return () => dialog?.close()
  }, [])
  return (
    <dialog
      className="editor"
      ref={ref}
      aria-labelledby="editor-title"
      onCancel={onClose}
    >
      <h2 id="editor-title">{task ? 'Edit task' : 'Make your next move'}</h2>
      <p>Small steps lead to big things.</p>
      <TaskForm
        initial={task ?? undefined}
        onSave={onSave}
        onCancel={onClose}
      />
    </dialog>
  )
}

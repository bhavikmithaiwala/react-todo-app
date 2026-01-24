import type { Task } from '../../types/task'
export interface TaskActions { onToggle: (id: string) => void; onDelete: (id: string) => void; onEdit: (task: Task) => void }
export function TaskItem({ task, onToggle, onDelete, onEdit }: TaskActions & { task: Task }) {
  return <article className={task.completed ? 'task completed' : 'task'}><input type="checkbox" aria-label={`Complete ${task.title}`} checked={task.completed} onChange={() => onToggle(task.id)} /><div className="task-body"><strong>{task.title}</strong>{task.description && <p>{task.description}</p>}</div><button onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`}>Edit</button><button onClick={() => onDelete(task.id)} aria-label={`Delete ${task.title}`}>Delete</button></article>
}


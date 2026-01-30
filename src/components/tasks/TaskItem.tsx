import { formatDate, isOverdue } from '../../utils/dates'
import type { Task } from '../../types/task'
export interface TaskActions { onToggle: (id: string) => void; onDelete: (id: string) => void; onEdit: (task: Task) => void }
export function TaskItem({ task, onToggle, onDelete, onEdit }: TaskActions & { task: Task }) {
  return <article className={task.completed ? 'task completed' : 'task'}><input type="checkbox" aria-label={`Complete ${task.title}`} checked={task.completed} onChange={() => onToggle(task.id)} /><div className="task-body"><strong>{task.title}</strong><span className={`badge ${task.priority}`}>{task.priority}</span>{task.description && <p>{task.description}</p>}<p className={isOverdue(task.dueDate, task.completed) ? "overdue" : ""}>{formatDate(task.dueDate)}{isOverdue(task.dueDate, task.completed) ? " · Overdue" : ""}</p></div><button onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`}>Edit</button><button onClick={() => onDelete(task.id)} aria-label={`Delete ${task.title}`}>Delete</button></article>
}




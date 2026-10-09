import type { Task } from '../types/task'
import { isOverdue, localDate } from './dates'
export function taskStats(tasks: Task[], today = localDate()) {
  const completed = tasks.filter(task => task.completed).length
  return { total: tasks.length, completed, pending: tasks.length - completed, overdue: tasks.filter(task => isOverdue(task.dueDate, task.completed, today)).length, percent: tasks.length ? Math.round(completed / tasks.length * 100) : 0 }
}

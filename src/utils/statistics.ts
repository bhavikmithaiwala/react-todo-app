import type { Task } from '../types/task'
import { isOverdue, localDate } from './dates'
export function taskStats(tasks: Task[], today = localDate()) {
  const completed = tasks.filter(task => task.completed).length
  return { total: tasks.length, completed, pending: tasks.length - completed, overdue: tasks.filter(task => isOverdue(task.dueDate, task.completed, today)).length, percent: tasks.length ? Math.round(completed / tasks.length * 100) : 0 }
}
export function weekHistory(tasks: Task[], now = new Date()) {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  start.setDate(start.getDate() - (start.getDay() + 6) % 7)
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(start); day.setDate(day.getDate() + index)
    const date = localDate(day)
    return { date, label: day.toLocaleDateString(undefined, { weekday: 'short' }), count: tasks.filter(task => task.completedAt && localDate(new Date(task.completedAt)) === date).length }
  })
}
export function dailyHistory(tasks: Task[]) {
  const counts = new Map<string, number>()
  for (const task of tasks) if (task.completedAt) { const date = localDate(new Date(task.completedAt)); counts.set(date, (counts.get(date) ?? 0) + 1) }
  return [...counts.entries()].sort(([a], [b]) => b.localeCompare(a))
}

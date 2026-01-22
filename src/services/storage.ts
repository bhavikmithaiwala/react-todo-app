import type { Task } from '../types/task'
import { isDate } from '../utils/dates'
export const TASK_KEY = 'taskdeck.tasks.v1'
const timestamp = (value: unknown) => typeof value === 'string' && /^\d{4}-\d\d-\d\dT/.test(value) && Number.isFinite(Date.parse(value))
export function validateTasks(value: unknown): Task[] {
  if (!Array.isArray(value) || value.length > 10000) throw new Error('Backup must contain an array of up to 10,000 tasks.')
  const ids = new Set<string>()
  for (const task of value) {
    if (!task || typeof task !== 'object' || typeof task.id !== 'string' || !task.id || ids.has(task.id) || typeof task.title !== 'string' || !task.title.trim() || task.title.length > 200 || typeof task.description !== 'string' || task.description.length > 10000 || typeof task.category !== 'string' || !task.category.trim() || task.category.length > 100 || typeof task.completed !== 'boolean' || !['low', 'medium', 'high'].includes(task.priority) || (task.dueDate !== '' && !isDate(task.dueDate)) || !timestamp(task.createdAt) || !timestamp(task.updatedAt) || (task.completed ? !timestamp(task.completedAt) : task.completedAt !== null)) throw new Error('Invalid task data. Check the backup fields and dates.')
    ids.add(task.id)
  }
  return value.map(task => ({ id: task.id, title: task.title.trim(), description: task.description, category: task.category.trim(), priority: task.priority, dueDate: task.dueDate, completed: task.completed, createdAt: task.createdAt, updatedAt: task.updatedAt, completedAt: task.completedAt }))
}
export function loadTasks(): { tasks: Task[]; error: string } {
  try { const saved = localStorage.getItem(TASK_KEY); return { tasks: saved ? validateTasks(JSON.parse(saved)) : [], error: '' } }
  catch { return { tasks: [], error: 'Saved tasks could not be read. Your stored data has been preserved. Export or restore a valid backup in Settings.' } }
}

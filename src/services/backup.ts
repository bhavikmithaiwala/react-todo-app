import type { Task, DailyFocus } from '../types/task'
import { validateTasks } from './storage'
import { isDate } from '../utils/dates'
export interface Backup { version: 1; exportedAt: string; tasks: Task[]; focus: DailyFocus }
export function parseBackup(text: string): { tasks: Task[]; focus: DailyFocus | null } {
  const data = JSON.parse(text)
  if (Array.isArray(data)) return { tasks: validateTasks(data), focus: null }
  if (!data || data.version !== 1) throw new Error('Unsupported backup version.')
  const tasks = validateTasks(data.tasks)
  const focus = data.focus
  if (!focus || !isDate(focus.date) || !Array.isArray(focus.ids) || focus.ids.length > 3 || new Set(focus.ids).size !== focus.ids.length || !focus.ids.every((id: unknown) => typeof id === 'string' && tasks.some(task => task.id === id))) throw new Error('Invalid daily focus data.')
  return { tasks, focus: { date: focus.date, ids: focus.ids } }
}
export function downloadBackup(tasks: Task[], focus: DailyFocus) {
  const backup: Backup = { version: 1, exportedAt: new Date().toISOString(), tasks, focus: { ...focus, ids: focus.ids.filter(id => tasks.some(task => task.id === id)) } }
  const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }))
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = `taskdeck-${new Date().toISOString().slice(0, 10)}.json`; anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

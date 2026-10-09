import type { DailyFocus } from '../types/task'
export function toggleFocus(focus: DailyFocus, id: string, date: string): DailyFocus {
  const ids = focus.date === date ? focus.ids : []
  if (ids.includes(id)) return { date, ids: ids.filter(value => value !== id) }
  if (ids.length >= 3) throw new Error('Your Top 3 is full. Remove a task before adding another.')
  return { date, ids: [...ids, id] }
}

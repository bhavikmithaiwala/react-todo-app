import type { DailyFocus } from '../types/task'
import { localDate } from '../utils/dates'
export const FOCUS_KEY = 'taskdeck.focus.v1'
export function loadFocus(): DailyFocus {
  const date = localDate()
  try {
    const saved = JSON.parse(localStorage.getItem(FOCUS_KEY) || 'null')
    if (
      saved?.date === date &&
      Array.isArray(saved.ids) &&
      saved.ids.length <= 3 &&
      saved.ids.every((id: unknown) => typeof id === 'string') &&
      new Set(saved.ids).size === saved.ids.length
    )
      return { date, ids: saved.ids }
  } catch {
    /* Invalid daily focus can safely start fresh. */
  }
  return { date, ids: [] }
}

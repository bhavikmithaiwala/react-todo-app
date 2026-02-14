import type { TaskDraft } from '../types/task'
import { emptyDraft } from '../types/task'
export function parseQuickAdd(input: string, now = new Date()): TaskDraft {
  void now
  let title = input.trim()
  const draft = { ...emptyDraft, title }
  const categories = [...title.matchAll(/(?:^|\s)#([\p{L}\p{N}_-]+)/gu)]
  const priorities = [...title.matchAll(/(?:^|\s)!(low|medium|high)\b/gi)]
  if (categories.length === 1) { draft.category = categories[0][1]; title = title.replace(categories[0][0], ' ') }
  if (priorities.length === 1) { draft.priority = priorities[0][1].toLowerCase() as TaskDraft['priority']; title = title.replace(priorities[0][0], ' ') }
  draft.title = title.replace(/\s+/g, ' ').trim()
  return draft
}

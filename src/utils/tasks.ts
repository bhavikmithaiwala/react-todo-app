import type { Task, Status, Sort, Priority } from '../types/task'
export interface Filters { search: string; status: Status; priority: string; category: string; sort: Sort }
export const defaultFilters: Filters = { search: '', status: 'all', priority: '', category: '', sort: 'newest' }
export function filterTasks(tasks: Task[], filters: Filters): Task[] {
  const ranks: Record<Priority, number> = { high: 0, medium: 1, low: 2 }
  return tasks.filter(task => (filters.status === 'all' || task.completed === (filters.status === 'completed')) && (!filters.priority || task.priority === filters.priority) && (!filters.category || task.category === filters.category) && `${task.title} ${task.description}`.toLowerCase().includes(filters.search.toLowerCase().trim())).sort((a, b) => {
    if (filters.sort === 'priority') return ranks[a.priority] - ranks[b.priority]
    if (filters.sort === 'due') return (a.dueDate || '9999').localeCompare(b.dueDate || '9999')
    return filters.sort === 'oldest' ? a.createdAt.localeCompare(b.createdAt) : b.createdAt.localeCompare(a.createdAt)
  })
}

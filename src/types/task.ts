export type Priority = 'low' | 'medium' | 'high'
export interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  priority: Priority
  category: string
  dueDate: string
  createdAt: string
  updatedAt: string
  completedAt: string | null
}
export type TaskDraft = Pick<
  Task,
  'title' | 'description' | 'priority' | 'category' | 'dueDate'
>
export interface DailyFocus {
  date: string
  ids: string[]
}
export type Status = 'all' | 'active' | 'completed'
export type Sort = 'newest' | 'oldest' | 'priority' | 'due'
export const emptyDraft: TaskDraft = {
  title: '',
  description: '',
  priority: 'medium',
  category: 'Personal',
  dueDate: '',
}

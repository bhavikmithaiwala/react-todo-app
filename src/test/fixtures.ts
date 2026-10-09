import type { Task } from '../types/task'
export function task(overrides: Partial<Task> = {}): Task {
  return { id: 'a', title: 'Review React', description: 'Read hooks documentation', category: 'Study', priority: 'medium', dueDate: '', completed: false, createdAt: '2026-10-05T12:00:00.000Z', updatedAt: '2026-10-05T12:00:00.000Z', completedAt: null, ...overrides }
}

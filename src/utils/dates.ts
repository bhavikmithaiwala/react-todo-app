export function localDate(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
export function isDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false
  const date = new Date(`${value}T12:00:00`)
  return !Number.isNaN(date.getTime()) && localDate(date) === value
}
export function isOverdue(
  due: string,
  completed: boolean,
  today = localDate(),
) {
  return !completed && !!due && due < today
}
export function formatDate(value: string) {
  return value
    ? new Date(`${value}T12:00:00`).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      })
    : 'No deadline'
}

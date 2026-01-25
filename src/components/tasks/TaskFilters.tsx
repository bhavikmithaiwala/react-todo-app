import type { Filters } from '../../utils/tasks'
export function TaskFilters({ filters, onChange }: { filters: Filters; onChange: (filters: Filters) => void }) {
  return <div className="filters" role="group" aria-label="Task filters">{(['all', 'active', 'completed'] as const).map(status => <button key={status} aria-pressed={filters.status === status} className={filters.status === status ? 'selected' : ''} onClick={() => onChange({ ...filters, status })}>{status[0].toUpperCase() + status.slice(1)}</button>)}</div>
}

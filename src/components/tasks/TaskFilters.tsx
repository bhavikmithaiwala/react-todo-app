import type { Filters } from '../../utils/tasks'
export function TaskFilters({
  filters,
  onChange,
  categories,
}: {
  categories: string[]
  filters: Filters
  onChange: (filters: Filters) => void
}) {
  return (
    <div className="filters" role="group" aria-label="Task filters">
      {(['all', 'active', 'completed'] as const).map((status) => (
        <button
          key={status}
          aria-pressed={filters.status === status}
          className={filters.status === status ? 'selected' : ''}
          onClick={() => onChange({ ...filters, status })}
        >
          {status[0].toUpperCase() + status.slice(1)}
        </button>
      ))}
      <select
        aria-label="Sort tasks"
        value={filters.sort}
        onChange={(event) =>
          onChange({ ...filters, sort: event.target.value as Filters['sort'] })
        }
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="priority">Priority</option>
        <option value="due">Due date</option>
      </select>
      <select
        aria-label="Filter priority"
        value={filters.priority}
        onChange={(event) =>
          onChange({ ...filters, priority: event.target.value })
        }
      >
        <option value="">All priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <select
        aria-label="Filter category"
        value={filters.category}
        onChange={(event) =>
          onChange({ ...filters, category: event.target.value })
        }
      >
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category}>{category}</option>
        ))}
      </select>
    </div>
  )
}

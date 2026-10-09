import type { Task } from '../../types/task'
import { taskStats } from '../../utils/statistics'
export function TaskStats({ tasks }: { tasks: Task[] }) {
  const stats = taskStats(tasks)
  return <><div className="stats-grid">{[['Total tasks', stats.total, '?'], ['Pending', stats.pending, '?'], ['Completed', stats.completed, '?'], ['Overdue', stats.overdue, '!']].map(([label, value, icon]) => <section className="stat-card" key={label}><div className="stat-icon" aria-hidden="true">{icon}</div><p>{label}</p><strong>{value}</strong></section>)}</div><div className="completion"><span>Overall progress</span><progress max={100} value={stats.percent} aria-label="Overall task completion" /><strong>{stats.percent}%</strong></div></>
}

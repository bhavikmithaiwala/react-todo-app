import type { Task } from '../../types/task'
import { formatDate } from '../../utils/dates'
export function DashboardActivity({
  tasks,
  today,
}: {
  tasks: Task[]
  today: string
}) {
  const due = tasks.filter((task) => !task.completed && task.dueDate === today)
  const recent = [...tasks]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 5)
  return (
    <div className="analytics-grid">
      <section className="panel">
        <h2>On the agenda today</h2>
        <p>{due.length} pending tasks due today</p>
        {due.length ? (
          <ul className="history-list">
            {due.map((task) => (
              <li key={task.id}>
                <span>{task.title}</span>
                <span className={`badge ${task.priority}`}>
                  {task.priority}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No deadlines today. A little breathing room.</p>
        )}
      </section>
      <section className="panel">
        <h2>Recent activity</h2>
        {recent.length ? (
          <ul className="history-list">
            {recent.map((task) => (
              <li key={task.id}>
                <span>
                  {task.completed
                    ? 'Completed'
                    : task.updatedAt === task.createdAt
                      ? 'Added'
                      : 'Updated'}
                  : {task.title}
                </span>
                <time dateTime={task.updatedAt}>
                  {formatDate(task.updatedAt.slice(0, 10))}
                </time>
              </li>
            ))}
          </ul>
        ) : (
          <p>Your recent task changes will appear here.</p>
        )}
      </section>
    </div>
  )
}

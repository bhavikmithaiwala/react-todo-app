import type { Task } from '../../types/task'
import { TaskItem } from './TaskItem'
import type { TaskActions } from './TaskItem'
export function TaskList({
  tasks,
  ...actions
}: TaskActions & { tasks: Task[] }) {
  if (!tasks.length)
    return (
      <section className="panel empty">
        <span aria-hidden="true">{'\u2713'}</span>
        <h2>A clear deck. A fresh start.</h2>
        <p>
          Add your first task, or adjust your filters to find what you need.
        </p>
      </section>
    )
  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} {...actions} />
      ))}
    </div>
  )
}

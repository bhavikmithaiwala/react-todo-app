import type { Task } from '../../types/task'
import { TaskItem } from './TaskItem'
import type { TaskActions } from './TaskItem'
export function TaskList({ tasks, ...actions }: TaskActions & { tasks: Task[] }) {
  return <div className="task-list">{tasks.map(task => <TaskItem key={task.id} task={task} {...actions} />)}</div>
}

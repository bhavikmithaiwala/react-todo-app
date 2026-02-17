import type { Task } from '../../types/task'
import { dailyHistory, taskStats, weekHistory } from '../../utils/statistics'
export function Statistics({ tasks }: { tasks: Task[] }) {
  const days = weekHistory(tasks)
  const stats = taskStats(tasks)
  const max = Math.max(1, ...days.map(day => day.count))
  const history = dailyHistory(tasks)
  return <><section className="panel"><div className="section-heading"><div><p className="eyebrow">PROGRESS OVER PERFECTION</p><h2>Your week in focus</h2><p>{days.reduce((sum, day) => sum + day.count, 0)} tasks completed this week · Monday–Sunday</p></div><span className="focus-progress">{stats.percent}% overall</span></div><div className="chart" role="img" aria-label={`Daily completions: ${days.map(day => `${day.label} ${day.count}`).join(', ')}`}>{days.map(day => <div className="chart-column" key={day.date}><strong>{day.count}</strong><div className="chart-track"><div style={{ height: `${day.count / max * 100}%` }} /></div><span>{day.label}</span></div>)}</div></section><div className="analytics-grid"><section className="panel"><h2>Task balance</h2><p>{stats.pending} pending · {stats.completed} completed</p><progress max={Math.max(1, stats.total)} value={stats.completed} aria-label="Completed versus pending tasks" /><p>{stats.overdue} overdue tasks need your attention.</p></section><section className="panel"><h2>Daily productivity history</h2>{history.length ? <ul className="history-list">{history.map(([date, count]) => <li key={date}><time dateTime={date}>{date}</time><strong>{count} completed</strong></li>)}</ul> : <p>Complete your first task to start your history.</p>}</section></div></>
}

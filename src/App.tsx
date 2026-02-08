import { useState } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import type { Section } from './components/layout/Sidebar'
import { TaskForm } from './components/tasks/TaskForm'
import { TaskList } from './components/tasks/TaskList'
import type { Task, TaskDraft } from './types/task'
import { loadTasks, TASK_KEY } from './services/storage'
import { TaskFilters } from './components/tasks/TaskFilters'
import { defaultFilters, filterTasks } from './utils/tasks'
import { TaskStats } from './components/dashboard/TaskStats'
import { ConfirmDialog } from './components/common/ConfirmDialog'
import { localDate } from './utils/dates'
import { useTheme } from './hooks/useTheme'
import { Toast } from './components/common/Toast'
import './App.css'

export default function App() {
  const { theme, toggleTheme, error: themeError } = useTheme()
  const [section, setSection] = useState<Section>('Dashboard')
  const [loaded] = useState(loadTasks)
  const [tasks, setTasks] = useState<Task[]>(loaded.tasks)
  const [deleted, setDeleted] = useState<Task | null>(null)
  const [confirm, setConfirm] = useState(false)
  const [filters, setFilters] = useState(defaultFilters)
  const [editing, setEditing] = useState<Task | null>(null)
  const [message, setMessage] = useState(loaded.error)
  function updateTasks(next: Task[]) {
    setTasks(next)
    try { localStorage.setItem(TASK_KEY, JSON.stringify(next)); setMessage('') }
    catch { setMessage('Changes could not be saved. Export a backup before closing this page.') }
  }
  function addTask(draft: TaskDraft) {
    const now = new Date().toISOString()
    updateTasks([{ ...draft, id: crypto.randomUUID(), completed: false, createdAt: now, updatedAt: now, completedAt: null }, ...tasks]); setMessage("Task added.")
  }
  function toggle(id: string) { updateTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed, completedAt: task.completed ? null : new Date().toISOString(), updatedAt: new Date().toISOString() } : task)) }
  const today = localDate()
  const viewTasks = tasks.filter(task => section === 'Today' ? !task.completed && task.dueDate === today : section === 'Upcoming' ? !task.completed && task.dueDate > today : section === 'Completed' ? task.completed : true)
  function remove(id: string) { setDeleted(tasks.find(task => task.id === id) ?? null); updateTasks(tasks.filter(task => task.id !== id)); setMessage("Task deleted. You can undo this action.") }
  return <div className="app-shell"><a href="#main" className="skip-link">Skip to main content</a><Sidebar section={section} onNavigate={setSection} /><div className="workspace"><header className="header"><span>Personal workspace</span><input aria-label="Search tasks" placeholder="Search tasks…" value={filters.search} onChange={event => setFilters({ ...filters, search: event.target.value })} /><button onClick={toggleTheme} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>{theme === "light" ? "?" : "?"}</button></header><main id="main" tabIndex={-1}><p className="eyebrow">LET’S MAKE TODAY COUNT</p><h1>{section}</h1>{themeError && <p role="alert">{themeError}</p>}{message && <p role="alert">{message}</p>}<p>Your space for a more focused day.</p><TaskStats tasks={tasks} /><section className="panel"><TaskForm key={editing?.id ?? "new"} initial={editing ?? undefined} onCancel={editing ? () => setEditing(null) : undefined} onSave={draft => { if (editing) { updateTasks(tasks.map(task => task.id === editing.id ? { ...task, ...draft, updatedAt: new Date().toISOString() } : task)); setEditing(null) } else addTask(draft) }} /></section><button disabled={!tasks.some(task => task.completed)} onClick={() => setConfirm(true)}>Clear completed</button><TaskFilters categories={[...new Set(tasks.map(task => task.category))].sort()} filters={filters} onChange={setFilters} /><TaskList tasks={filterTasks(viewTasks, filters)} onToggle={toggle} onDelete={remove} onEdit={setEditing} /></main></div>{message && <Toast message={message} onDismiss={() => setMessage("")} onUndo={deleted ? () => { updateTasks([...tasks.filter(task => task.id !== deleted.id), deleted]); setDeleted(null); setMessage("Task restored.") } : undefined} />}{confirm && <ConfirmDialog title="Clear completed tasks?" message="These records will also be removed from your statistics. Export a backup first if you want to keep them." onCancel={() => setConfirm(false)} onConfirm={() => { updateTasks(tasks.filter(task => !task.completed)); setConfirm(false) }} />}</div>
}











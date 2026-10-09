import { useState } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import type { Section } from './components/layout/Sidebar'
import { TaskEditor } from './components/tasks/TaskEditor'
import { TaskList } from './components/tasks/TaskList'
import { TaskFilters } from './components/tasks/TaskFilters'
import { TaskStats } from './components/dashboard/TaskStats'
import { ConfirmDialog } from './components/common/ConfirmDialog'
import { Toast } from './components/common/Toast'
import type { Task, TaskDraft } from './types/task'
import { loadTasks, TASK_KEY } from './services/storage'
import { defaultFilters, filterTasks } from './utils/tasks'
import { localDate } from './utils/dates'
import { useTheme } from './hooks/useTheme'
import { DailyFocus } from './components/dashboard/DailyFocus'
import { toggleFocus } from './utils/focus'
import type { DailyFocus as FocusState } from './types/task'
import { useLocalDay } from './hooks/useLocalDay'
import { loadFocus, FOCUS_KEY } from './services/focusStorage'
import { QuickAdd } from './components/tasks/QuickAdd'
import { Statistics } from './components/dashboard/Statistics'
import { DashboardActivity } from './components/dashboard/DashboardActivity'
import './App.css'

export default function App() {
  const { theme, toggleTheme, error: themeError } = useTheme()
  const [section, setSection] = useState<Section>('Dashboard')
  const [loaded] = useState(loadTasks)
  const [tasks, setTasks] = useState<Task[]>(loaded.tasks)
  const [message, setMessage] = useState(loaded.error)
  const [storageError, setStorageError] = useState(loaded.error)
  const [filters, setFilters] = useState(defaultFilters)
  const [editor, setEditor] = useState<{ task: Task | null } | null>(null)
  const [confirm, setConfirm] = useState(false)
  const [focus, setFocus] = useState<FocusState>(loadFocus)
  const [deleted, setDeleted] = useState<Task | null>(null)
  function updateTasks(next: Task[]) {
    setTasks(next)
    try { localStorage.setItem(TASK_KEY, JSON.stringify(next)); setStorageError('') }
    catch { setStorageError('Changes could not be saved. Export a backup before closing this page.') }
  }
  function saveTask(draft: TaskDraft) {
    const now = new Date().toISOString()
    if (editor?.task) {
      updateTasks(tasks.map(task => task.id === editor.task?.id ? { ...task, ...draft, updatedAt: now } : task))
      setMessage('Task updated.')
    } else {
      updateTasks([{ ...draft, id: crypto.randomUUID(), completed: false, createdAt: now, updatedAt: now, completedAt: null }, ...tasks])
      setMessage('Task added.')
    }
    setEditor(null)
  }
  function toggle(id: string) {
    updateTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed, completedAt: task.completed ? null : new Date().toISOString(), updatedAt: new Date().toISOString() } : task))
  }
  function remove(id: string) {
    setDeleted(tasks.find(task => task.id === id) ?? null)
    updateTasks(tasks.filter(task => task.id !== id)); setMessage('Task deleted. You can undo this action.')
  }
  function selectFocus(id: string) { try { const next = toggleFocus({ ...focus, ids: focus.ids.filter(value => tasks.some(task => task.id === value)) }, id, localDate()); setFocus(next); try { localStorage.setItem(FOCUS_KEY, JSON.stringify(next)) } catch { setMessage("Daily focus could not be saved.") } } catch (error) { setMessage((error as Error).message) } }
  const today = useLocalDay()
  const focusIds = focus.date === today ? focus.ids : []
  const viewTasks = tasks.filter(task => section === 'Today' ? !task.completed && task.dueDate === today : section === 'Upcoming' ? !task.completed && task.dueDate > today : section === 'Completed' ? task.completed : true)
  const visibleTasks = filterTasks(viewTasks, filters)
  return <div className="app-shell">
    <a href="#main" className="skip-link">Skip to main content</a>
    <Sidebar section={section} onNavigate={next => { setSection(next); setFilters(defaultFilters) }} />
    <div className="workspace">
      <header className="header"><span>Personal workspace <span className="header-divider">/</span> {section}</span><input aria-label="Search tasks" placeholder="Search tasks…" value={filters.search} onChange={event => setFilters({ ...filters, search: event.target.value })} /><button onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>{theme === 'light' ? '?' : '?'}</button></header>
      <main id="main" tabIndex={-1}>
        <div className="page-heading"><div><p className="eyebrow">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase()}</p><h1>{section === 'Dashboard' ? 'Your day, at a glance' : section}</h1><p>A little structure. A lot more possibility.</p></div><button className="primary" onClick={() => setEditor({ task: null })}>+ New task</button></div>
        {(storageError || themeError) && <p role="alert">{storageError || themeError}</p>}
        <TaskStats tasks={tasks} />{section === "Dashboard" && <QuickAdd onAdd={saveTask} />}{section === "Dashboard" && <DailyFocus tasks={tasks} ids={focusIds} onFocus={selectFocus} onToggle={toggle} />}
        {section === "Statistics" ? <Statistics tasks={tasks} /> : <section className="panel task-section"><div className="section-heading"><div><h2>{section === 'Dashboard' ? 'Your tasks' : section}</h2><p>{visibleTasks.length} tasks in this view</p></div><button disabled={!tasks.some(task => task.completed)} onClick={() => setConfirm(true)}>Clear completed</button></div>
          <TaskFilters categories={[...new Set(tasks.map(task => task.category))].sort()} filters={filters} onChange={setFilters} />
          <TaskList tasks={visibleTasks} focusIds={focusIds} onFocus={selectFocus} onToggle={toggle} onDelete={remove} onEdit={task => setEditor({ task })} />
        </section>}{section === "Dashboard" && <DashboardActivity tasks={tasks} today={today} />}
      </main>
    </div>
    {editor && <TaskEditor task={editor.task} onSave={saveTask} onClose={() => setEditor(null)} />}
    {message && <Toast message={message} onDismiss={() => setMessage('')} onUndo={deleted ? () => { updateTasks([...tasks.filter(task => task.id !== deleted.id), deleted]); setDeleted(null); setMessage('Task restored.') } : undefined} />}
    {confirm && <ConfirmDialog title="Clear completed tasks?" message="These records will also be removed from your statistics. Export a backup first if you want to keep them." onCancel={() => setConfirm(false)} onConfirm={() => { updateTasks(tasks.filter(task => !task.completed)); setConfirm(false); setMessage('Completed tasks cleared.') }} />}
  </div>
}






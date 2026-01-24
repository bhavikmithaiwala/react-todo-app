import { useState } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import type { Section } from './components/layout/Sidebar'
import { TaskForm } from './components/tasks/TaskForm'
import { TaskList } from './components/tasks/TaskList'
import type { Task, TaskDraft } from './types/task'
import { loadTasks, TASK_KEY } from './services/storage'
import './App.css'

export default function App() {
  const [section, setSection] = useState<Section>('Dashboard')
  const [loaded] = useState(loadTasks)
  const [tasks, setTasks] = useState<Task[]>(loaded.tasks)
  const [editing, setEditing] = useState<Task | null>(null)
  const [message, setMessage] = useState(loaded.error)
  function updateTasks(next: Task[]) {
    setTasks(next)
    try { localStorage.setItem(TASK_KEY, JSON.stringify(next)); setMessage('') }
    catch { setMessage('Changes could not be saved. Export a backup before closing this page.') }
  }
  function addTask(draft: TaskDraft) {
    const now = new Date().toISOString()
    updateTasks([{ ...draft, id: crypto.randomUUID(), completed: false, createdAt: now, updatedAt: now, completedAt: null }, ...tasks])
  }
  function toggle(id: string) { updateTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed, completedAt: task.completed ? null : new Date().toISOString(), updatedAt: new Date().toISOString() } : task)) }
  function remove(id: string) { updateTasks(tasks.filter(task => task.id !== id)) }
  return <div className="app-shell"><Sidebar section={section} onNavigate={setSection} /><div className="workspace"><header className="header"><span>Personal workspace</span></header><main id="main"><p className="eyebrow">LET’S MAKE TODAY COUNT</p><h1>{section}</h1>{message && <p role="alert">{message}</p>}<p>Your space for a more focused day.</p><section className="panel"><TaskForm key={editing?.id ?? "new"} initial={editing ?? undefined} onCancel={editing ? () => setEditing(null) : undefined} onSave={draft => { if (editing) { updateTasks(tasks.map(task => task.id === editing.id ? { ...task, ...draft, updatedAt: new Date().toISOString() } : task)); setEditing(null) } else addTask(draft) }} /></section><TaskList tasks={tasks} onToggle={toggle} onDelete={remove} onEdit={setEditing} /></main></div></div>
}


import { useState } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import type { Section } from './components/layout/Sidebar'
import { TaskForm } from './components/tasks/TaskForm'
import { TaskList } from './components/tasks/TaskList'
import type { Task, TaskDraft } from './types/task'
import { loadTasks } from './services/storage'
import './App.css'

export default function App() {
  const [section, setSection] = useState<Section>('Dashboard')
  const [loaded] = useState(loadTasks)
  const [tasks, setTasks] = useState<Task[]>(loaded.tasks)
  function addTask(draft: TaskDraft) {
    const now = new Date().toISOString()
    setTasks(previous => [{ ...draft, id: crypto.randomUUID(), completed: false, createdAt: now, updatedAt: now, completedAt: null }, ...previous])
  }
  return <div className="app-shell"><Sidebar section={section} onNavigate={setSection} /><div className="workspace"><header className="header"><span>Personal workspace</span></header><main id="main"><p className="eyebrow">LET’S MAKE TODAY COUNT</p><h1>{section}</h1>{loaded.error && <p role="alert">{loaded.error}</p>}<p>Your space for a more focused day.</p><section className="panel"><TaskForm onSave={addTask} /></section><TaskList tasks={tasks} onToggle={id => setTasks(previous => previous.map(task => task.id === id ? { ...task, completed: !task.completed, completedAt: task.completed ? null : new Date().toISOString(), updatedAt: new Date().toISOString() } : task))} onDelete={id => setTasks(previous => previous.filter(task => task.id !== id))} /></main></div></div>
}




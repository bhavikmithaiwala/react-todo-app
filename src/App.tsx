import { useState } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import type { Section } from './components/layout/Sidebar'
import { TaskForm } from './components/tasks/TaskForm'
import { TaskList } from './components/tasks/TaskList'
import type { Task, TaskDraft } from './types/task'
import './App.css'

export default function App() {
  const [section, setSection] = useState<Section>('Dashboard')
  const [tasks, setTasks] = useState<Task[]>([])
  function addTask(draft: TaskDraft) {
    const now = new Date().toISOString()
    setTasks(previous => [{ ...draft, id: crypto.randomUUID(), completed: false, createdAt: now, updatedAt: now, completedAt: null }, ...previous])
  }
  return <div className="app-shell"><Sidebar section={section} onNavigate={setSection} /><div className="workspace"><header className="header"><span>Personal workspace</span></header><main id="main"><p className="eyebrow">LET’S MAKE TODAY COUNT</p><h1>{section}</h1><p>Your space for a more focused day.</p><section className="panel"><TaskForm onSave={addTask} /></section><TaskList tasks={tasks} onToggle={() => {}} onDelete={() => {}} /></main></div></div>
}

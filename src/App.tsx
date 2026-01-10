import { useState } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import type { Section } from './components/layout/Sidebar'
import './App.css'

export default function App() {
  const [section, setSection] = useState<Section>('Dashboard')
  return <div className="app-shell"><Sidebar section={section} onNavigate={setSection} /><div className="workspace"><header className="header"><span>Personal workspace</span></header><main id="main"><p className="eyebrow">LET’S MAKE TODAY COUNT</p><h1>{section}</h1><p>Your space for a more focused day.</p></main></div></div>
}

import { useEffect, useState } from 'react'
export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => { try { return localStorage.getItem('taskdeck.theme') === 'dark' ? 'dark' : 'light' } catch { return 'light' } })
  const [error, setError] = useState('')
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])
  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    try { localStorage.setItem('taskdeck.theme', next); setError('') } catch { setError('Theme preference could not be saved.') }
  }
  return { theme, toggleTheme, error }
}

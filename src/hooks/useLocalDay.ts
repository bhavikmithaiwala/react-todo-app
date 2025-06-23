import { useEffect, useState } from 'react'
import { localDate } from '../utils/dates'
export function useLocalDay() {
  const [today, setToday] = useState(localDate)
  useEffect(() => {
    const refresh = () => setToday(localDate())
    const timer = window.setInterval(refresh, 30000)
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [])
  return today
}

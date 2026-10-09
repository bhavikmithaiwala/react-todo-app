import { useState } from 'react'
import type { Task, DailyFocus } from '../../types/task'
import { downloadBackup, parseBackup } from '../../services/backup'
import { ConfirmDialog } from './ConfirmDialog'
export function Settings({ tasks, focus, theme, onTheme, onRestore, onMessage }: { tasks: Task[]; focus: DailyFocus; theme: string; onTheme: () => void; onRestore: (tasks: Task[], focus: DailyFocus | null) => void; onMessage: (message: string) => void }) {
  const [pending, setPending] = useState<ReturnType<typeof parseBackup> | null>(null)
  const [loading, setLoading] = useState(false)
  return <><section className="panel"><h2>Make it yours</h2><p>Current appearance: {theme} mode</p><button onClick={onTheme}>Switch theme</button></section><section className="panel"><h2>Your tasks, your data</h2><p>TaskDeck stores everything in this browser. Export regular backups before clearing browser data or switching devices.</p><button onClick={() => { try { downloadBackup(tasks, focus); onMessage('Backup exported.') } catch { onMessage('Backup could not be exported.') } }}>Export JSON backup</button><label htmlFor="backup-file">Restore a JSON backup</label><input id="backup-file" type="file" accept=".json,application/json" disabled={loading} onChange={async event => {
    const input = event.currentTarget
    const file = input.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024 || !file.name.toLowerCase().endsWith('.json')) { onMessage('Choose a JSON file smaller than 5 MB.'); input.value = ''; return }
    setLoading(true)
    try { setPending(parseBackup(await file.text())) } catch (error) { onMessage(error instanceof Error ? error.message : 'Could not read this backup.') } finally { setLoading(false); input.value = '' }
  }} />{loading && <p role="status">Reading backup...</p>}<p className="quick-hint">Import replaces the current task collection after confirmation. Invalid files never change your tasks.</p></section><section className="panel"><h2>About TaskDeck</h2><p>A personal task and productivity manager. No account needed. No data sent to a server.</p></section>{pending && <ConfirmDialog title="Replace tasks with this backup?" message={`This will replace ${tasks.length} current tasks with ${pending.tasks.length} imported tasks. Export your current tasks first if you need them.`} onCancel={() => setPending(null)} onConfirm={() => { onRestore(pending.tasks, pending.focus); setPending(null) }} />}</>
}

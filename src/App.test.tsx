import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from './App'
import { task } from './test/fixtures'
import { TASK_KEY } from './services/storage'
import { FOCUS_KEY } from './services/focusStorage'
import { localDate } from './utils/dates'

async function newTask(title: string) {
  const user = userEvent.setup()
  await user.click(screen.getByRole('button', { name: /New task/ }))
  const dialog = screen.getByRole('dialog')
  await user.type(within(dialog).getByLabelText('Task title'), title)
  await user.click(within(dialog).getByRole('button', { name: 'Add task' }))
  return user
}
describe('TaskDeck workflows', () => {
  it('creates and persists a trimmed task, then reloads it', async () => {
    const app = render(<App />)
    await newTask('  Plan project  ')
    expect(JSON.parse(localStorage.getItem(TASK_KEY)!)[0].title).toBe(
      'Plan project',
    )
    expect(
      screen.getByRole('checkbox', { name: 'Complete Plan project' }),
    ).toBeInTheDocument()
    app.unmount()
    render(<App />)
    expect(
      screen.getByRole('checkbox', { name: 'Complete Plan project' }),
    ).toBeInTheDocument()
  })
  it('validates empty titles and can cancel the editor', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /New task/ }))
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: 'Add task',
      }),
    )
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Please enter a task title',
    )
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
  it('completes and reopens a task with correct timestamps', async () => {
    localStorage.setItem(TASK_KEY, JSON.stringify([task()]))
    render(<App />)
    const user = userEvent.setup()
    await user.click(
      screen.getByRole('checkbox', { name: 'Complete Review React' }),
    )
    expect(
      JSON.parse(localStorage.getItem(TASK_KEY)!)[0].completedAt,
    ).toBeTruthy()
    await user.click(
      screen.getByRole('checkbox', { name: 'Complete Review React' }),
    )
    expect(
      JSON.parse(localStorage.getItem(TASK_KEY)!)[0].completedAt,
    ).toBeNull()
  })
  it('edits titles and descriptions', async () => {
    localStorage.setItem(TASK_KEY, JSON.stringify([task()]))
    render(<App />)
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Edit Review React' }))
    await user.clear(screen.getByLabelText('Task title'))
    await user.type(screen.getByLabelText('Task title'), 'Study TypeScript')
    await user.clear(screen.getByLabelText('Description'))
    await user.type(screen.getByLabelText('Description'), 'Review generics')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))
    expect(JSON.parse(localStorage.getItem(TASK_KEY)!)[0]).toMatchObject({
      title: 'Study TypeScript',
      description: 'Review generics',
    })
  })
  it('deletes and restores a task', async () => {
    localStorage.setItem(TASK_KEY, JSON.stringify([task()]))
    render(<App />)
    const user = userEvent.setup()
    await user.click(
      screen.getByRole('button', { name: 'Delete Review React' }),
    )
    expect(
      screen.queryByRole('checkbox', { name: 'Complete Review React' }),
    ).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Undo' }))
    expect(
      screen.getByRole('checkbox', { name: 'Complete Review React' }),
    ).toBeInTheDocument()
  })
  it('filters and searches tasks together', async () => {
    localStorage.setItem(
      TASK_KEY,
      JSON.stringify([
        task(),
        task({
          id: 'b',
          title: 'Buy groceries',
          description: '',
          category: 'Personal',
          completed: true,
          completedAt: '2026-10-09T12:00:00.000Z',
        }),
      ]),
    )
    render(<App />)
    const user = userEvent.setup()
    await user.click(
      within(screen.getByRole('group', { name: 'Task filters' })).getByRole(
        'button',
        { name: 'Active' },
      ),
    )
    await user.type(
      screen.getByRole('textbox', { name: 'Search tasks' }),
      'hooks',
    )
    expect(
      screen.getByRole('checkbox', { name: 'Complete Review React' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('checkbox', { name: 'Complete Buy groceries' }),
    ).not.toBeInTheDocument()
  })
  it('enforces Top 3 and removing focus keeps the task', async () => {
    localStorage.setItem(
      TASK_KEY,
      JSON.stringify(
        ['a', 'b', 'c', 'd'].map((id) => task({ id, title: `Task ${id}` })),
      ),
    )
    render(<App />)
    const user = userEvent.setup()
    for (const id of ['a', 'b', 'c', 'd'])
      await user.click(screen.getByRole('button', { name: `Focus Task ${id}` }))
    expect(screen.getByRole('status')).toHaveTextContent('full')
    expect(JSON.parse(localStorage.getItem(FOCUS_KEY)!).ids).toHaveLength(3)
    await user.click(
      screen.getByRole('button', { name: 'Remove Task a from focus' }),
    )
    expect(
      screen.getByRole('checkbox', { name: 'Complete Task a' }),
    ).toBeInTheDocument()
  })
  it('quick-adds parsed metadata', async () => {
    render(<App />)
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/next/), 'Read today #study !high')
    await user.click(screen.getByRole('button', { name: 'Add task' }))
    expect(JSON.parse(localStorage.getItem(TASK_KEY)!)[0]).toMatchObject({
      title: 'Read',
      category: 'study',
      priority: 'high',
      dueDate: localDate(),
    })
  })
  it('shows date views and real analytics', async () => {
    localStorage.setItem(
      TASK_KEY,
      JSON.stringify([task({ dueDate: localDate() })]),
    )
    render(<App />)
    const user = userEvent.setup()
    const nav = screen.getByRole('navigation')
    await user.click(within(nav).getByRole('button', { name: 'Today' }))
    expect(
      screen.getByRole('checkbox', { name: 'Complete Review React' }),
    ).toBeInTheDocument()
    await user.click(within(nav).getByRole('button', { name: 'Statistics' }))
    expect(
      screen.getByRole('img', { name: /Daily completions/ }),
    ).toBeInTheDocument()
  })
  it('confirms clearing completed and supports cancelling', async () => {
    localStorage.setItem(
      TASK_KEY,
      JSON.stringify([
        task({ completed: true, completedAt: '2026-10-09T12:00:00.000Z' }),
      ]),
    )
    render(<App />)
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Clear completed' }))
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(JSON.parse(localStorage.getItem(TASK_KEY)!)).toHaveLength(1)
    await user.click(screen.getByRole('button', { name: 'Clear completed' }))
    await user.click(screen.getByRole('button', { name: 'Confirm' }))
    expect(JSON.parse(localStorage.getItem(TASK_KEY)!)).toHaveLength(0)
  })
  it('switches and persists the theme', async () => {
    render(<App />)
    const user = userEvent.setup()
    await user.click(
      screen.getByRole('button', { name: 'Switch to dark mode' }),
    )
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem('taskdeck.theme')).toBe('dark')
  })
  it('warns when saving fails without losing the task in memory', async () => {
    render(<App />)
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Quota')
    })
    await newTask('Keep this task')
    expect(screen.getByRole('alert')).toHaveTextContent('could not be saved')
    expect(
      screen.getByRole('checkbox', { name: 'Complete Keep this task' }),
    ).toBeInTheDocument()
  })
  it('validates imports and waits for replacement confirmation', async () => {
    render(<App />)
    const user = userEvent.setup()
    await user.click(
      within(screen.getByRole('navigation')).getByRole('button', {
        name: 'Settings',
      }),
    )
    const file = new File([''], 'backup.json', { type: 'application/json' })
    Object.defineProperty(file, 'text', {
      value: async () => JSON.stringify([task({ title: 'Imported task' })]),
    })
    fireEvent.change(screen.getByLabelText('Restore a JSON backup'), {
      target: { files: [file] },
    })
    await screen.findByRole('dialog')
    expect(localStorage.getItem(TASK_KEY)).toBeNull()
    await user.click(screen.getByRole('button', { name: 'Confirm' }))
    expect(JSON.parse(localStorage.getItem(TASK_KEY)!)[0].title).toBe(
      'Imported task',
    )
  })
})

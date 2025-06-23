import { describe, expect, it, vi } from 'vitest'
import { task } from '../test/fixtures'
import { localDate, isDate, isOverdue } from './dates'
import { filterTasks, defaultFilters } from './tasks'
import { parseQuickAdd } from './quickAdd'
import { taskStats, weekHistory, dailyHistory } from './statistics'
import { toggleFocus } from './focus'
import { loadTasks, TASK_KEY, validateTasks } from '../services/storage'
import { loadFocus, FOCUS_KEY } from '../services/focusStorage'
import { parseBackup } from '../services/backup'

describe('local calendar dates', () => {
  it('uses local components rather than UTC', () =>
    expect(localDate(new Date(2026, 9, 9, 23, 59))).toBe('2026-10-09'))
  it('rejects rolled-over and malformed dates', () => {
    expect(isDate('2026-02-30')).toBe(false)
    expect(isDate('2024-02-29')).toBe(true)
    expect(isDate('9/10/2026')).toBe(false)
  })
  it('only active past-due tasks are overdue', () => {
    expect(isOverdue('2026-10-08', false, '2026-10-09')).toBe(true)
    expect(isOverdue('2026-10-09', false, '2026-10-09')).toBe(false)
    expect(isOverdue('2026-10-08', true, '2026-10-09')).toBe(false)
  })
})
describe('composable filters', () => {
  const tasks = [
    task(),
    task({
      id: 'b',
      title: 'Buy food',
      description: '',
      category: 'Personal',
      priority: 'high',
      dueDate: '2026-10-09',
      createdAt: '2026-10-06T12:00:00.000Z',
    }),
    task({
      id: 'c',
      completed: true,
      completedAt: '2026-10-09T12:00:00.000Z',
      priority: 'low',
    }),
  ]
  it('combines description search, category, priority and status', () =>
    expect(
      filterTasks(tasks, {
        ...defaultFilters,
        search: 'HOOKS',
        category: 'Study',
        priority: 'medium',
        status: 'active',
      }).map((task) => task.id),
    ).toEqual(['a']))
  it('finds completed records', () =>
    expect(
      filterTasks(tasks, { ...defaultFilters, status: 'completed' }).map(
        (task) => task.id,
      ),
    ).toEqual(['c']))
  it('sorts high priority first without mutating input', () => {
    expect(
      filterTasks(tasks, { ...defaultFilters, sort: 'priority' }).map(
        (task) => task.id,
      ),
    ).toEqual(['b', 'a', 'c'])
    expect(tasks[0].id).toBe('a')
  })
  it('places undated tasks after deadlines', () =>
    expect(filterTasks(tasks, { ...defaultFilters, sort: 'due' })[0].id).toBe(
      'b',
    ))
  it('supports both creation orders', () => {
    expect(filterTasks(tasks, defaultFilters)[0].id).toBe('b')
    expect(
      filterTasks(tasks, { ...defaultFilters, sort: 'oldest' })[0].id,
    ).toBe('a')
  })
})
describe('quick add', () => {
  it('extracts metadata and advances year locally', () =>
    expect(
      parseQuickAdd(
        'Finish portfolio tomorrow #career !high',
        new Date(2026, 11, 31, 23),
      ),
    ).toMatchObject({
      title: 'Finish portfolio',
      dueDate: '2027-01-01',
      category: 'career',
      priority: 'high',
    }))
  it('parses today and case insensitive priorities', () =>
    expect(
      parseQuickAdd('Review TODAY !LOW', new Date(2026, 9, 9)),
    ).toMatchObject({
      title: 'Review',
      dueDate: '2026-10-09',
      priority: 'low',
    }))
  it('preserves conflicting and unknown metadata', () => {
    expect(
      parseQuickAdd('Plan today tomorrow #work #study !high !low').title,
    ).toBe('Plan today tomorrow #work #study !high !low')
    expect(parseQuickAdd('Read !urgent').title).toBe('Read !urgent')
  })
  it('does not consume date substrings', () =>
    expect(parseQuickAdd('Discuss todayish').title).toBe('Discuss todayish'))
})
describe('daily focus', () => {
  it('rejects a fourth selection', () =>
    expect(() =>
      toggleFocus(
        { date: '2026-10-09', ids: ['a', 'b', 'c'] },
        'd',
        '2026-10-09',
      ),
    ).toThrow('full'))
  it('removes a selected task', () =>
    expect(
      toggleFocus({ date: '2026-10-09', ids: ['a'] }, 'a', '2026-10-09').ids,
    ).toEqual([]))
  it('starts fresh on a new day', () =>
    expect(
      toggleFocus(
        { date: '2026-10-08', ids: ['a', 'b', 'c'] },
        'd',
        '2026-10-09',
      ).ids,
    ).toEqual(['d']))
  it('does not reuse yesterday from storage', () => {
    localStorage.setItem(
      FOCUS_KEY,
      JSON.stringify({ date: '2025-01-01', ids: ['a'] }),
    )
    expect(loadFocus().ids).toEqual([])
  })
})
describe('real statistics', () => {
  const tasks = [
    task({
      completed: true,
      completedAt: new Date(2026, 9, 5, 12).toISOString(),
    }),
    task({ id: 'b', dueDate: '2026-10-08' }),
  ]
  it('calculates counts and percent', () =>
    expect(taskStats(tasks, '2026-10-09')).toEqual({
      total: 2,
      completed: 1,
      pending: 1,
      overdue: 1,
      percent: 50,
    }))
  it('handles an empty collection', () => expect(taskStats([]).percent).toBe(0))
  it('counts completion timestamps for a Monday-start week', () => {
    const week = weekHistory(tasks, new Date(2026, 9, 9))
    expect(week[0]).toMatchObject({ date: '2026-10-05', count: 1 })
    expect(week).toHaveLength(7)
    expect(dailyHistory(tasks)).toEqual([['2026-10-05', 1]])
  })
})
describe('storage and backups', () => {
  it('loads validated persisted tasks', () => {
    localStorage.setItem(TASK_KEY, JSON.stringify([task()]))
    expect(loadTasks().tasks).toHaveLength(1)
  })
  it('preserves malformed storage and reports an error', () => {
    localStorage.setItem(TASK_KEY, '{bad')
    expect(loadTasks().error).toBeTruthy()
    expect(localStorage.getItem(TASK_KEY)).toBe('{bad')
  })
  it('reports unavailable storage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Denied')
    })
    expect(loadTasks().error).toBeTruthy()
  })
  it.each([
    { title: '  ' },
    { priority: 'urgent' },
    { dueDate: '2026-02-30' },
    { completed: true, completedAt: null },
    { completed: false, completedAt: '2026-10-09T12:00:00.000Z' },
  ])('rejects malformed task %j', (fields) =>
    expect(() => validateTasks([{ ...task(), ...fields }])).toThrow(),
  )
  it('rejects duplicate IDs', () =>
    expect(() => validateTasks([task(), task()])).toThrow())
  it('reads versioned backups and plain task arrays', () => {
    expect(parseBackup(JSON.stringify([task()])).tasks).toHaveLength(1)
    expect(
      parseBackup(
        JSON.stringify({
          version: 1,
          tasks: [task()],
          focus: { date: '2026-10-09', ids: ['a'] },
        }),
      ).focus?.ids,
    ).toEqual(['a'])
  })
  it('rejects unknown versions and orphan focus IDs', () => {
    expect(() => parseBackup('{"version":2}')).toThrow()
    expect(() =>
      parseBackup(
        JSON.stringify({
          version: 1,
          tasks: [task()],
          focus: { date: '2026-10-09', ids: ['missing'] },
        }),
      ),
    ).toThrow()
  })
})

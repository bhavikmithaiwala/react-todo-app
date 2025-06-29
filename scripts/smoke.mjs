import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import { setTimeout as delay } from 'node:timers/promises'

const server = spawn(
  process.execPath,
  [
    'node_modules/vite/bin/vite.js',
    'preview',
    '--host',
    '127.0.0.1',
    '--port',
    '4173',
    '--strictPort',
  ],
  { windowsHide: true, stdio: 'pipe' },
)
let serverOutput = ''
server.stdout.on('data', (chunk) => {
  serverOutput += chunk
})
server.stderr.on('data', (chunk) => {
  serverOutput += chunk
})
let browser
try {
  let ready = false
  for (let index = 0; index < 100; index++) {
    if (server.exitCode !== null)
      throw new Error(`Preview exited: ${serverOutput}`)
    try {
      const response = await fetch('http://127.0.0.1:4173')
      if (response.ok) {
        ready = true
        break
      }
    } catch {
      /* Wait for preview to start. */
    }
    await delay(100)
  }
  assert.ok(ready, 'Preview must start')
  browser = await chromium.launch({ channel: 'chrome', headless: true })
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1100 },
    timezoneId: 'America/Toronto',
  })
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('http://127.0.0.1:4173')
  await page.getByRole('heading', { name: 'Your day, at a glance' }).waitFor()
  assert.equal(
    await page.locator('.stat-card strong').first().textContent(),
    '0',
  )
  for (const command of [
    'Finish portfolio tomorrow #Career !high',
    'Review React today #Study !medium',
    'Plan the week #Personal !low',
    'Organize project notes today #Work !high',
  ]) {
    await page.getByLabel(/next/).fill(command)
    await page.getByRole('button', { name: 'Add task', exact: true }).click()
  }
  assert.equal(await page.locator('.task').count(), 4)
  await page
    .getByRole('button', { name: 'Focus Finish portfolio', exact: true })
    .click()
  await page
    .getByRole('button', { name: 'Focus Review React', exact: true })
    .click()
  await page
    .getByRole('button', { name: 'Focus Plan the week', exact: true })
    .click()
  await page
    .getByRole('button', { name: 'Focus Organize project notes', exact: true })
    .click()
  assert.match(await page.getByRole('status').textContent(), /full/)
  await page
    .getByRole('checkbox', { name: 'Complete Plan the week', exact: true })
    .check()
  await page.getByRole('button', { name: 'Dismiss notification' }).click()
  await page.reload()
  await page.getByRole('heading', { name: 'My Top 3' }).waitFor()
  assert.equal(await page.locator('.task').count(), 4)
  assert.equal(
    await page
      .locator('.focus-progress')
      .first()
      .textContent()
      .then((text) => text.replace(/\s+/g, ' ').trim()),
    '1/3 complete',
  )
  await mkdir('docs', { recursive: true })
  await page.screenshot({ path: 'docs/taskdeck-desktop.png', fullPage: true })
  await page.getByRole('button', { name: 'Switch to dark mode' }).click()
  await page.screenshot({ path: 'docs/taskdeck-dark.png', fullPage: true })
  await page.getByRole('button', { name: 'Switch to light mode' }).click()
  const nav = page.getByRole('navigation')
  for (const section of [
    'All Tasks',
    'Today',
    'Upcoming',
    'Completed',
    'Statistics',
    'Settings',
    'Dashboard',
  ]) {
    await nav.getByRole('button', { name: section, exact: true }).click()
    await page
      .getByRole('heading', {
        level: 1,
        name: section === 'Dashboard' ? 'Your day, at a glance' : section,
      })
      .waitFor()
  }
  await page.getByRole('button', { name: 'New task' }).click()
  const editor = page.getByRole('dialog')
  await editor.getByLabel('Task title').fill('Browser smoke task')
  await editor.getByRole('button', { name: 'Add task', exact: true }).click()
  await page
    .getByRole('button', { name: 'Edit Browser smoke task', exact: true })
    .click()
  await page
    .getByRole('dialog')
    .getByLabel('Task title')
    .fill('Updated smoke task')
  await page.getByRole('button', { name: 'Save changes', exact: true }).click()
  await page
    .getByRole('button', { name: 'Delete Updated smoke task', exact: true })
    .click()
  await page.getByRole('button', { name: 'Undo', exact: true }).click()
  assert.equal(
    await page
      .getByRole('checkbox', {
        name: 'Complete Updated smoke task',
        exact: true,
      })
      .count(),
    1,
  )
  await page
    .getByRole('button', { name: 'Delete Updated smoke task', exact: true })
    .click()
  await page.getByRole('button', { name: 'Dismiss notification' }).click()
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    const noOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    )
    assert.ok(noOverflow, `Layout overflows at ${width}px`)
    if (width === 390) {
      await page.screenshot({
        path: 'docs/taskdeck-mobile.png',
        fullPage: true,
      })
      await page.getByText('Workspace navigation', { exact: true }).click()
      assert.equal(await nav.isVisible(), false)
      await page.getByText('Workspace navigation', { exact: true }).click()
      await page.getByRole('button', { name: 'New task' }).click()
      assert.equal(await page.getByRole('dialog').isVisible(), true)
      await page.keyboard.press('Escape')
      assert.equal(await page.getByRole('dialog').count(), 0)
    }
  }
  await nav.getByRole('button', { name: 'Settings', exact: true }).click()
  const downloadReady = page.waitForEvent('download')
  await page
    .getByRole('button', { name: 'Export JSON backup', exact: true })
    .click()
  const download = await downloadReady
  assert.match(download.suggestedFilename(), /^taskdeck-.*\.json$/)
  await page.getByLabel('Restore a JSON backup').setInputFiles({
    name: 'backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from('[]'),
  })
  await page.getByRole('dialog').waitFor()
  await page.getByRole('button', { name: 'Cancel', exact: true }).click()
  assert.equal(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem('taskdeck.tasks.v1')).length,
    ),
    4,
  )
  assert.deepEqual(errors, [], 'Production page must have no runtime errors')
  console.log(
    'Production Chrome smoke test passed: CRUD, refresh, Top 3, all navigation, themes, backup, modal keyboard behavior, and 390/768/1440px layouts.',
  )
  console.log(
    'Screenshots saved in docs/. Sample tasks exist only in the isolated browser test.',
  )
} finally {
  await browser?.close()
  server.kill()
}

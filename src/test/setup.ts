import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach } from 'vitest'
beforeEach(() => localStorage.clear())
afterEach(cleanup)
Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { value: function () { this.setAttribute('open', '') } })
Object.defineProperty(HTMLDialogElement.prototype, 'close', { value: function () { this.removeAttribute('open') } })

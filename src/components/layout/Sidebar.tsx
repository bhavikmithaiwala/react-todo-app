import { sections } from '../../types/navigation'
import type { Section } from '../../types/navigation'
const icons = [
  '\u25eb',
  '\u2261',
  '\u2600',
  '\u25f7',
  '\u2713',
  '\u25a5',
  '\u2699',
]
export function Sidebar({
  section,
  onNavigate,
}: {
  section: Section
  onNavigate: (section: Section) => void
}) {
  return (
    <aside className="sidebar">
      <a className="brand" href="#main">
        <span className="brand-mark">{'\u2713'}</span> TaskDeck
      </a>
      <details className="mobile-nav" open>
        <summary>Workspace navigation</summary>
        <p className="eyebrow">YOUR WORKSPACE</p>
        <nav aria-label="Main navigation">
          {sections.map((item, i) => (
            <button
              key={item}
              className={section === item ? 'nav-item selected' : 'nav-item'}
              aria-current={section === item ? 'page' : undefined}
              onClick={() => onNavigate(item)}
            >
              <span aria-hidden="true">{icons[i]}</span>
              {item}
            </button>
          ))}
        </nav>
      </details>
      <div className="sidebar-note">
        <strong>A little progress, every day.</strong>
        <p>Make room for what matters.</p>
      </div>
    </aside>
  )
}

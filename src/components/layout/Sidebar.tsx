export const sections = ['Dashboard', 'All Tasks', 'Today', 'Upcoming', 'Completed', 'Statistics', 'Settings'] as const
export type Section = typeof sections[number]

export function Sidebar({ section, onNavigate }: { section: Section; onNavigate: (section: Section) => void }) {
  return <aside className="sidebar"><a className="brand" href="#main"><span className="brand-mark">?</span> TaskDeck</a><p className="eyebrow">YOUR WORKSPACE</p><nav aria-label="Main navigation">{sections.map((item, i) => <button key={item} className={section === item ? 'nav-item selected' : 'nav-item'} aria-current={section === item ? 'page' : undefined} onClick={() => onNavigate(item)}><span aria-hidden="true">{['?', '=', '?', '?', '?', '?', '?'][i]}</span>{item}</button>)}</nav><div className="sidebar-note"><strong>A little progress, every day.</strong><p>Make room for what matters.</p></div></aside>
}

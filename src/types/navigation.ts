export const sections = [
  'Dashboard',
  'All Tasks',
  'Today',
  'Upcoming',
  'Completed',
  'Statistics',
  'Settings',
] as const
export type Section = (typeof sections)[number]

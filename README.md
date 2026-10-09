# TaskDeck — Personal Task & Productivity Manager

A React and TypeScript productivity application for organizing tasks, managing deadlines, tracking progress, and staying focused on daily priorities.

TaskDeck combines a simple task management interface with filtering, progress statistics, and a daily focus system.

**Status:** In active development.

## Features

**Task Management**

- Create, edit, complete, reopen, and delete tasks.
- Add descriptions, priorities, categories, and due dates.
- Undo task deletion and confirm before clearing completed tasks.
- Validate task inputs and display helpful messages.

**Search & Organization**

- Search tasks and filter by status, priority, or category.
- Sort tasks by creation date, priority, or deadline.
- View all tasks, today's tasks, upcoming deadlines, and completed tasks.

**Productivity Dashboard**

- Track total, pending, completed, and overdue tasks.
- View overall completion progress.
- Choose up to three daily priorities using the Daily Focus feature.

**User Experience**

- Light and dark themes.
- Browser-based task persistence with localStorage.
- Responsive dashboard layout.
- Reusable React components and TypeScript models.

## Tech Stack

| Area             | Technology           |
| ---------------- | -------------------- |
| Frontend         | React, TypeScript    |
| Build Tool       | Vite                 |
| Styling          | CSS                  |
| State Management | React Hooks          |
| Data Storage     | Browser localStorage |
| Code Quality     | ESLint, TypeScript   |

## Getting Started

**1. Clone the repository**

```bash
git clone https://github.com/bhavikmithaiwala/react-todo-app.git
cd react-todo-app
```

**2. Install dependencies**

```bash
npm install
```

**3. Start the application**

```bash
npm run dev
```

Open the local address shown in your terminal, usually `http://localhost:5173`.

## Development Commands

```bash
npm run dev       # Start development server
npm run lint      # Run ESLint
npm run build     # Generate production build
npm run preview   # Preview production build
```

## Project Structure

```text
src/
├── components/
│   ├── common/
│   ├── dashboard/
│   ├── layout/
│   └── tasks/
├── hooks/
├── services/
├── types/
├── utils/
├── App.tsx
└── main.tsx
```

## Roadmap

Future improvements include:

- Smart Quick Add with natural-language task commands.
- Weekly productivity analytics and completion charts.
- JSON task backup and restore.
- Automated unit and component testing.
- Additional mobile and accessibility improvements.
- Optional Node.js backend and database integration.

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

## Data Storage

Task data is stored locally in the browser using localStorage. No account or external server is required. Clearing browser storage may remove saved tasks.

## Contributing

Suggestions and bug reports are welcome through [GitHub Issues](https://github.com/bhavikmithaiwala/react-todo-app/issues).

## License

No license has been selected for this repositor

<<<<<<< HEAD

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.
You can also try [the experimental native React Compiler support in plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#rust-react-compiler) by using `compiler: true` in the plugin options instead of using the Babel plugin.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

=======

# react-todo-app

A React-based task management application with plans for productivity features.

>>>>>>> cefb175fa729440741d713204899fb1623fde904
>>>>>>>
>>>>>>
>>>>>
>>>>
>>>
>>

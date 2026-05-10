# Cabin Organiser Coding Instructions

These instructions apply to all generated or edited code in this repository.

## Required structure and limits

- Place route components under src/routes and structure them recursively to mirror the component tree.
- Place reusable UI components under src/ui.
- Use a nested pattern such as src/routes/route-level-component/sub-component/components/sub-component/sub-sub-component.tsx.
- Use kebab-case for all file names and folder names.
- Define only one React component per file.
- Export only one function per file.
- Keep files under 100 lines where possible.
- Do not add comments in source code.
- Import reusable UI via aliases like @/ui/....
- Put API provider files under src/api/provider.
- Put API hooks under src/api/hooks with domain subfolders.
- Follow API hook naming such as src/api/hooks/phases/use-phases-update.ts.
- Use TanStack Query for all API calls.

## React best practices

- Keep components small and focused on one responsibility.
- Prefer composition over prop drilling and deeply nested logic.
- Keep side effects isolated in useEffect with accurate dependency arrays.
- Keep rendering logic predictable and avoid inline complex expressions in JSX.
- Extract repeated UI or logic into separate single-purpose components or hooks.
- Keep state as local as possible and derive values instead of duplicating state.
- Prefer explicit prop types and avoid any.
- Use stable keys for lists and never use array indexes as keys when data has ids.
- Avoid unnecessary re-renders by memoizing expensive computed values when needed.
- Maintain consistent naming and import ordering across files.

## Preferred file pattern

- src/routes/tasks/tasks.tsx
- src/routes/tasks/components/new-phase-modal/new-phase-modal.tsx
- src/routes/tasks/components/phase-view/components/phase-tasks-table/phase-tasks-table.tsx
- src/ui/status-badge/status-badge.tsx

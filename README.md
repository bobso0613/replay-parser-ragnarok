# 🎮 Replay Parser Ragnarok

Replay Parser Ragnarok is a React + Vite frontend application for exploring Ragnarok Online replay data in the browser. The project has been organized into feature-oriented folders so the UI, routing, services, hooks, and shared types are easier to maintain.

## ✨ Features

- 🔍 Browse and parse Ragnarok Online replay data through a modern, interactive web interface
- 📤 Upload replay files and process them through a configurable parser API endpoint
- 📊 View detailed replay breakdowns with formatted data tables and sections
- 🧩 Reusable components for data display: tables, dropdowns, loading states, and skeleton loaders
- 📁 File upload with parsing and validation for replay data
- 🧭 Route-based navigation through the app shell
- 🧭 Base-path aware routing for subpath deployments via `VITE_BASE_PATH`
- 🏷️ Route-aware browser titles and header branding (`Replay Parser` and `Bastion Guide`)
- ⚡ Lazy-loaded background images for optimized performance
- 🔧 Keep shared logic in hooks, services, utilities, and constants
- 🔗 Dynamic API response field mapping for flexible data handling
- 🏷️ Display names for jobs, skills, items, and monsters are provided by the parser service

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file and set any required environment variables for your local setup.

```dotenv
VITE_APPLICATION_NAME="Ragnarok Replay Parser"
VITE_BASE_PATH=/
VITE_PARSER_URL=https://your-api-host/parse
VITE_SKILL_IMAGE_URL=https://static.divine-pride.net/images/skill/PLACEHOLDER_TEXT.png
VITE_JOB_IMAGE_URL=https://static.divine-pride.net/images/jobs/icon_jobs_PLACEHOLDER_TEXT.png
VITE_MONSTER_IMAGE_URL=https://talontales.com/panel/data/monsters/PLACEHOLDER_TEXT.gif
VITE_REPLAY_URL_SHARE=/replay-parser/ID_HERE
```

3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the local Vite URL in your browser to use the app.

> Note: Replay parsing is handled by your API configured in `VITE_PARSER_URL`. When deploying under a subpath, set `VITE_BASE_PATH` to that path so the router and Vite asset paths stay aligned. If your host does not support SPA rewrites on refresh, the bundled `404.html` fallback will route missing deep links back into the app.

## 🛠️ Development

Useful commands:

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Git Hooks

[Husky](https://typicode.github.io/husky/) is installed automatically by `npm install` through the `prepare` script. Before Git completes a commit, `.husky/pre-commit` runs:

```bash
npm run test:coverage && npm run build && npm run docs
```

The coverage command enforces a minimum of 80% for global statements, branches, functions, and lines. A failed check stops the commit.

## Player Details Modal

`Home` mounts a shared `ModalProvider` that makes modal controls available to replay breakdown content through `useModal`. Player names and their job-icon tooltip triggers in `ReplayBreakdown` are keyboard-accessible and open the shared modal. The current integration displays placeholder title and body content until player-detail content is added.

```tsx
const { openModal } = useModal();

openModal({
  title: 'Player details',
  content: <PlayerDetails player={player} />,
});
```

## Bastion Guide

`BastionGuide` (route: `/bastion-guide`) shows the Bastion instance's monster waves next to a meteor timer iframe. Wave/monster data is fetched once from `public/bastion_mobs.json` by a shared `BastionMobsProvider`, which exposes `waves`, `isLoading`, `hasError`, and a `reload` retry callback through `useBastionMobs`. Each wave carries `isSkippable` and a `remindersSetup` array of reminder flags (`isDangerousFloor`, `isMvpFloor`, `restockFlag`, `isStartOfStatus`, `isStartOfMeteor`, `isStashDisappear`).

The page renders a **Filters** column of checkboxes next to a **Legend** column (one row per `REMINDER_NOTES` entry, showing its emoji and label), above a compact, virtualised `Table` with `Wave`, `Mobs`, `MVPs`, and `Notes` columns.

- **Show only dangerous floor waves** (`showOnlyDangerousFloorWaves`) — keeps only waves flagged `isDangerousFloor`.
- **Only show MVPs (except dangerous floors)** (`getMvpOnlyMonsters`) — shows only MVP monsters per wave, falling back to a generic "Mobs" label when a wave has monsters but no MVP; dangerous floor waves always show their full monster list.
- **Merge skippable waves into next wave** (`mergeSkippableWaves`) — folds monsters from consecutive `isSkippable` waves into the next kept wave.
- **Hide waves 1-55 (except dangerous floors)** (`hideNonDangerousEarlyWaves`) — hides early non-dangerous waves.

Rows flagged `isMvpFloor` get a soft yellow background applied to the whole row via `Table`'s `rowBackgroundClassNames` prop, and the Notes column shows each wave's reminder emoji (from `getWaveNotes`) with a tooltip revealing its label.

```tsx
const { waves, isLoading, hasError, reload } = useBastionMobs();
```

## 📚 API Documentation

JSDoc-style HTML documentation is generated from TypeScript source files using [TypeDoc](https://typedoc.org/).

All exported functions, components, interfaces, and types carry multi-line JSDoc comments with `@param`, `@returns`, `@throws`, and `@property` tags where applicable.

### Generating the docs

```bash
npm run docs
```

The output is written to the `docs/` folder. Open `docs/index.html` in any browser to browse the generated site.

Configuration lives in [`jsdoc.config.json`](./jsdoc.config.json). Test files are excluded automatically.

## 🧪 Testing

This project uses **Vitest** for unit testing and **@testing-library/react** for component testing.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests once (CI mode)
npm test -- --run

# Run tests with coverage report
npm run test:coverage
```

### Test Structure

- **Component Tests**: Located alongside components with `.test.tsx` suffix
  - Tests for rendering, props, user interactions, and state changes
  - Uses `@testing-library/react` with jsdom environment
  - Covers all major components, including replay breakdown and upload flows

- **Utility Tests**: Located alongside utilities with `.test.ts` suffix
  - Pure function tests extracted from components
  - Higher coverage due to testable logic (sorting, layout calculations, etc.)

### Coverage

The coverage command enforces an 80% global minimum for statements, branches, functions, and lines. Current test coverage (from `npm run test:coverage`):

- **Lines**: 90.3% (661/732)
- **Statements**: 89.29% (684/766)
- **Branches**: 81.21% (506/623)
- **Functions**: 84.72% (183/216)

The test suite includes 734 passing tests across 35 test files, focusing on:

- Component rendering and lifecycle
- User interactions (clicks, form submissions, drag-drop detection)
- Props validation and edge cases
- Pure utility functions (text extraction, sorting, column width calculations)
- Event listener attachment and cleanup
- Conditional rendering logic

### Testing Approach

This project uses **Approach 2: Component Restructuring**, where complex logic is extracted into pure, testable utility functions:

1. **Scroll Utilities** (`src/utils/scroll-utils.ts`): Pure functions for scroll detection and target resolution
2. **Table Utilities** (`src/utils/table-utils.ts`): Pure functions for sorting, text extraction, and layout calculations
3. **Component Logic**: Components focus on rendering and side effects (DOM updates, event listeners)

This separation enables high-coverage testing while respecting jsdom limitations for complex DOM operations.

## 📁 Project Structure

- 📦 `src/` - main application source code
- 🧩 `src/components/` - reusable UI components:
  - 🎯 `Header.tsx` - top navigation header
  - 📈 `ReplayBreakdown.tsx` - main replay data display component
  - 📊 `Table.tsx` - data table component for structured data display
  - 📝 `DropdownSelect.tsx` - dropdown selection component
  - 🪟 `Modal.tsx` - responsive dialog with a scrollable body and optional footer
  - 📤 `InputUpload.tsx` - file upload component for replay JSON files
  - ⏳ `Spinner.tsx`, `Spinner.tsx`, `SectionLoading.tsx`, `PageLoading.tsx` - loading state components
  - 🦴 `SkeletonLoader.tsx` - skeleton loader for content placeholders
  - 🚫 `PlaceholderDetails.tsx` - placeholder component for empty states
- 🎨 `src/layouts/` - shared page/layout structures (`BaseLayout.tsx`)
- 📄 `src/pages/` - route-level pages (`Home.tsx`, `BastionGuide.tsx`)
- 🧵 `src/contexts/` - shared React context providers:
  - 🪟 `ModalContext.tsx` - application-level modal controls (`ModalProvider`, `useModal`)
  - 👹 `BastionMobsContext.tsx` - fetches and shares Bastion wave/monster data (`BastionMobsProvider`, `useBastionMobs`)
- 🗺️ `src/routes/` - router configuration and route entry points
- 🎣 `src/hooks/` - custom React hooks:
  - 🏷️ `usePageTitle.ts` - synchronizes the browser title and header logo text with the active route
- 🔌 `src/services/` - API or data service logic
- 📚 `src/types/` - shared TypeScript type definitions:
  - 🎮 `parsed-replay.ts` - replay data types
  - 🌐 `replay-api.ts` - API response types
- 🛠️ `src/utils/` - helper functions and utilities:
  - 🔄 `parse-replay-json.ts` - replay file parsing logic
- ⚙️ `src/constants/` - shared constants and config values
- 🎨 `src/assets/` - local static assets (SVG icons, etc.)
- 📂 `public/` - public static files:
- 📖 `README.md` - project documentation

## 📖 Usage

1. 🚀 Start the development server with `npm run dev`
2. 🌐 Open the application in your browser
3. 📤 Use the file upload component to select a replay file
4. 📊 The application will parse the replay data and display:
   - 📋 Structured replay breakdown with key information
   - 📈 Formatted data tables for detailed statistics

- 👹⚔️ Job, skill, item, and monster names returned with the replay data

5. 🎯 Use dropdown selectors to filter or navigate through replay sections
6. ⏳ The interface provides loading states and placeholders during data processing

For development, extend the app by adding new pages, components, hooks, or services as the project grows.

## 📜 License

This project is open source. Modify and use it according to your needs.

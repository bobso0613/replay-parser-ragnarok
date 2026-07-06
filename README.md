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
- ⚡ Lazy-loaded background images for optimized performance
- 🔧 Keep shared logic in hooks, services, utilities, and constants
- 🔗 Dynamic API response field mapping for flexible data handling

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

> Note: This project reads YAML lookup data from `public/yaml/`. Replay parsing is handled by your API configured in `VITE_PARSER_URL`. When deploying under a subpath, set `VITE_BASE_PATH` to that path so the router and Vite asset paths stay aligned. If your host does not support SPA rewrites on refresh, the bundled `404.html` fallback will route missing deep links back into the app.

## 🛠️ Development

Useful commands:

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## 📁 Project Structure

- 📦 `src/` - main application source code
- 🧩 `src/components/` - reusable UI components:
  - 🎯 `Header.tsx` - top navigation header
  - 📈 `ReplayBreakdown.tsx` - main replay data display component
  - 📊 `Table.tsx` - data table component for structured data display
  - 📝 `DropdownSelect.tsx` - dropdown selection component
  - 📤 `InputUpload.tsx` - file upload component for replay JSON files
  - ⏳ `Spinner.tsx`, `Spinner.tsx`, `SectionLoading.tsx`, `PageLoading.tsx` - loading state components
  - 🦴 `SkeletonLoader.tsx` - skeleton loader for content placeholders
  - 🚫 `PlaceholderDetails.tsx` - placeholder component for empty states
- 🎨 `src/layouts/` - shared page/layout structures (`BaseLayout.tsx`)
- 📄 `src/pages/` - route-level pages (`Home.tsx`)
- 🗺️ `src/routes/` - router configuration and route entry points
- 🎣 `src/hooks/` - custom React hooks
- 🔌 `src/services/` - API or data service logic
- 📚 `src/types/` - shared TypeScript type definitions:
  - 🎮 `parsed-replay.ts` - replay data types
  - 🌐 `replay-api.ts` - API response types
  - 👹 `mob-db.ts` - mob database types
  - ⚔️ `skill-db.ts` - skill database types
- 🛠️ `src/utils/` - helper functions and utilities:
  - 🔄 `parse-replay-json.ts` - replay file parsing logic
- ⚙️ `src/constants/` - shared constants and config values
- 🎨 `src/assets/` - local static assets (SVG icons, etc.)
- 📂 `public/` - public static files:
  - 📋 `public/yaml/` - Ragnarok database files (mob_db.yml, skill_db.yml)
- 📖 `README.md` - project documentation

## 📖 Usage

1. 🚀 Start the development server with `npm run dev`
2. 🌐 Open the application in your browser
3. 📤 Use the file upload component to select a replay file
4. 📊 The application will parse the replay data and display:
   - 📋 Structured replay breakdown with key information
   - 📈 Formatted data tables for detailed statistics
   - 👹⚔️ Mob and skill database information mapped to the replay data
5. 🎯 Use dropdown selectors to filter or navigate through replay sections
6. ⏳ The interface provides loading states and placeholders during data processing

For development, extend the app by adding new pages, components, hooks, or services as the project grows.

## 📜 License

This project is open source. Modify and use it according to your needs.

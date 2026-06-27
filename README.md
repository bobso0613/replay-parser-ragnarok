# Replay Parser Ragnarok

Replay Parser Ragnarok is a React + Vite frontend application for exploring Ragnarok Online replay data in the browser. The project has been organized into feature-oriented folders so the UI, routing, services, hooks, and shared types are easier to maintain.

## Features

- Browse replay-related data through a modern web interface
- Organize UI into reusable components, layouts, and pages
- Use route-based navigation through the app shell
- Keep shared logic in hooks, services, utilities, and constants
- Prepare the frontend for future replay parsing and visualization features

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file and set any required environment variables for your local setup.
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the local Vite URL in your browser to use the app.

> Note: This project requires certain files to be placed in the public/ folder. The contents of public/external are expected to include RagnarokReplayExample.exe, which will be run through a separate service such as a Node.js app using npm and Wine. The YAML files are Ragnarok-related database files, such as mob lists, skill lists, item lists, and similar data.

## Development

Useful commands:

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Project Structure

- `src/` - main application source code
- `src/components/` - reusable UI components
- `src/layouts/` - shared page/layout structures
- `src/pages/` - route-level pages
- `src/routes/` - router configuration and route entry points
- `src/hooks/` - custom hooks
- `src/services/` - API or data service logic
- `src/types/` - shared TypeScript types
- `src/utils/` - helper functions and utilities
- `src/constants/` - shared constants and config values
- `src/assets/` - local static assets
- `public/` - public static files, including required external and YAML assets
- `README.md` - project documentation

## Usage

Use the interface to explore replay data and extend the app by adding new pages, components, hooks, or services as the project grows.

## License

This project is open source. Modify and use it according to your needs.

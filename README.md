# Replay Parser Ragnarok

Replay Parser Ragnarok is a frontend web application for exploring Ragnarok Online replay data in the browser. Built with React and Vite, it is intended to turn replay files into clear tables, summaries, and visual insights for easier analysis.

## Features

- Load and inspect Ragnarok Online replay files in a web interface
- View damage breakdowns by character, skill, and monster
- Explore summary tables for characters and monsters
- Visualize combat activity through charts and dashboards
- Build a more interactive experience for replay analysis

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open the local Vite URL in your browser and use the app to explore replay data.

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

- `src/` - React components, frontend logic, and app UI
- `public/` - static assets served by the app, including required external and YAML files
- `src/assets/` - images and other local assets
- `README.md` - project documentation

## Usage

Use the interface to load replay data and review the generated summaries and visualizations directly in the browser.

## License

This project is open source. Modify and use it according to your needs.

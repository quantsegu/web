# Suggested commands

- Dev server: `npx vite --port 5174` (or `npm run dev`, default 5173). `node_modules` is gitignored; run `npm install` at root first.
- Type-check: `npx tsc --noEmit`.
- Production build WITHOUT the grocery sub-build: `npx vite build` (output `dist/`, gitignored). Avoid `npm run build` for quick checks; it re-installs `tools/grocery-business-analysis`.
- Visual check headless on macOS: Chrome at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome --headless=new`. `--screenshot` with `--virtual-time-budget` does NOT advance motion animations (captures faded-in-progress frames); drive via remote debugging (CDP) with a real-time wait instead.

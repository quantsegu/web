# Tech stack

- Vite 5 + React 18 + TypeScript (strict, `noUnusedLocals/Parameters`), Tailwind 3 (`tailwind.config.js`), `motion` (import from `motion/react`), `react-router-dom` 7 (BrowserRouter), `lucide-react`, `js-yaml`.
- Node >=18; Railway builds with Dockerfile `node:20-alpine` (`npm ci`, `npm run build`, serves `dist` via `npx serve -s dist`). `vercel.json` and `nixpacks.toml` also exist.
- `npm run build` = `build:grocery-business-analysis` (runs `npm install` + build inside `tools/grocery-business-analysis`) then `tsc` then `vite build`. Built grocery tool output is committed under `public/wealth-tools/grocery-business-analysis/`.
- No test runner. `npm run lint` is defined but there is no ESLint config in the repo, so it does not work as-is.
- Repo: github.com/quantsegu/web, branch `main` (commits go straight to main; Railway deploys from it).
